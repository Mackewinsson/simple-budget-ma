# Production Build Checklist

## Pre-Build Requirements

### ✅ Environment Setup
- [ ] Create `.env.production` file with production API keys
- [ ] Update `eas.json` with your Apple ID, App Store Connect App ID, and Team ID
- [ ] Verify all environment variables are set correctly

### ✅ RevenueCat Production Setup
- [ ] Create production RevenueCat project (separate from test store)
- [ ] Configure production API key in `.env.production`
- [ ] Create products: `com.simplebudget.pro.monthly` and `com.simplebudget.pro.yearly`
- [ ] Create entitlement: `pro`
- [ ] Create offering: `default` with `monthly` and `yearly` packages
- [ ] Set offering as current

### ✅ App Store Connect Setup
- [ ] Create app in App Store Connect with bundle ID `com.mackewinsson.budgetingmobile`
- [ ] Create IAP products (monthly and yearly subscriptions)
- [ ] Submit IAP products for review
- [ ] Get App Store Connect App ID (numeric)
- [ ] Complete app information (name, description, etc.)
- [ ] Update `eas.json` with your `appleId` (email) and `ascAppId`

### ✅ Apple Developer Portal
- [ ] Register App ID with bundle ID `com.mackewinsson.budgetingmobile`
- [ ] Enable "In-App Purchase" capability
- [x] Apple Developer Team ID: `H3FV2Q782F` (already configured)
- [ ] Ensure Apple Developer account is active ($99/year)

## Build Process

### ✅ Pre-Build Verification
- [ ] All environment variables configured
- [ ] EAS configuration updated with correct IDs
- [ ] RevenueCat production project ready
- [ ] App Store Connect app created
- [ ] IAP products approved

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
- [ ] IAP flow works with production RevenueCat
- [ ] Pro features unlock after purchase
- [ ] Restore purchases works
- [ ] Error handling works correctly
- [ ] No crashes or major issues

### ✅ App Store Connect Testing
- [ ] Test with sandbox account
- [ ] Verify IAP products work
- [ ] Test subscription flow
- [ ] Verify pro features unlock
- [ ] Test restore purchases

## Important Notes

### 🔑 API Keys
- **Test Store**: `test_zJUnetiYMNVPtWOCXjuOeTPIBoB` (for development)
- **Production Store**: `your_production_api_key_here` (for App Store)

### 📱 Bundle ID
- **Current Bundle ID**: `com.mackewinsson.budgetingmobile`
- **Used in**: App Store Connect, Apple Developer Portal, RevenueCat, app.config.ts
- **Note**: Changed from `com.simplebudget.app` (not available)

### 🛒 Product IDs
- **Monthly**: `com.simplebudget.pro.monthly`
- **Yearly**: `com.simplebudget.pro.yearly`
- **Must match**: App Store Connect, RevenueCat, and app code

### 🎯 Entitlement ID
- **Pro Features**: `pro`
- **Must match**: RevenueCat configuration and app code

## Common Issues & Solutions

### ❌ Build Fails
- **Check**: Environment variables are set
- **Check**: Apple Developer account is active
- **Check**: Bundle ID is registered
- **Check**: EAS configuration is correct

### ❌ Submission Fails
- **Check**: App Store Connect app exists
- **Check**: Team ID and App ID are correct
- **Check**: IAP products are approved
- **Check**: App information is complete

### ❌ IAP Not Working
- **Check**: RevenueCat configuration
- **Check**: Product IDs match exactly
- **Check**: Entitlement is configured
- **Check**: Offering is set as current

## Timeline

- **Setup**: 2-4 hours
- **Build**: 15-25 minutes
- **App Store Review**: 1-7 days
- **Total**: 1-2 weeks

## Support

- **EAS Documentation**: https://docs.expo.dev/build/introduction/
- **RevenueCat Documentation**: https://docs.revenuecat.com/
- **App Store Connect Help**: https://developer.apple.com/help/app-store-connect/

## Current Status

- ✅ **Development Build**: Working with test store
- ✅ **IAP Integration**: Complete with RevenueCat
- ✅ **Production Configuration**: Ready
- ⏳ **Production Build**: Ready to create
- ⏳ **App Store Submission**: Ready after build

## Next Steps

1. **Complete Pre-Build Requirements** (RevenueCat, App Store Connect, Apple Developer)
2. **Create Production Build** (`npm run build:prod:ios`)
3. **Submit to App Store** (`npm run submit:ios`)
4. **Complete App Store Listing**
5. **Submit for Review**
6. **Release to App Store**
