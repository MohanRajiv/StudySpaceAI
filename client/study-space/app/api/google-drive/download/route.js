import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { connectToDB } from "@/database";
import User from "@/modals/user.modal";

function getOAuth2Client(userTokens) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Google OAuth environment variables not configured");
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  oauth2Client.setCredentials({
    access_token: userTokens.accessToken,
    refresh_token: userTokens.refreshToken,
    expiry_date: userTokens.expiryDate?.getTime(),
  });

  return oauth2Client;
}

async function refreshAccessToken(oauth2Client, user) {
  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    
    user.googleDriveTokens.accessToken = credentials.access_token;
    if (credentials.refresh_token) {
      user.googleDriveTokens.refreshToken = credentials.refresh_token;
    }
    if (credentials.expiry_date) {
      user.googleDriveTokens.expiryDate = new Date(credentials.expiry_date);
    }
    await user.save();

    oauth2Client.setCredentials(credentials);
    return oauth2Client;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId } = await req.json();
    if (!fileId) {
      return NextResponse.json({ error: "File ID required" }, { status: 400 });
    }

    await connectToDB();
    const user = await User.findOne({ clerkId: userId });

    if (!user || !user.googleDriveTokens?.accessToken) {
      return NextResponse.json(
        { error: "Google Drive not connected" },
        { status: 400 }
      );
    }

    const oauth2Client = getOAuth2Client(user.googleDriveTokens);

    // Check if token is expired and refresh if needed
    if (user.googleDriveTokens.expiryDate && new Date() >= user.googleDriveTokens.expiryDate) {
      await refreshAccessToken(oauth2Client, user);
    }

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // Get file metadata
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: "id, name, mimeType, size",
    });

    let fileBuffer;
    let mimeType = fileMetadata.data.mimeType;

    // Handle Google Docs/Sheets/Slides (export as PDF)
    if (mimeType.includes("google-apps")) {
      let exportMimeType = "application/pdf";
      if (mimeType === "application/vnd.google-apps.document") {
        exportMimeType = "application/pdf";
      } else if (mimeType === "application/vnd.google-apps.spreadsheet") {
        exportMimeType = "application/pdf";
      } else if (mimeType === "application/vnd.google-apps.presentation") {
        exportMimeType = "application/pdf";
      }

      const response = await drive.files.export(
        {
          fileId: fileId,
          mimeType: exportMimeType,
        },
        { responseType: "arraybuffer" }
      );

      fileBuffer = Buffer.from(response.data);
      mimeType = exportMimeType;
    } else {
      // Download regular files
      const response = await drive.files.get(
        {
          fileId: fileId,
          alt: "media",
        },
        { responseType: "arraybuffer" }
      );

      fileBuffer = Buffer.from(response.data);
    }

    // Convert buffer to base64 for JSON response
    // In a real app, you might want to stream this directly
    const base64 = fileBuffer.toString("base64");

    return NextResponse.json({
      fileData: base64,
      fileName: fileMetadata.data.name,
      mimeType: mimeType,
      size: fileMetadata.data.size,
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    if (error.code === 401) {
      return NextResponse.json(
        { error: "Token expired. Please reconnect Google Drive." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}

