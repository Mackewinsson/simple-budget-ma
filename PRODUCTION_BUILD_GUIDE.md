# Production Build Configuration Guide

## Overview

This guide walks you through configuring and building a production version of your Simple Budget app for App Store submission.

## Prerequisites

Before creating a production build, ensure you have:

- [ ] **Apple Developer Account** ($99/year) - Required for App Store submission
- [ ] **App Store Connect Account** - Create your app listing
- [ ] **RevenueCat Production Project** - Separate from test store
- [ ] **Production API Keys** - RevenueCat, Google OAuth, etc.

## Phase 1: Environment Configuration

### 1.1 Create Production Environment File

Create `.env.production` in your project root:

```bash
# Production Environment Variables
EXPO_PUBLIC_ENV=production

# RevenueCat Configuration (Production)
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=your_production_revenuecat_api_key_here

# API Configuration
EXPO_PUBLIC_API_BASE_URL=https://your-production-api.com

# Google OAuth Configuration (Production)
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_production_google_client_id_here
EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID=your_production_google_expo_client_id_here
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_production_google_ios_client_id_here

# Disable IAP testing in production
EXPO_PUBLIC_ENABLE_IAP_TESTING=false
```

### 1.2 Update EAS Configuration

Your `eas.json` is already configured with:

```json
{
  "build": {
    "production": {
      "autoIncrement": true,
      "env": {
        "EXPO_PUBLIC_ENV": "production"
      },
      "ios": {
        "simulator": false,
        "buildConfiguration": "Release"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-apple-team-id"
      }
    }
  }
}
```

**Update the submit configuration with your actual values:**
- `appleId`: Your Apple ID email
- `ascAppId`: App Store Connect App ID (found in App Store Connect)
- `appleTeamId`: Your Apple Developer Team ID

## Phase 2: RevenueCat Production Setup

### 2.1 Create Production RevenueCat Project

1. **Go to RevenueCat Dashboard**
   - Visit: https://app.revenuecat.com/
   - Create a new project (separate from test store)

2. **Configure Production Project**
   - **App Name**: Simple Budget (Production)
   - **Bundle ID**: `com.simplebudget.app`
   - **Platform**: iOS
   - **App Store**: App Store Connect

3. **Get Production API Key**
   - Copy the production API key
   - Add to your `.env.production` file

### 2.2 Configure Production Products

1. **Create Products** (same as test store):
   - `com.simplebudget.pro.monthly`
   - `com.simplebudget.pro.yearly`

2. **Create Entitlement**:
   - Identifier: `pro`
   - Link both products

3. **Create Offering**:
   - Identifier: `default`
   - Add packages: `monthly` and `yearly`
   - Set as current offering

## Phase 3: App Store Connect Setup

### 3.1 Create App in App Store Connect

1. **Go to App Store Connect**
   - Visit: https://appstoreconnect.apple.com/
   - Click "My Apps" → "+" → "New App"

2. **Fill App Information**:
   - **Name**: Simple Budget
   - **Bundle ID**: `com.simplebudget.app`
   - **SKU**: `simple-budget-ios`
   - **User Access**: Full Access

### 3.2 Create In-App Purchase Products

1. **Go to Features → In-App Purchases**
2. **Create Monthly Subscription**:
   - **Type**: Auto-Renewable Subscription
   - **Product ID**: `com.simplebudget.pro.monthly`
   - **Reference Name**: Pro Monthly
   - **Subscription Group**: Create "Pro Subscription"
   - **Duration**: 1 Month
   - **Price**: $4.99

3. **Create Yearly Subscription**:
   - **Type**: Auto-Renewable Subscription
   - **Product ID**: `com.simplebudget.pro.yearly`
   - **Reference Name**: Pro Yearly
   - **Subscription Group**: Same "Pro Subscription"
   - **Duration**: 1 Year
   - **Price**: $49.99

4. **Submit Products for Review**
   - Both products must be approved before app submission

### 3.3 Get App Store Connect App ID

1. **In App Store Connect**
2. **Go to your app**
3. **Copy the App ID** (numeric ID)
4. **Add to eas.json** submit configuration

## Phase 4: Apple Developer Portal Setup

