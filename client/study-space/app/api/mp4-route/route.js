import { GoogleAIFileManager } from "@google/generative-ai/server";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import busboy from "busboy";
import { Readable } from "stream";

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

export async function POST(req) {
  let tempFilePath = "";

  try {
    const tempDir = os.tmpdir();
    let mimeType = "";
    let fileName = "";

    const contentType = req.headers.get("content-type") || "";
    
    if (!contentType.includes("multipart/form-data")) {
        return NextResponse.json({ error: "Content type must be multipart/form-data" }, { status: 400 });
    }

    const bb = busboy({ headers: { "content-type": contentType } });
    
    // Create a promise that resolves when the file is fully written to disk
    const fileWritePromise = new Promise((resolve, reject) => {
      bb.on("file", (name, file, info) => {
        const { filename, mimeType: mime } = info;
        fileName = filename;
        mimeType = mime;
        tempFilePath = path.join(tempDir, `upload_${Date.now()}_${filename}`);
        
        const writeStream = fs.createWriteStream(tempFilePath);
        file.pipe(writeStream);
        
        writeStream.on("finish", () => {
            resolve();
        });
        
        writeStream.on("error", (err) => reject(err));
      });

      bb.on("error", (err) => reject(err));
    });

    // Create a promise for the busboy parsing completion
    const bbPromise = new Promise((resolve, reject) => {
        bb.on("close", resolve);
        bb.on("error", reject);
    });

    // Convert Web ReadableStream to Node Readable and pipe to busboy
    if (!req.body) {
        return NextResponse.json({ error: "No request body" }, { status: 400 });
    }
    const nodeStream = Readable.fromWeb(req.body);
    nodeStream.pipe(bb);

    // Wait for both busboy to finish parsing AND the file to finish writing
    await Promise.all([bbPromise, fileWritePromise]);

    if (!tempFilePath) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Verify file exists and has size
    const stats = fs.statSync(tempFilePath);
    if (stats.size === 0) {
         return NextResponse.json({ error: "Uploaded file is empty" }, { status: 400 });
    }

    // Validate file size (10MB limit for Next.js, 20MB for Gemini)
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (stats.size > maxSizeBytes) {
        // Clean up temp file
        try {
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
        } catch (e) {}
        return NextResponse.json({ 
            error: `File size (${(stats.size / 1024 / 1024).toFixed(2)}MB) exceeds the 10MB limit` 
        }, { status: 400 });
    }

    // Validate MIME type - accept video files, especially MP4
    const allowedMimeTypes = [
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'video/x-msvideo',
        'video/webm'
    ];
    
    if (!mimeType || (!mimeType.startsWith('video/') && !allowedMimeTypes.includes(mimeType))) {
        // Clean up temp file
        try {
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
        } catch (e) {}
        return NextResponse.json({ 
            error: `Invalid file type. Please upload a video file (MP4, MOV, AVI, etc.). Received: ${mimeType || 'unknown'}` 
        }, { status: 400 });
    }

    console.log(`Uploading to Gemini: ${fileName} (${mimeType}), size: ${(stats.size / 1024 / 1024).toFixed(2)}MB`);

    // Upload to Gemini
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: mimeType,
      displayName: fileName,
    });

    console.log(`Upload complete. URI: ${uploadResult.file.uri}`);

    // Clean up temp file immediately after upload
    try {
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
    } catch (cleanupErr) {
        console.warn("Failed to delete temp file:", cleanupErr);
    }

    // Wait for processing
    let fileRecord = await fileManager.getFile(uploadResult.file.name);
    while (fileRecord.state === "PROCESSING") {
      console.log(`Processing... Current state: ${fileRecord.state}`);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Increase poll interval
      fileRecord = await fileManager.getFile(uploadResult.file.name);
    }

    console.log(`Final state: ${fileRecord.state}`);

    if (fileRecord.state === "FAILED") {
      console.error("Video processing failed:", fileRecord);
      return NextResponse.json({ error: "Video processing failed by Gemini" }, { status: 500 });
    }

    return NextResponse.json({ 
      fileUri: uploadResult.file.uri, 
      mimeType: uploadResult.file.mimeType,
      name: uploadResult.file.name
    });

  } catch (error) {
    console.error("Error uploading file:", error);
    // Clean up on error
    if (tempFilePath && fs.existsSync(tempFilePath)) {
        try { fs.unlinkSync(tempFilePath); } catch (e) {}
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}