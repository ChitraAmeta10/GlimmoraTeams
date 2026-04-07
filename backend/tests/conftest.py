"""
Shared pytest fixtures.

``httpx.ASGITransport`` does not run FastAPI lifespan by default, so we open the
MongoDB client explicitly before integration tests.
"""

import os

# Fail fast when MongoDB is unavailable (avoid long hangs in CI / local without mongod)
_mongo_url = os.environ.get("MONGODB_URL", "mongodb://127.0.0.1:27017")
if "serverSelectionTimeoutMS" not in _mongo_url:
    _sep = "&" if "?" in _mongo_url else "?"
    os.environ["MONGODB_URL"] = f"{_mongo_url}{_sep}serverSelectionTimeoutMS=3000"

import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.core.database import close_db, connect_db
from app.main import app


@pytest_asyncio.fixture
async def client():
    await connect_db()
    try:
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as c:
            yield c
    finally:
        await close_db()
