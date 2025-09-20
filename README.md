# Budgeting Mobile App

A React Native budgeting app built with Expo, ported from a Next.js web application.

## 🚀 Features

- **Budget Management**: Create and manage monthly budgets
- **Expense Tracking**: Add and track expenses and income
- **Real-time Data**: Uses React Query for efficient data fetching and caching
- **Offline Storage**: Zustand with MMKV for persistent local storage
- **Form Validation**: React Hook Form with Zod validation
- **TypeScript**: Full type safety throughout the application

## 📱 Tech Stack

- **Framework**: Expo with Expo Router
- **Language**: TypeScript
- **State Management**: Zustand with MMKV persistence
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Navigation**: Expo Router (file-based routing)
- **Storage**: MMKV for fast, secure local storage

## 🏗️ Project Structure

```
budgeting-mobile/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── budgets.tsx    # Budget overview and creation
│   │   ├── transactions.tsx # Expense tracking
│   │   ├── reports.tsx    # Reports (placeholder)
│   │   └── settings.tsx   # App settings
│   ├── _layout.tsx        # Root layout with providers
│   └── index.tsx          # Entry point
├── src/
│   ├── api/               # API layer
│   │   ├── client.ts      # Axios configuration
│   │   ├── budgets.ts     # Budget API functions
│   │   ├── categories.ts  # Category API functions
│   │   ├── expenses.ts    # Expense API functions
│   │   ├── users.ts       # User API functions
│   │   └── hooks/         # React Query hooks
│   ├── lib/               # Business logic
│   │   ├── api.ts         # Type definitions
│   │   └── env.ts         # Environment configuration
│   ├── store/             # State management
│   │   ├── auth.ts        # Authentication store
│   │   └── _persist.ts    # MMKV persistence setup
│   └── types/             # TypeScript type definitions
├── components/            # Reusable UI components
│   ├── NewBudgetForm.tsx  # Budget creation form
│   └── NewExpenseForm.tsx # Expense creation form
└── scripts/               # Build and utility scripts
    └── codemod-dom-to-rn.js # DOM to React Native conversion
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)
- **Next.js API server running** (from the `simple-budget` project)

### Installation

1. **Install dependencies:**
   ```bash
   cd budgeting-mobile
   npm install
   ```

2. **Start both servers (Next.js API + Expo):**
   ```bash
   # Option 1: Use the provided script
   ./start-servers.sh
   
   # Option 2: Start manually
   # Terminal 1: Start Next.js API
   cd ../simple-budget
   npm run dev
   
   # Terminal 2: Start Expo
   cd ../budgeting-mobile
   npx expo start
   ```

3. **Run on device/simulator:**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your phone

### 🔗 API Connection

The Expo app automatically connects to your Next.js API server at `http://localhost:3000`. The app will:

1. **Create a demo user** automatically on first launch
2. **Use real database** - all data is stored in your MongoDB
3. **Share data** with your Next.js web app
4. **No authentication required** - uses a demo user for simplicity

### 👤 Demo User System

The app uses a special demo user system that:

- **Email**: `demo@mobile-app.com`
- **Name**: `Demo Mobile User`
- **Auto-created**: First time the app connects to the API
- **Persistent**: User and data persist across app restarts
- **Shared**: Same user can be used by multiple devices
- **Real data**: All budgets, categories, and expenses are stored in your MongoDB

This allows you to test the full functionality without implementing authentication, while still using your real database and API logic.

## 🔧 Configuration

### API Configuration

The app connects to your Next.js API server. Update the `API_BASE_URL` in your environment:

```typescript
// src/lib/env.ts
export const ENV = {
  API_BASE_URL: "https://your-api-domain.com", // Production
  // or
  API_BASE_URL: "http://localhost:3000", // Development
};
```

### Authentication

The app uses token-based authentication stored securely with Expo SecureStore. The auth flow is managed through the Zustand store in `src/store/auth.ts`.

## 📱 Screens

### Budgets Tab
- View current budget overview
- Create new budgets
- See total budgeted vs available amounts

### Transactions Tab
- View all expenses and income
- Add new transactions
- Real-time updates with React Query

### Reports Tab
- Placeholder for future reporting features

### Settings Tab
- User account information
- Currency preferences
- Logout functionality

## 🔄 Data Flow

1. **API Layer**: Axios client with automatic token injection
2. **React Query**: Caching, background updates, and optimistic updates
3. **Zustand Store**: Global state management with MMKV persistence
4. **Components**: React Hook Form for form handling with Zod validation

## 🛠️ Development

### Adding New API Endpoints

1. Create API function in `src/api/`:
   ```typescript
   // src/api/newFeature.ts
   import client from "./client";
   
   export const getNewFeature = async (): Promise<NewFeatureType[]> => {
     const { data } = await client.get("/api/new-feature");
     return data;
   };
   ```

2. Create React Query hook:
   ```typescript
   // src/api/hooks/useNewFeature.ts
   import { useQuery } from "@tanstack/react-query";
   import { getNewFeature } from "../newFeature";
   
   export const useNewFeature = () => {
     return useQuery({
       queryKey: ["newFeature"],
       queryFn: getNewFeature,
     });
   };
   ```

3. Use in components:
   ```typescript
   const { data, isLoading } = useNewFeature();
   ```

### Adding New Screens

1. Create screen file in `app/(tabs)/`:
   ```typescript
   // app/(tabs)/newScreen.tsx
   import { View, Text } from "react-native";
   
   export default function NewScreen() {
     return (
       <View>
         <Text>New Screen</Text>
       </View>
     );
   }
   ```

2. Add to tab layout in `app/(tabs)/_layout.tsx`:
   ```typescript
   <Tabs.Screen name="newScreen" options={{ title: "New Screen" }} />
   ```

## 🧪 Testing

```bash
# Type checking
npx tsc --noEmit

# Run tests (when implemented)
npm test
```

## 📦 Building for Production

```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android

# Or use EAS Build (recommended)
npx eas build --platform ios
npx eas build --platform android
```

## 🔄 Migration from Next.js

This app was systematically ported from a Next.js web application. Key changes made:

### DOM → React Native
- `div` → `View`
- `span/p` → `Text`
- `button` → `Pressable`
- `input` → `TextInput`
- `img` → `Image`
- CSS → StyleSheet

### State Management
- Next.js API routes → Axios client
- SWR → TanStack Query
- localStorage → MMKV
- Next.js routing → Expo Router

### Forms
- Web form elements → React Native form components
- Same validation logic with Zod
- React Hook Form adapted for mobile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **TypeScript errors**: Run `npx tsc --noEmit` to check types
3. **API connection issues**: Verify `API_BASE_URL` in environment
4. **Authentication issues**: Check token storage in SecureStore

### Getting Help

- Check the [Expo documentation](https://docs.expo.dev/)
- Review [React Native documentation](https://reactnative.dev/)
- Open an issue in this repository

---

**Note**: This is a mobile port of an existing Next.js budgeting application. The core business logic, API contracts, and data models remain the same, ensuring consistency between web and mobile experiences.
