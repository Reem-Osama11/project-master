import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://19550cafebc1034393d4d4bd09abbaa5@o4508709142331392.ingest.us.sentry.io/4508709145214976",
  integrations: [
    Sentry.mongooseIntegration()
  ],
  // Tracing
  // tracesSampleRate: 1.0,
})