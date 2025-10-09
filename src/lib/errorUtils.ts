import { AxiosError } from 'axios';

export interface ErrorInfo {
  type: 'network' | 'server' | 'validation' | 'auth' | 'generic';
  title: string;
  message: string;
  canRetry: boolean;
  originalError?: any;
}

/**
 * Categorizes and formats errors for consistent error handling across the app
 */
export function categorizeError(error: any): ErrorInfo {
  // Network errors
  if (isNetworkError(error)) {
    return {
      type: 'network',
      title: 'Connection Problem',
      message: 'Please check your internet connection and try again.',
      canRetry: true,
      originalError: error,
    };
  }

  // Axios errors with response
  if (error?.response) {
    const status = error.response.status;
    const data = error.response.data;

    // Authentication errors
    if (status === 401) {
      return {
        type: 'auth',
        title: 'Session Expired',
        message: 'Your session has expired. Please log in again.',
        canRetry: false,
        originalError: error,
      };
    }

    if (status === 409) {
      const message = data?.message || data?.error || 'This item already exists.';
      return {
        type: 'validation',
        title: 'Duplicate Entry',
        message,
        canRetry: false,
        originalError: error,
      };
    }

    // Validation errors
    if (status === 400 || status === 422) {
      const message = data?.message || data?.error || 'Please check your input and try again.';
      return {
        type: 'validation',
        title: 'Invalid Input',
        message: message,
        canRetry: true,
        originalError: error,
      };
    }

    // Server errors
    if (status >= 500) {
      return {
        type: 'server',
        title: 'Server Error',
        message: 'Our servers are experiencing issues. Please try again in a few moments.',
        canRetry: true,
        originalError: error,
      };
    }

    // Other HTTP errors
    return {
      type: 'server',
      title: 'Request Failed',
      message: data?.message || data?.error || `Request failed with status ${status}`,
      canRetry: true,
      originalError: error,
    };
  }

  // Generic errors
  return {
    type: 'generic',
    title: 'Something went wrong',
    message: error?.message || 'An unexpected error occurred. Please try again.',
    canRetry: true,
    originalError: error,
  };
}

/**
 * Checks if an error is a network-related error
 */
export function isNetworkError(error: any): boolean {
  if (!error) return false;
  
  // Axios network errors
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    return true;
  }

  // Timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return true;
  }

  // No response (network issue)
  if (!error.response && error.request) {
    return true;
  }

  return false;
}

/**
 * Extracts a user-friendly error message from various error formats
 */
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Checks if an error is retryable
 */
export function isRetryableError(error: any): boolean {
  const errorInfo = categorizeError(error);
  return errorInfo.canRetry;
}

/**
 * Logs error details for debugging
 */
export function logError(context: string, error: any): void {
  console.error(`[${context}] Error:`, {
    message: error?.message,
    code: error?.code,
    status: error?.response?.status,
    data: error?.response?.data,
    stack: error?.stack,
  });
}
