import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { connectToDB } from "@/database";
import User from "@/modals/user.modal";

function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Google OAuth environment variables not configured");
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL("/create?error=unauthorized", req.url));
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
      return NextResponse.redirect(new URL("/create?error=no_code", req.url));
    }

    // Verify state matches userId
    if (state !== userId) {
      return NextResponse.redirect(new URL("/create?error=invalid_state", req.url));
    }

    // Initialize OAuth2Client
    const oauth2Client = getOAuth2Client();

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store tokens in database
    await connectToDB();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.redirect(new URL("/create?error=user_not_found", req.url));
    }

    user.googleDriveTokens = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    };

    await user.save();

    return NextResponse.redirect(new URL("/create?google_drive=connected", req.url));
  } catch (error) {
    console.error("Error in OAuth callback:", error);
    return NextResponse.redirect(new URL("/create?error=callback_failed", req.url));
  }
}

