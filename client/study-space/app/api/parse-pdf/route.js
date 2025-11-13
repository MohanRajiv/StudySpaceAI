import { NextResponse } from "next/server";
import PDFParser from "pdf2json";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

    const buffer = Buffer.from(await file.arrayBuffer());

    const text = await new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => reject(err));
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
    let extracted = "";
      for (const page of pdfData.Pages || []) {
        for (const textItem of page.Texts || []) {
          for (const run of textItem.R || []) {
            if (run.T) extracted += decodeURIComponent(run.T) + " ";
          }
        }
      }
      resolve(extracted.trim());
    });

    pdfParser.parseBuffer(buffer); 
  });

  return NextResponse.json({ text });
}
