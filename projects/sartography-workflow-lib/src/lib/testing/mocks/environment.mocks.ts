import {Injectable} from '@angular/core';
import {AppEnvironment} from '../../types/app-environment';

@Injectable()
export class MockEnvironment implements AppEnvironment {
  production = false;
  api = 'apiRoot';
  googleAnalyticsKey = '';
  irbUrl = '';
}
