# Production Build Checklist

## Pre-Build Requirements

### ✅ Environment Setup
- [ ] Create `.env.production` file with production API keys
- [ ] Update `eas.json` with your Apple ID, App Store Connect App ID, and Team ID
- [ ] Verify all environment variables are set correctly

### ✅ App Store Connect Setup
- [ ] Create app in App Store Connect with bundle ID `com.presusimple.app`
- [ ] Get App Store Connect App ID (numeric)
- [ ] Complete app information (name, description, etc.)
- [ ] Update `eas.json` with your `appleId` (email) and `ascAppId`
- [ ] Prepare app screenshots and metadata

### ✅ Apple Developer Portal
- [ ] Register App ID with bundle ID `com.presusimple.app`
- [x] Apple Developer Team ID: `H3FV2Q782F` (already configured)
- [ ] Ensure Apple Developer account is active ($99/year)

## Build Process

### ✅ Pre-Build Verification
- [ ] All environment variables configured
- [ ] EAS configuration updated with correct IDs
- [ ] App Store Connect app created
- [ ] App metadata and screenshots ready

### ✅ Build Commands
```bash
# Build production version
npm run build:prod:ios

# Or directly with EAS
eas build --profile production --platform ios
```

### ✅ Build Verification
- [ ] Build completes successfully
- [ ] No build errors or warnings
- [ ] .ipa file generated
- [ ] Build size is reasonable

## Submission Process

### ✅ Pre-Submission
- [ ] Build uploaded to App Store Connect
- [ ] App version created in App Store Connect
- [ ] All app information completed
- [ ] Screenshots uploaded
- [ ] App description and metadata complete
- [ ] Privacy policy URL provided
- [ ] App review information completed

### ✅ Submission Commands
```bash
# Submit to App Store Connect
npm run submit:ios

# Or directly with EAS
eas submit --platform ios
```

### ✅ Post-Submission
- [ ] App submitted for review
- [ ] Review status monitored
- [ ] Any review feedback addressed
- [ ] App approved and released

## Testing Checklist

### ✅ Production Build Testing
- [ ] App launches successfully
- [ ] All features work correctly
- [ ] User authentication works
- [ ] Data sync works correctly
- [ ] Error handling works correctly
- [ ] No crashes or major issues

## Important Notes

### 📱 Bundle ID
- **Current Bundle ID**: `com.presusimple.app`
- **Domain**: presusimple.com
- **Used in**: App Store Connect, Apple Developer Portal, app.config.ts

## Common Issues & Solutions

### ❌ Build Fails
- **Check**: Environment variables are set
- **Check**: Apple Developer account is active
- **Check**: Bundle ID is registered
- **Check**: EAS configuration is correct

### ❌ Submission Fails
- **Check**: App Store Connect app exists
- **Check**: Team ID and App ID are correct
- **Check**: App information is complete
- **Check**: All required metadata is provided

## Timeline

- **Setup**: 2-4 hours
- **Build**: 15-25 minutes
- **App Store Review**: 1-7 days
- **Total**: 1-2 weeks

## Support

- **EAS Documentation**: https://docs.expo.dev/build/introduction/
- **App Store Connect Help**: https://developer.apple.com/help/app-store-connect/
- **Expo Documentation**: https://docs.expo.dev/

## Current Status

- ✅ **App Rebranded**: PresuSimple (presusimple.com)
- ✅ **Production Configuration**: Ready
- ⏳ **Production Build**: Ready to create
- ⏳ **App Store Submission**: Ready after build

## Next Steps

1. **Complete Pre-Build Requirements** (App Store Connect, Apple Developer)
2. **Create Production Build** (`npm run build:prod:ios`)
3. **Submit to App Store** (`npm run submit:ios`)
4. **Complete App Store Listing**
5. **Submit for Review**
6. **Release to App Store**