### 4.1 Register App ID

1. **Go to Apple Developer Portal**
   - Visit: https://developer.apple.com/account
   - Navigate to Certificates, Identifiers & Profiles

2. **Create App ID**:
   - **Description**: Simple Budget
   - **Bundle ID**: `com.simplebudget.app`
   - **Capabilities**: Enable "In-App Purchase"

3. **Get Team ID**:
   - Found in Apple Developer Portal
   - Add to eas.json submit configuration

## Phase 5: Build Production App

### 5.1 Create Production Build

```bash
# Build production version
eas build --profile production --platform ios
```

This will:
- Use production environment variables
- Create Release build configuration
- Generate .ipa file for App Store
- Take 15-25 minutes

### 5.2 Monitor Build Progress

```bash
# Check build status
eas build:list

# View build logs
eas build:view [BUILD_ID]
```

## Phase 6: Submit to App Store

### 6.1 Submit Build

```bash
# Submit to App Store Connect
eas submit --platform ios
```

This will:
- Upload .ipa to App Store Connect
- Create new app version
- Prepare for App Store review

### 6.2 Complete App Store Listing

In App Store Connect:

1. **App Information**:
   - App name, subtitle, description
   - Keywords, category
   - Privacy policy URL

2. **Screenshots**:
   - iPhone screenshots (required)
   - iPad screenshots (if supported)

3. **App Review Information**:
   - Contact information
   - Demo account (if needed)
   - Review notes

4. **Pricing and Availability**:
   - Set price (Free or Paid)
   - Select countries/regions
   - Set availability date

### 6.3 Submit for Review

1. **Review all information**
2. **Click "Submit for Review"**
3. **Wait for Apple review** (1-7 days typically)

## Phase 7: Post-Submission

### 7.1 Monitor Review Status

- Check App Store Connect for review status
- Respond to any review feedback
- Fix issues if rejected

### 7.2 Release to App Store

- Once approved, release to App Store
- Monitor app performance
- Track RevenueCat analytics

## Important Notes

### Production vs Development

- **Development Build**: For testing IAP with test store
- **Production Build**: For App Store submission with real IAP
- **Different API Keys**: Test and production use different keys
- **Different RevenueCat Projects**: Separate test and production projects

### Cost Considerations

- **Apple Developer Account**: $99/year
- **EAS Builds**: Free tier includes builds
- **RevenueCat**: Free tier available
- **App Store**: 30% commission on IAP

### Testing Strategy

1. **Development Phase**: Use test store and dev build
2. **Pre-Production**: Test with production build locally
3. **TestFlight**: Beta test with production build
4. **App Store**: Release to public

## Troubleshooting

### Common Issues

**Build Fails**:
- Check environment variables
- Verify Apple Developer account
- Check bundle ID matches

**Submission Fails**:
- Verify App Store Connect app exists
- Check Team ID and App ID
- Ensure products are approved

**IAP Not Working**:
- Verify RevenueCat configuration
- Check product IDs match
- Test with sandbox account

## Success Checklist

- [ ] Production environment configured
- [ ] RevenueCat production project created
- [ ] App Store Connect app created
- [ ] IAP products created and approved
- [ ] Apple Developer account configured
- [ ] Production build created successfully
- [ ] App submitted to App Store Connect
- [ ] App Store listing completed
- [ ] Submitted for App Store review
- [ ] App approved and released

## Next Steps After Release

1. **Monitor Performance**: Track downloads, crashes, revenue
2. **User Feedback**: Respond to App Store reviews
3. **Updates**: Plan future app updates
4. **Marketing**: Promote your app
5. **Analytics**: Use RevenueCat and App Store analytics

## Estimated Timeline

- **Setup**: 2-4 hours
- **Build**: 15-25 minutes
- **App Store Review**: 1-7 days
- **Total**: 1-2 weeks (including review time)

## Support Resources

- **EAS Documentation**: https://docs.expo.dev/build/introduction/
- **RevenueCat Documentation**: https://docs.revenuecat.com/
- **App Store Connect Help**: https://developer.apple.com/help/app-store-connect/
- **Apple Developer Documentation**: https://developer.apple.com/documentation/
