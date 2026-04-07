"""
GlimmoraTeam — AI SOW Generator API
FastAPI + MongoDB backend for the 10-step SOW Wizard.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import connect_db, close_db
from app.routers import auth, wizard, sow, approvals, users, reviewer


# ──────────────────────────────────────────────
# LIFESPAN
# ──────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    await create_indexes()
    yield
    await close_db()


async def create_indexes():
    """Create MongoDB indexes for performance."""
    from app.core.database import get_database
    db = get_database()

    # Users
    await db["users"].create_index("email", unique=True)

    # Wizards
    await db["wizards"].create_index("created_by_user_id")
    await db["wizards"].create_index("enterprise_id")
    await db["wizards"].create_index("status")

    # SOWs
    await db["sows"].create_index("wizard_id")
    await db["sows"].create_index("created_by_user_id")
    await db["sows"].create_index("status")
    await db["sows"].create_index("enterprise_id")

    # OTP codes (TTL — auto-expire)
    await db["otp_codes"].create_index([("type", 1), ("target", 1)])
    await db["otp_codes"].create_index("expires_at", expireAfterSeconds=0)

    # Password reset tokens (TTL — expire 1 hour after creation)
    await db["password_resets"].create_index("token", unique=True)
    await db["password_resets"].create_index("expires_at", expireAfterSeconds=0)

    # Sessions — active refresh token sessions
    await db["sessions"].create_index("user_id")
    await db["sessions"].create_index("refresh_token_hash", unique=True)
    await db["sessions"].create_index("expires_at", expireAfterSeconds=0)  # TTL auto-expire

    # Reviewer assignments + evidence recommendations
    await db["reviewer_assignments"].create_index("reviewer_user_id")
    await db["reviewer_assignments"].create_index([("reviewer_user_id", 1), ("status", 1)])
    await db["evidence_recommendations"].create_index("reviewer_user_id")
    await db["evidence_recommendations"].create_index([("evidence_id", 1), ("reviewer_user_id", 1)])

    print("MongoDB indexes created.")


# ──────────────────────────────────────────────
# APP INSTANCE
# ──────────────────────────────────────────────

_openapi_tags = [
    {"name": "Health", "description": "Liveness and database connectivity."},
        {
            "name": "Authentication",
            "description": (
                "Public: ``POST /auth/login``, ``/auth/validate``, ``/auth/register/enterprise``, "
                "``/auth/register/contributor``, ``/auth/refresh``, ``/auth/logout``, ``/auth/password/forgot``. "
                "Protected: ``/auth/logout-all``, ``/auth/me``, ``/auth/session``, ``/auth/sessions``, revoke session, "
                "``/auth/password/change``. "
                "MFA: ``/auth/mfa/*`` (see MFA tag)."
            ),
        },
        {
            "name": "MFA",
            "description": (
                "Six operations: ``setup/init``, ``setup/confirm``, ``verify``, ``recovery``, ``disable``, ``status``. "
                "Extra helpers (cancel setup, rotate recovery codes) exist but are omitted from this document."
            ),
        },
    {"name": "SOW Wizard", "description": "10-step wizard CRUD and SOW generation."},
    {"name": "AI Draft Review", "description": "List and review generated SOWs, hallucination analysis, actions."},
    {
        "name": "Approval Pipeline",
        "description": "Multi-stage approval pipeline.",
    },
    {
        "name": "Users & Enterprise",
        "description": "User search and admin reviewer provisioning.",
    },
]
if settings.REVIEWER_API_ENABLED:
    _openapi_tags.append(
        {"name": "Reviewer", "description": "Reviewer dashboard and evidence (requires MFA)."},
    )

app = FastAPI(
    title="GlimmoraTeam API",
    description="",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    # Kept enabled so ``GET /`` and docs match ``/redoc`` (README links).
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    openapi_tags=_openapi_tags,
)


def custom_openapi():
    """Strip long marketing copy from the OpenAPI document (Swagger / clients)."""
    if app.openapi_schema:
        return app.openapi_schema
    schema = get_openapi(
        title=app.title,
        version=app.version,
        description="",
        routes=app.routes,
    )
    info = schema.setdefault("info", {})
    info["description"] = ""
    for key in ("contact", "license", "termsOfService"):
        info.pop(key, None)
    app.openapi_schema = schema
    return app.openapi_schema


app.openapi = custom_openapi


# ──────────────────────────────────────────────
# MIDDLEWARE
# ──────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
# EXCEPTION HANDLERS
# ──────────────────────────────────────────────

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Returns structured validation errors matching wizard field-level error display.
    Format: { field_path: [error_message] }
    """
    errors = []
    for error in exc.errors():
        err_type = error.get("type", "")
        if err_type == "json_invalid":
            loc_parts = [str(x) for x in error.get("loc", ()) if x != "body"]
            hint = (
                "Request body is not valid JSON (check around that position). "
                "Use double quotes for keys and strings, no trailing commas, no comments."
            )
            field_label = f"body (char {loc_parts[0]})" if loc_parts else "body"
            errors.append({"field": field_label, "message": hint, "type": err_type})
            continue
        loc = " → ".join(str(l) for l in error["loc"] if l != "body")
        errors.append({
            "field": loc,
            "message": error["msg"],
            "type": err_type,
        })
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": "Validation failed. Please correct the highlighted fields.",
            "errors": errors,
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An internal error occurred. Please try again.",
            "detail": str(exc),
        }
    )


# ──────────────────────────────────────────────
# ROUTERS
# ──────────────────────────────────────────────

API_PREFIX = "/api/v1"

app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(wizard.router, prefix=API_PREFIX)
app.include_router(sow.router, prefix=API_PREFIX)
app.include_router(approvals.router, prefix=API_PREFIX)
app.include_router(users.router, prefix=API_PREFIX)
if settings.REVIEWER_API_ENABLED:
    app.include_router(reviewer.router, prefix=API_PREFIX)


# ──────────────────────────────────────────────
# ROOT
# ──────────────────────────────────────────────

@app.get("/", tags=["Health"], summary="API health check")
async def root():
    return {
        "service": "GlimmoraTeam AI SOW Generator API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/health", tags=["Health"], summary="Detailed health check")
async def health():
    from app.core.database import get_database
    try:
        db = get_database()
        await db.command("ping")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "ok" if db_status == "connected" else "degraded",
        "database": db_status,
        "version": "1.0.0",
    }
