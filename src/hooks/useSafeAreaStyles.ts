import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export const useSafeAreaStyles = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      // Note: We don't add paddingBottom for tab screens
    },
    containerWithBottomPadding: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
  });
};
