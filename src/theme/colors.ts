export const lightTheme = {
  // Background colors
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceSecondary: '#f1f5f9',

  // Text colors
  text: '#0f172a',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',

  // Border colors
  border: '#e2e8f0',
  borderLight: '#f1f5f9',

  // Primary colors (Indigo - used for main brand/accent)
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  primaryLight: '#818cf8',

  // Text on primary (for buttons and headers with primary background)
  onPrimary: '#ffffff',
  onPrimaryMuted: 'rgba(255, 255, 255, 0.9)',
  onPrimarySubtle: 'rgba(255, 255, 255, 0.2)',
  onPrimaryBorder: 'rgba(255, 255, 255, 0.3)',

  // Success colors
  success: '#10b981',
  successDark: '#059669',
  successLight: '#34d399',

  // Error/Danger colors
  error: '#ef4444',
  errorDark: '#dc2626',
  errorLight: '#f87171',

  // Warning colors
  warning: '#f59e0b',
  warningDark: '#d97706',
  warningLight: '#fbbf24',

  // Tab bar
  tabBarBackground: '#ffffff',
  tabBarBorder: '#e2e8f0',
  tabBarActive: '#6366f1',
  tabBarInactive: '#64748b',

  // Card colors
  cardBackground: '#ffffff',
  cardBorder: '#e2e8f0',

  // Shadow
  shadow: '#000000',
  shadowOpacity: 0.05,
};

export const darkTheme = {
  // Background colors
  background: '#0f172a',
  surface: '#1e293b',
  surfaceSecondary: '#334155',

  // Text colors
  text: '#f8fafc',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',

  // Border colors
  border: '#334155',
  borderLight: '#475569',

  // Primary colors (Indigo - used for main brand/accent)
  primary: '#818cf8',
  primaryDark: '#6366f1',
  primaryLight: '#a5b4fc',

  // Text on primary (for buttons and headers with primary background)
  onPrimary: '#ffffff',
  onPrimaryMuted: 'rgba(255, 255, 255, 0.9)',
  onPrimarySubtle: 'rgba(255, 255, 255, 0.2)',
  onPrimaryBorder: 'rgba(255, 255, 255, 0.3)',

  // Success colors
  success: '#34d399',
  successDark: '#10b981',
  successLight: '#6ee7b7',

  // Error/Danger colors
  error: '#f87171',
  errorDark: '#ef4444',
  errorLight: '#fca5a5',

  // Warning colors
  warning: '#fbbf24',
  warningDark: '#f59e0b',
  warningLight: '#fcd34d',

  // Tab bar
  tabBarBackground: '#1e293b',
  tabBarBorder: '#334155',
  tabBarActive: '#818cf8',
  tabBarInactive: '#94a3b8',

  // Card colors
  cardBackground: '#1e293b',
  cardBorder: '#334155',

  // Shadow
  shadow: '#000000',
  shadowOpacity: 0.3,
};

export type Theme = typeof lightTheme;
