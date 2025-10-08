import Reactotron from 'reactotron-react-native';
import { Platform } from 'react-native';

// Create Reactotron instance
const reactotron = Reactotron
  .configure({
    name: 'Budgeting Mobile App',
    host: Platform.OS === 'ios' ? 'localhost' : '10.0.2.2', // For Android emulator
  })
  .useReactNative({
    networking: {
      ignoreUrls: /symbolicate/,
    },
    editor: false,
    errors: { veto: (stackFrame) => false },
    overlay: false,
  })
  .connect();

// Clear Reactotron on app reload
if (__DEV__) {
  reactotron.clear?.();
}

export default reactotron;
