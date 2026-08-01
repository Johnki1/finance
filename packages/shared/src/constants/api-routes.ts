export const API_ROUTES = {
  AUTH: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    VERIFY: '/api/v1/auth/verify',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
  },
  INCOMES: '/api/v1/incomes',
  FIXED_EXPENSES: '/api/v1/fixed-expenses',
  VARIABLE_EXPENSES: '/api/v1/variable-expenses',
  SUMMARY: '/api/v1/summary',
  REPORTS: {
    QUARTERLY: '/api/v1/reports/quarterly',
    CUSTOM: '/api/v1/reports/custom',
  },
} as const;