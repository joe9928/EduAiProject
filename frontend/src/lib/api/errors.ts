// src/lib/api/errors.ts

// Maps backend error codes to user-friendly messages
const ERROR_MESSAGES: Record<string, string> = {
  AUTH_EMAIL_TAKEN:           'This email is already registered. Try signing in.',
  AUTH_INVALID_CREDENTIALS:   'Invalid email or password. Please try again.',
  AUTH_ACCOUNT_INACTIVE:      'Your account has been suspended. Contact support.',
  AUTH_TOKEN_EXPIRED:         'Your session expired. Please sign in again.',
  AUTH_REFRESH_TOKEN_REUSE:   'Security alert: suspicious activity detected. Please sign in again.',
}

export function parseAuthError(error: unknown): string {
  // Axios error with backend response
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const response = (error as { response?: { data?: { code?: string; message?: string } } }).response
    const code     = response?.data?.code

    if (code && ERROR_MESSAGES[code]) {
      return ERROR_MESSAGES[code]
    }

    // Fallback to backend message if no code match
    if (response?.data?.message) {
      return response.data.message
    }
  }

  // Network error
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    (error as { message: string }).message === 'Network Error'
  ) {
    return 'Cannot connect to server. Please check your connection.'
  }

  return 'Something went wrong. Please try again.'
}