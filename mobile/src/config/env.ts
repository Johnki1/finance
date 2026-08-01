const ENV = {
  development: {
    apiUrl: 'http://localhost:8080/api/v1',
    appEnv: 'development',
  },
  staging: {
    apiUrl: 'https://staging-api.finance.app/api/v1',
    appEnv: 'staging',
  },
  production: {
    apiUrl: 'https://api.finance.app/api/v1',
    appEnv: 'production',
  },
};

type EnvKey = keyof typeof ENV;

const getCurrentEnv = (): EnvKey => {
  // En Expo se puede definir mediante variables o defaults
  const env = (process.env.EXPO_PUBLIC_APP_ENV as EnvKey) || 'development';
  return env;
};

export const env = ENV[getCurrentEnv()];