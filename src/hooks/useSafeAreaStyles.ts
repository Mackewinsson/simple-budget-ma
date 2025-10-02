import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

export const useSafeAreaStyles = () => {
  const insets = useSafeAreaInsets();
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      // Note: We don't add paddingBottom for tab screens
    },
    containerWithBottomPadding: {
      flex: 1,
      backgroundColor: '#000',
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
  });
};
