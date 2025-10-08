# Reactotron Setup Guide

Reactotron has been installed and configured to monitor API calls in your React Native app.

## Installation

The following packages have been installed:
- `reactotron-react-native` - Core Reactotron functionality
- `reactotron-redux` - Redux integration (for future use)

## Configuration

### Files Created/Modified:

1. **`src/lib/reactotron.ts`** - Reactotron configuration
2. **`index.ts`** - Entry point that initializes Reactotron in development
3. **`src/api/client.ts`** - API client with Reactotron integration

### Features Enabled:

- **API Call Monitoring**: All HTTP requests and responses are logged
- **Request Details**: Method, URL, headers, data, and parameters
- **Response Details**: Status, headers, data, and response time
- **Error Tracking**: Failed requests with error details
- **Timing**: Request duration measurement

## Usage

### 1. Install Reactotron Desktop App

Download and install the Reactotron desktop application:
- **macOS**: Download from [GitHub Releases](https://github.com/infinitered/reactotron/releases)
- **Windows**: Download from [GitHub Releases](https://github.com/infinitered/reactotron/releases)
- **Linux**: Download from [GitHub Releases](https://github.com/infinitered/reactotron/releases)

### 2. Start Reactotron Desktop App

Launch the Reactotron desktop application before starting your React Native app.

### 3. Start Your App

```bash
npm start
# or
expo start
```

### 4. Monitor API Calls

Once your app connects to Reactotron, you'll see:
- **Timeline**: All API requests and responses in chronological order
- **API**: Detailed view of each request/response
- **State**: App state changes (if using Redux)
- **Logs**: Console logs from your app

## What You'll See

### API Requests
- HTTP method (GET, POST, PUT, DELETE)
- Full URL
- Request headers
- Request body/data
- Query parameters

### API Responses
- Response status code
- Response headers
- Response data
- Response time/duration

### Errors
- Error messages
- Error status codes
- Failed request details

## Troubleshooting

### Connection Issues
- Ensure Reactotron desktop app is running
- Check that your device/emulator can reach the host
- For Android emulator, the host is `10.0.2.2`
- For iOS simulator, the host is `localhost`

### No API Calls Showing
- Verify the app is making API calls
- Check that `__DEV__` is true (development mode)
- Ensure Reactotron is properly initialized

## Development vs Production

Reactotron is only active in development mode (`__DEV__ === true`). It will not be included in production builds, ensuring no performance impact or security concerns.

## Next Steps

You can extend Reactotron integration by:
- Adding Redux state monitoring
- Custom logging for specific app events
- Performance monitoring
- Custom commands for debugging
