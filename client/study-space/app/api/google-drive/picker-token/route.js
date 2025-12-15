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

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const credentials = oauth2Client.credentials;

    return NextResponse.json({ 
      accessToken: credentials.access_token,
      clientId: process.env.GOOGLE_CLIENT_ID
    });
  } catch (error) {
    console.error("Error getting picker token:", error);
    if (error.code === 401) {
      return NextResponse.json(
        { error: "Token expired. Please reconnect Google Drive." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to get picker token" },
      { status: 500 }
    );
  }
}

