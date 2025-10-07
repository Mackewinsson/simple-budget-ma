# Theme Implementation Guide

## Overview
The app now has a complete theming system that supports light mode, dark mode, and system-based themes.

## Theme Structure

### Theme Files
- `src/theme/colors.ts` - Contains `lightTheme` and `darkTheme` color definitions
- `src/theme/ThemeContext.tsx` - Theme provider and `useTheme()` hook
- `src/hooks/useThemedStyles.ts` - Reusable themed component styles

### Using the Theme

#### 1. Import the hook
```typescript
import { useTheme } from "../../src/theme/ThemeContext";
```

#### 2. Use theme colors in your component
```typescript
function MyComponent() {
  const { theme, isDark, themeMode, setThemeMode } = useTheme();

  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>Hello</Text>
    </View>
  );
}
```

#### 3. Use themed styles
```typescript
import { useThemedStyles } from "../../src/hooks/useThemedStyles";

function MyComponent() {
  const themedStyles = useThemedStyles();

  return (
    <View style={themedStyles.card}>
      <Text style={themedStyles.title}>Title</Text>
    </View>
  );
}
```

## Available Theme Colors

### Background & Surface
- `theme.background` - Main background color
- `theme.surface` - Card/surface background
- `theme.surfaceSecondary` - Secondary surface (badges, etc.)

### Text Colors
- `theme.text` - Primary text
- `theme.textSecondary` - Secondary text
- `theme.textMuted` - Muted/hint text

### Borders
- `theme.border` - Standard border color
- `theme.borderLight` - Lighter border

### Accent Colors
- `theme.primary` - Primary brand color
- `theme.success` - Success/positive actions
- `theme.error` - Error/danger actions
- `theme.warning` - Warning actions

### Tab Bar
- `theme.tabBarBackground`
- `theme.tabBarBorder`
- `theme.tabBarActive`
- `theme.tabBarInactive`

### Cards
- `theme.cardBackground`
- `theme.cardBorder`

### Shadows
- `theme.shadow`
- `theme.shadowOpacity`

## Theme Toggle
Users can change theme in Settings screen with three options:
- Light mode
- Dark mode
- System (follows device theme)

## Next Steps
To fully implement theming in all components:

1. **Replace hardcoded colors** with theme colors:
   - Before: `color: "#0f172a"`
   - After: `color: theme.text`

2. **Update StyleSheets** to be dynamic:
   ```typescript
   const { theme } = useTheme();

   const styles = StyleSheet.create({
     card: {
       backgroundColor: theme.cardBackground,
       borderColor: theme.cardBorder,
     }
   });
   ```

3. **Use themed icon colors**:
   ```typescript
   <Ionicons name="icon-name" color={theme.textSecondary} />
   ```

## Files Already Updated
✅ `app/_layout.tsx` - ThemeProvider added
✅ `app/(tabs)/_layout.tsx` - Tab bar themed
✅ `src/hooks/useSafeAreaStyles.ts` - Background themed
✅ `app/(tabs)/settings.tsx` - Theme toggle added

## Files That Need Updating
- All screen files in `app/(tabs)/`
- All component files in `components/`
- Replace hardcoded colors with theme references
