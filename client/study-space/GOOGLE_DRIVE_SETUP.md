# Google Drive Integration Setup Guide

This guide will help you set up Google Drive integration for your StudySpace.AI application.

## Prerequisites

- Google Cloud Platform account
- Access to your application's environment variables

## Step 1: Enable Required APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   
   **a. Google Drive API:**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click on it and press "Enable"
   
   **b. Google Picker API:**
   - Still in "APIs & Services" > "Library"
   - Search for "Google Picker API"
   - Click on it and press "Enable"
   - ⚠️ **Important**: This API is required for the native Google Drive file picker interface

## Step 2: Create OAuth 2.0 Credentials

1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in the required app information
   - Add scopes: `https://www.googleapis.com/auth/drive.readonly`
   - Add test users if your app is in testing mode
4. For the OAuth client:
   - Application type: "Web application"
   - Name: "StudySpace.AI" (or your preferred name)
   - Authorized redirect URIs: Add your callback URL
     - For local development: `http://localhost:3000/api/google-drive/callback`
     - For production: `https://yourdomain.com/api/google-drive/callback`
   - ⚠️ **Note**: The same Client ID will be used for both OAuth authentication and the Google Picker API
5. Click "Create" and copy your Client ID and Client Secret

## Step 3: Configure Environment Variables

Add the following environment variables to your `.env.local` file (or your environment configuration):

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google-drive/callback
```

For production, update `GOOGLE_REDIRECT_URI` to your production domain:
```env
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/google-drive/callback
```

## Step 4: Install Dependencies

Make sure the `googleapis` package is installed:

```bash
npm install googleapis
```

## Step 5: Test the Integration

1. Start your development server
2. Navigate to the create page
3. Click on the Google Drive icon (next to the "+" button)
4. Click "Connect Google Drive" (if not already connected)
5. Authorize the application
6. The native Google Drive picker will open - this is Google's official file browser interface
7. Select PDF files from your Google Drive
8. The files will be downloaded and processed like regular uploads

## Features

- **OAuth 2.0 Authentication**: Secure authentication with Google Drive
- **Native Google Picker Interface**: Uses Google's official file picker with thumbnails and folder navigation
- **File Browsing**: Browse and search files in your Google Drive using the native interface
- **File Types Supported**: 
  - PDF files (automatically filtered in the picker)
- **Automatic Token Refresh**: Tokens are automatically refreshed when expired
- **Token Storage**: OAuth tokens are securely stored in your MongoDB database

## Security Notes

- OAuth tokens are stored per user in the database
- Tokens include refresh tokens for long-term access
- Only read-only access is requested (`drive.readonly` scope)
- Tokens are associated with user's Clerk ID for security

## Troubleshooting

### "Token expired" error
- The access token has expired. The app should automatically refresh it, but if it fails, the user needs to reconnect their Google Drive account.

### "Google Drive not connected" error
- The user hasn't authorized the app yet. They need to click "Connect Google Drive" and complete the OAuth flow.

### Redirect URI mismatch
- Make sure the `GOOGLE_REDIRECT_URI` environment variable exactly matches one of the redirect URIs configured in Google Cloud Console.

### Files not appearing or picker not opening
- Check that both the **Google Drive API** and **Google Picker API** are enabled in your Google Cloud project
- Verify your OAuth credentials are correct
- Check browser console for any error messages
- Ensure the Google Picker API script is loaded (check the browser console for script loading errors)

### "Google Picker API not loaded" error
- Make sure the Google Picker API is enabled in your Google Cloud Console
- Check that the script tags are loading correctly in your browser's Network tab
- Verify that `window.gapi` and `window.google` are available in the browser console

