export interface AppEnvironment {
  homeRoute: string;
  production: boolean;
  api: string;
  irbUrl: string;
  title: string;
  googleAnalyticsKey: string;
  sentryKey?: string;
}
