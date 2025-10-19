# Rebranding to PresuSimple - Summary of Changes

## Overview
Successfully rebranded the app from "Simple Budget" to "PresuSimple" to match the newly acquired domain presusimple.com.

## Changes Made

### 1. App Configuration ([app.config.ts](app.config.ts))
- **App Name**: "Simple Budget" → "PresuSimple"
- **Slug**: "budgeting-mobile" → "presusimple"
- **Scheme**: "budgetingmobile" → "presusimple"
- **iOS Bundle ID**: "com.mackewinsson.budgetingmobile" → "com.presusimple.app"
- **Android Package**: "com.mackewinsson.budgetingmobile" → "com.presusimple.app"
- **Project Name Proxy**: "@mackewinsson/simple-budget" → "@mackewinsson/presusimple"

### 2. Package Configuration ([package.json](package.json))
- **Package Name**: "budgeting-mobile" → "presusimple"

### 3. Static Configuration ([app.json](app.json))
- **App Name**: "budgeting-mobile" → "PresuSimple"
- **Slug**: "budgeting-mobile" → "presusimple"
- **Project Name Proxy**: "@mackewinsson/simple-budget" → "@mackewinsson/presusimple"

### 4. Environment Files
**[.env.development](.env.development)**
- **API Base URL**: "https://www.simple-budget.pro" → "https://www.presusimple.com"
- **App Name**: "simple-budget" → "PresuSimple"
- **URI Scheme**: "simplebudget://auth" → "presusimple://auth"

**[.env.production](.env.production)**
- **API Base URL**: "https://www.simple-budget.pro" → "https://www.presusimple.com"
- **Project Name Proxy**: "@mackewinsson/simple-budget" → "@mackewinsson/presusimple"

### 5. Source Code ([src/lib/env.ts](src/lib/env.ts))
- **Fallback API URL**: "https://www.simple-budget.pro" → "https://www.presusimple.com"

### 6. Documentation ([PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md))
- Updated all references to bundle ID: "com.presusimple.app"
- Updated product IDs: 
  - "com.simplebudget.pro.monthly" → "com.presusimple.pro.monthly"
  - "com.simplebudget.pro.yearly" → "com.presusimple.pro.yearly"

## New Configuration Summary

### App Identity
- **App Name**: PresuSimple
- **Domain**: presusimple.com
- **Bundle ID**: com.presusimple.app
- **URL Scheme**: presusimple://

### Product IDs (RevenueCat & App Store)
- **Monthly Subscription**: com.presusimple.pro.monthly
- **Yearly Subscription**: com.presusimple.pro.yearly

### API Endpoints
- **Production**: https://www.presusimple.com
- **Development**: https://www.presusimple.com

## Next Steps

### 1. Apple Developer Portal
- [ ] Register new App ID: `com.presusimple.app`
- [ ] Enable In-App Purchase capability
- [ ] Create provisioning profiles if needed

### 2. App Store Connect
- [ ] Create new app with bundle ID: `com.presusimple.app`
- [ ] Set up in-app purchase products:
  - `com.presusimple.pro.monthly`
  - `com.presusimple.pro.yearly`

### 3. RevenueCat Configuration
- [ ] Update product IDs to match new naming:
  - `com.presusimple.pro.monthly`
  - `com.presusimple.pro.yearly`
- [ ] Verify bundle ID in RevenueCat: `com.presusimple.app`

### 4. Google OAuth
- [ ] Update OAuth redirect URIs to use `presusimple://` scheme
- [ ] Update authorized domains to include `presusimple.com`

### 5. Clean Build
```bash
# Clear build cache and rebuild
rm -rf node_modules
npm install
npx expo prebuild --clean
```

### 6. Test Build
```bash
# Test development build
npm run build:dev:ios

# When ready, build for production
npm run build:prod:ios
```

## Important Notes

- **Old Bundle ID will NOT work**: The app will be published under a completely new identity
- **This is a fresh start**: You'll need to create a new app in App Store Connect
- **Users on old bundle ID**: If you had any test users, they won't be able to update to this version
- **RevenueCat**: Make sure to update product IDs in both App Store Connect AND RevenueCat dashboard

## Files Modified
1. app.config.ts
2. app.json
3. package.json
4. .env.development
5. .env.production
6. src/lib/env.ts
7. PRODUCTION_CHECKLIST.md

## Verification Checklist
- [x] App name updated everywhere
- [x] Bundle ID updated for iOS and Android
- [x] URL schemes updated
- [x] API endpoints updated
- [x] Product IDs updated in documentation
- [x] Environment variables updated
- [ ] Clean build completed
- [ ] App tested with new configuration
- [ ] Apple Developer Portal updated
- [ ] App Store Connect app created
- [ ] RevenueCat configuration updated

---
Generated: 2025-10-19
Domain: presusimple.com
