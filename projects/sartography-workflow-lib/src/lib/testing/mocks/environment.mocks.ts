import {AppEnvironment} from '../../types/app-environment';

export class MockEnvironment implements AppEnvironment {
  production = false;
  api = 'apiRoot';
  googleAnalyticsKey = '';
  irbUrl = '';
}
