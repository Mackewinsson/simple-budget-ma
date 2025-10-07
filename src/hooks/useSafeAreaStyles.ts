import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SPACING, SCREEN_PADDING } from '../theme/layout';

export const useSafeAreaStyles = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: insets.top,
      paddingLeft: insets.left + SCREEN_PADDING.horizontal,
      paddingRight: insets.right + SCREEN_PADDING.horizontal,
      // Note: We don't add paddingBottom for tab screens
    },
    containerWithBottomPadding: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: insets.top,
      paddingLeft: insets.left + SCREEN_PADDING.horizontal,
      paddingRight: insets.right + SCREEN_PADDING.horizontal,
      paddingBottom: insets.bottom,
    },
    scrollContent: {
      paddingBottom: SPACING.xl,  // Add some padding at the bottom for scroll views
    },
  });
};
