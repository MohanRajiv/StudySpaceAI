import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { google } from "googleapis";

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      console.error("Missing Google OAuth environment variables:", {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        hasRedirectUri: !!redirectUri,
      });
      return NextResponse.json(
        { 
          error: "Google Drive integration not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI environment variables." 
        },
        { status: 500 }
      );
    }

    // Initialize OAuth2Client with validated environment variables
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    const scopes = [
      "https://www.googleapis.com/auth/drive.readonly",
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
      state: userId, // Pass userId in state for verification
    });

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return NextResponse.json(
      { error: `Failed to generate auth URL: ${error.message}` },
      { status: 500 }
    );
  }
}

