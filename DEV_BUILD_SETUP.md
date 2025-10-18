# Development Build Setup Guide

## Overview
This guide documents the setup process for creating and testing iOS development builds with EAS and expo-dev-client.

## Prerequisites
- [x] EAS CLI installed globally
- [x] Expo account (logged in as mackewinsson-rentbird)
- [x] Apple Developer Account (for device testing)
- [x] macOS computer (for iOS simulator)

## Configuration Files

### eas.json
```json
{
  "cli": {
    "version": ">= 13.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "simulator": false
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### app.config.ts
- Bundle Identifier: `com.simplebudget.app`
- App Name: "Simple Budget"
- Version: "1.0.0"
- iOS configuration with In-App Purchase capability

## Build Commands

### Local Development Build (Recommended)
```bash
# 1. Start Metro bundler
npm start

# 2. Open Xcode workspace
open ios/simplebudget.xcworkspace

# 3. In Xcode:
#    - Select iPhone 15 Pro simulator
#    - Click the Run button (▶️)
#    - App will build and launch automatically
```

### Alternative: EAS Build (Cloud)
```bash
npm run build:dev:ios
# or
eas build --profile development --platform ios
```

### Start Development Server
```bash
npm start
# or
npx expo start --dev-client
```

## Testing Devices

### iOS Simulator
- iPhone 15 Pro (iOS 17.0)
- iPhone 14 Pro (iOS 16.0)
- iPad Pro (12.9-inch) (iOS 17.0)

### Physical Devices (when available)
- iPhone 15 Pro (for IAP testing)
- iPad Air (for tablet testing)

## Apple Developer Setup

### Bundle ID Registration
1. Go to https://developer.apple.com/account
2. Navigate to Certificates, Identifiers & Profiles
3. Click Identifiers → Add (+)
4. Select "App IDs" → Continue
5. Register an App ID:
   - Description: "Simple Budget"
   - Bundle ID: `com.simplebudget.app`
   - Capabilities: Enable "In-App Purchase"
6. Continue → Register

### Test Accounts
- Create sandbox test accounts in App Store Connect
- Use separate Apple ID for testing IAP
- Document test account credentials securely

## Troubleshooting

### Common Build Issues

**Error: Apple ID authentication failed**
- Solution: Use app-specific password
- Generate at: https://appleid.apple.com/account/manage

**Error: Bundle identifier already registered**
- Solution: Change bundleIdentifier in app.config.ts
- Must be unique across App Store

**Error: EAS credentials not found**
- Solution: Run `eas credentials` to manage
- Or delete and regenerate with `eas build`

### Installation Issues

**Simulator won't install app**
- Solution: Reset simulator
- Run: `xcrun simctl erase all`

**Metro bundler won't connect**
- Ensure device/simulator on same network
- Check firewall settings
- Try: `npm start -- --reset-cache`

### Runtime Issues

**App crashes on launch**
- Check native modules are properly linked
- Review Xcode logs: `xcrun simctl spawn booted log stream`

## Development Workflow

### Daily Development
1. Use existing dev build
2. Only rebuild when adding native dependencies
3. Use hot reload for JS changes

### When to Rebuild
- Added new native module
- Changed native configuration
- Updated Expo SDK
- Changed bundle identifier

## IAP Testing Setup

### RevenueCat Configuration
- Account: https://app.revenuecat.com
- Project: "Simple Budget"
- API Keys: Store in environment variables

### App Store Connect
- Products: `pro_monthly`, `pro_yearly`
- Subscription Group: "Pro Subscription"
- Sandbox Testing: Enable

### Test Environment
- Use sandbox environment for testing
- Test on physical device (required for IAP)
- Verify purchases in RevenueCat dashboard

## Environment Variables

### Required for IAP
```
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=your_revenuecat_public_key_here
EXPO_PUBLIC_ENABLE_IAP_TESTING=true
```

### Development
```
EXPO_PUBLIC_ENV=development
```

## Success Checklist

- [x] EAS configured and working
- [x] iOS development build created (local with Xcode)
- [x] Xcode workspace opened
- [x] Metro bundler running
- [x] Ready to build and test in Xcode
- [ ] App running with dev client
- [ ] Hot reload working
- [ ] Apple Developer account linked (for device)
- [ ] Bundle ID registered
- [ ] Ready to add native IAP modules

## Next Steps

1. Create first development build
2. Test on simulator
3. Install RevenueCat SDK
4. Rebuild with RevenueCat
5. Test IAP functionality

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [expo-dev-client Documentation](https://docs.expo.dev/clients/introduction/)
- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [Apple In-App Purchase Guide](https://developer.apple.com/in-app-purchase/)
