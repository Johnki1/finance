export const initErrorHandler = () => {
  // Integración futura con Sentry:
  // const Sentry = require('@sentry/react-native');
  // Sentry.init({ dsn: env.sentryDsn, environment: env.appEnv });
};

export const captureException = (error: unknown) => {
  console.error('[Error]', error);
  // En el futuro:
  // const Sentry = require('@sentry/react-native');
  // if (Sentry) Sentry.captureException(error);
};
