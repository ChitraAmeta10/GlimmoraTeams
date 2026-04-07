import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") ?? "";
  const date = searchParams.get("date") ?? new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  const pdfPath = path.join(process.cwd(), "public", "Glimmora International Product-Development-Non-Disclosure-Agreement.pdf");
  const existingPdfBytes = fs.readFileSync(pdfPath);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { height } = firstPage.getSize();

  // ── White out the "Mr/Ms. ------------" placeholder ──
  firstPage.drawRectangle({
    x: 152,
    y: height - 148,
    width: 130,
    height: 10,
    color: rgb(1, 1, 1),
  });

  // ── Draw signed name ──
  firstPage.drawText(name, {
    x: 152,
    y: height - 147,
    size: 9,
    font,
    color: rgb(0.1, 0.1, 0.1),
  });

  // ── White out "DD-MM-YYYY" placeholder ──
  firstPage.drawRectangle({
    x: 272,
    y: height - 158,
    width: 70,
    height: 10,
    color: rgb(1, 1, 1),
  });

  // ── Draw date ──
  firstPage.drawText(date, {
    x: 272,
    y: height - 158,
    size: 9,
    font: regularFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  // ── Signature block on last page (page 3) ──
  const lastPage = pages[pages.length - 1];
  const { height: lastH } = lastPage.getSize();

  // Consultant signature line
  lastPage.drawText(name, {
    x: 72,
    y: lastH - 390,
    size: 13,
    font,
    color: rgb(0.05, 0.45, 0.35),
  });

  lastPage.drawText(`Name: ${name}`, {
    x: 72,
    y: lastH - 408,
    size: 9,
    font: regularFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  lastPage.drawText(`Date: ${date}`, {
    x: 72,
    y: lastH - 420,
    size: 9,
    font: regularFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="NDA-Signed-${name.replace(/\s+/g, "-")}.pdf"`,
    },
  });
}
