export const isDevelopment = __DEV__;
export const isIAPTestMode = process.env.EXPO_PUBLIC_ENABLE_IAP_TESTING === 'true';

export const logDev = (message: string, ...args: any[]) => {
  if (isDevelopment) {
    console.log(`[DEV] ${message}`, ...args);
  }
};

export const logIAP = (message: string, ...args: any[]) => {
  if (isDevelopment && isIAPTestMode) {
    console.log(`[IAP] ${message}`, ...args);
  }
};

export const getEnvironment = () => {
  return {
    isDevelopment,
    isIAPTestMode,
    environment: process.env.EXPO_PUBLIC_ENV || 'production',
  };
};

