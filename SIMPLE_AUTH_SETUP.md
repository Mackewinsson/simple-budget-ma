# Simple Authentication Setup

This app now uses a simple username/password authentication system instead of OAuth.

## How It Works

1. **User enters credentials** in the login form (username and password)
2. **App sends POST request** to `/api/mobile-login` with credentials
3. **Server validates credentials** and returns user data and JWT token
4. **App stores session** securely in SecureStore
5. **All API requests** automatically include the JWT token in Authorization header
6. **Session persists** across app restarts until token expires

## Files Created/Modified

### New Files:
- `src/auth/SimpleAuthProvider.tsx` - Simple authentication context provider
- `components/LoginForm.tsx` - Username/password login form
- `src/api/auth.ts` - Authentication API functions

### Modified Files:
- `app/auth/login.tsx` - Updated to use new login form
- `app/_layout.tsx` - Updated to use SimpleAuthProvider
- `src/api/client.ts` - Updated to use simple auth tokens
- `app/test.tsx` - Updated with authentication testing

## API Endpoints Required

Your backend needs to implement these endpoints:

### POST /api/mobile-login
```json
// Request
{
  "username": "user123",
  "password": "password123"
}

// Response
{
  "user": {
    "id": "user-id",
    "username": "user123",
    "email": "user@example.com"
  },
  "token": "jwt-token-here",
  "expires": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/auth/logout
```json
// Request (with Authorization: Bearer <token>)
// Response: 200 OK
```

## Testing

1. **Start your backend server** (should be running on localhost:3001)
2. **Start the Expo app**: `npm start`
3. **Navigate to login screen**: Go to `/auth/login`
4. **Test authentication**: Enter username and password
5. **Test session**: Navigate to `/test` to see authentication status
6. **Test logout**: Use the sign out button on the test screen

## Environment Variables

Make sure your backend server is configured to:
- Accept CORS requests from your mobile app
- Validate JWT tokens on protected routes
- Return proper error responses for invalid credentials

## Security Notes

- Passwords are sent over HTTPS (make sure your API uses SSL in production)
- JWT tokens are stored securely in SecureStore
- Tokens are automatically cleared on 401 responses
- Session expires based on server-provided expiration time
