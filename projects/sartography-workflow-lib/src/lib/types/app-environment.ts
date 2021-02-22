export interface AppEnvironment {
  homeRoute: string;
  production: boolean;
  hideDataPane?: boolean;
  api: string;
  irbUrl: string;
  title: string;
  googleAnalyticsKey: string;
  sentryKey?: string;
}
