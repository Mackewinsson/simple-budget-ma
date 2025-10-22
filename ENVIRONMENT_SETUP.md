# Environment Setup Guide - PresuSimple

This guide explains how to set up and manage different environments for the PresuSimple app following Expo's best practices.

## 🏗️ Environment Structure

The app supports four main environments:

- **Development** (`development`) - Local development with hot reload
- **Staging** (`staging`) - Internal testing and QA
- **Preview** (`preview`) - Pre-production testing
- **Production** (`production`) - Live app store releases

## 📁 Environment Files

### Environment File Hierarchy
```
.env.local          # Local overrides (ignored by git)
.env.development    # Development defaults (committed)
.env.staging        # Staging configuration (committed)
.env.production     # Production configuration (ignored by git)
.env.example        # Template file (committed)
```

### File Priority (highest to lowest)
1. `.env.local` - Local development overrides
2. `.env.development` - Development defaults
3. `app.config.ts` - Hardcoded fallbacks

## 🔧 Setup Instructions

### 1. Initial Setup
```bash
# Copy the example file to create your local environment
cp .env.example .env.local

# Edit .env.local with your actual values
nano .env.local
```

### 2. Environment Variables

#### Required Variables
```bash
# API Configuration
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_ENV=development

# Google OAuth
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID=your-expo-google-client-id
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-google-client-id
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-google-client-id
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-google-client-id
```

#### Optional Variables
```bash
# Feature Flags
EXPO_PUBLIC_FEATURE_FLAGS_URL=http://localhost:3000/api/feature-flags

# Analytics
EXPO_PUBLIC_ANALYTICS_ENABLED=false
EXPO_PUBLIC_ANALYTICS_DEBUG=true

# Debug Settings
EXPO_PUBLIC_DEBUG_MODE=true
EXPO_PUBLIC_LOG_LEVEL=debug
```

## 🚀 Development Commands

### Local Development
```bash
# Start with development environment
npm run start:dev

# Start with staging environment
npm run start:staging

# Start with default environment
npm start
```

### Building for Different Environments

#### Development Builds
```bash
# iOS Development Build
npm run build:dev:ios

# Android Development Build (when needed)
npm run build:dev:android
```

#### Staging Builds
```bash
# iOS Staging Build
npm run build:staging:ios

# Android Staging Build
npm run build:staging:android
```

#### Production Builds
```bash
# iOS Production Build
npm run build:prod:ios

# Android Production Build
npm run build:prod:android
```

## 📱 EAS Build Profiles

### Development Profile
- **Purpose**: Local development with development client
- **Distribution**: Internal
- **Features**: Debug mode, development API endpoints
- **Build Type**: Development client

### Staging Profile
- **Purpose**: Internal testing and QA
- **Distribution**: Internal
- **Features**: Staging API endpoints, limited analytics
- **Build Type**: Release build

### Preview Profile
- **Purpose**: Pre-production testing
- **Distribution**: Internal
- **Features**: Staging API endpoints, production-like settings
- **Build Type**: Release build

### Production Profile
- **Purpose**: App store releases
- **Distribution**: Store
- **Features**: Production API endpoints, full analytics
- **Build Type**: Release build with auto-increment

## 🔐 Security Best Practices

### Environment Variables
- ✅ Use `EXPO_PUBLIC_` prefix for client-side variables
- ✅ Never commit sensitive data to version control
- ✅ Use `.env.local` for local development secrets
- ✅ Validate required variables at runtime

### API Keys
- ✅ Use different API keys for each environment
- ✅ Rotate keys regularly
- ✅ Monitor API usage per environment
- ✅ Use environment-specific OAuth configurations

## 🧪 Testing Different Environments

### Local Testing
```bash
# Test development environment
EXPO_PUBLIC_ENV=development npm start

# Test staging environment
EXPO_PUBLIC_ENV=staging npm start
```

### Device Testing
```bash
# Install development build
npm run build:dev:ios
# Install on device via EAS

# Install staging build
npm run build:staging:ios
# Install on device via EAS
```

## 📊 Environment Monitoring

### Analytics Configuration
- **Development**: Analytics disabled or debug mode
- **Staging**: Analytics enabled with debug mode
- **Production**: Analytics enabled, debug disabled

### Logging Levels
- **Development**: `debug` - All logs
- **Staging**: `warn` - Warnings and errors
- **Production**: `error` - Errors only

## 🚨 Troubleshooting

### Common Issues

#### Environment Variables Not Loading
```bash
# Check if .env.local exists
ls -la .env.local

# Verify environment file syntax
cat .env.local

# Restart Expo server
npm start
```

#### Build Failures
```bash
# Check EAS configuration
eas config

# Verify environment variables in build
eas build --profile development --platform ios --local
```

#### API Connection Issues
```bash
# Verify API_BASE_URL in environment
echo $EXPO_PUBLIC_API_BASE_URL

# Check network connectivity
curl -I $EXPO_PUBLIC_API_BASE_URL
```

## 📚 Additional Resources

- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [EAS Build Configuration](https://docs.expo.dev/build/eas-json/)
- [Expo Config](https://docs.expo.dev/versions/latest/config/app/)

## 🔄 Environment Workflow

### Development Workflow
1. Make changes locally with `.env.local`
2. Test with `npm run start:dev`
3. Build development client if needed
4. Test on device

### Staging Workflow
1. Update `.env.staging` if needed
2. Build staging version: `npm run build:staging:ios`
3. Deploy to internal testing
4. QA testing and feedback

### Production Workflow
1. Update production environment variables in EAS
2. Build production version: `npm run build:prod:ios`
3. Submit to app stores: `npm run submit:prod:ios`
4. Monitor production metrics

---

**Remember**: Always test environment changes in staging before deploying to production! 🚀
