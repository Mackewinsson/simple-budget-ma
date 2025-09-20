# 🔐 Authentication Setup Guide

This guide will help you set up Google OAuth authentication for your Simple Budget mobile app.

## Prerequisites

1. **Google Cloud Console Project**: You need a Google Cloud project with OAuth 2.0 credentials
2. **Next.js API Server**: Your Next.js server must be running and configured for OAuth

## Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application" for the Next.js server
   - Choose "Mobile app" for the Expo app

### For Next.js Server (Web Application):
- **Authorized JavaScript origins**: `http://localhost:3001`
- **Authorized redirect URIs**: `http://localhost:3001/api/auth/callback/google`

### For Expo App (Mobile Application):
- **Package name**: `com.yourcompany.budgetingmobile` (or your actual package name)
- **SHA-1 certificate fingerprint**: Get this from your Expo project

## Step 2: Environment Variables

Create a `.env` file in your Expo project root:

```bash
# Google OAuth Configuration
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
EXPO_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# API Configuration
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Step 3: Next.js API Configuration

Make sure your Next.js server has the following environment variables:

```bash
# .env.local in your Next.js project
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## Step 4: API Endpoints

Your Next.js server needs these additional endpoints for mobile authentication:

### `/api/auth/callback/google` (POST)
```typescript
// app/api/auth/callback/google/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

export async function POST(request: NextRequest) {
  try {
    const { code, redirectUri } = await request.json();
    
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    
    // Create or find user in your database
    // ... user creation logic ...
    
    return NextResponse.json({
      user: {
        id: user._id,
        email: payload?.email,
        name: payload?.name,
        image: payload?.picture,
      },
      accessToken: tokens.access_token,
      expires: new Date(Date.now() + (tokens.expiry_date || 3600000)).toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
```

### `/api/auth/signout` (POST)
```typescript
// app/api/auth/signout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Handle sign out logic
  return NextResponse.json({ success: true });
}
```

## Step 5: Testing

1. Start your Next.js server: `npm run dev`
2. Start your Expo app: `npx expo start`
3. Open the app and try to sign in with Google
4. Check the console logs for any errors

## Troubleshooting

### Common Issues:

1. **"Invalid client" error**: Check that your Google Client ID is correct
2. **"Redirect URI mismatch"**: Ensure the redirect URI in Google Console matches your app's scheme
3. **"Access blocked"**: Make sure your Google Cloud project has the necessary APIs enabled
4. **Network errors**: Verify that your Next.js server is running and accessible

### Debug Steps:

1. Check the Expo logs: `npx expo start --clear`
2. Check the Next.js server logs
3. Verify environment variables are loaded correctly
4. Test the API endpoints directly with curl or Postman

## Security Notes

- Never commit your `.env` files to version control
- Use different OAuth credentials for development and production
- Implement proper token refresh logic for production
- Consider implementing additional security measures like rate limiting

## Next Steps

Once authentication is working:

1. Update your API routes to require authentication
2. Implement proper error handling
3. Add loading states and user feedback
4. Test on both iOS and Android devices
5. Set up production OAuth credentials

For more information, refer to:
- [Expo Auth Session Documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js Documentation](https://next-auth.js.org/)
