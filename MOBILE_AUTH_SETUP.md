# Mobile Authentication Setup

This Expo app now uses the mobile authentication bridge to authenticate with your Next.js backend.

## How It Works

1. **Mobile app** opens NextAuth signin URL with mobile callback
2. **User signs in** via Google OAuth in web browser
3. **NextAuth redirects** to `/api/mobile/finish` with session
4. **Finish route** generates one-time code and redirects to `myapp://auth/callback?code=...`
5. **Mobile app** receives deep link, extracts code
6. **Mobile app** calls `/api/mobile/exchange?code=...` to get JWT
7. **Mobile app** stores JWT in SecureStore and uses it for API calls

## Files Created/Modified

### New Files:
- `src/auth/useMobileAuth.ts` - Mobile authentication hook
- `src/auth/MobileAuthProvider.tsx` - Auth context provider
- `app/test-auth.tsx` - Test screen for authentication

### Modified Files:
- `app.config.ts` - Updated scheme to "myapp" and API URL to localhost:3000
- `src/api/client.ts` - Updated to use JWT tokens from SecureStore
- `app/auth/login.tsx` - Updated to use new mobile auth
- `app/_layout.tsx` - Updated to use MobileAuthProvider
- `src/lib/env.ts` - Updated API URL to localhost:3000

## Testing

1. **Start your Next.js server** (should be running on localhost:3000)
2. **Start the Expo app**: `npm start`
3. **Navigate to test screen**: Go to `/test-auth` in the app
4. **Test authentication**: Tap "Sign In" and complete the OAuth flow
5. **Test API**: Tap "Test API" to verify JWT authentication works

## Environment Variables

Make sure your Next.js server has:
```bash
MOBILE_JWT_SECRET=your-strong-random-secret-here
```

## Deep Link Configuration

The app is configured to use the `myapp://` scheme. When testing:
- The signin URL will redirect to `myapp://auth/callback?code=...`
- Make sure your device/simulator can handle this deep link

## API Integration

All API calls now automatically include the JWT token:
```typescript
import client from '../src/api/client';

// This will automatically include Authorization: Bearer <jwt>
const response = await client.get('/api/expenses');
```

## Troubleshooting

1. **Deep link not working**: Check that the scheme in app.config.ts matches the redirect URL
2. **API calls failing**: Verify the Next.js server is running on localhost:3000
3. **Authentication failing**: Check the browser console and mobile logs for errors
4. **JWT verification failing**: Ensure MOBILE_JWT_SECRET is set in your Next.js environment
