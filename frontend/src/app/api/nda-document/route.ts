import { NextResponse } from "next/server";
import mammoth from "mammoth";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "Glimmora International Product-Development-Non-Disclosure-Agreement.docx");
  const result = await mammoth.convertToHtml({ path: filePath });
  return NextResponse.json({ html: result.value });
}
