import {Injectable} from '@angular/core';
import {AppEnvironment} from '../../types/app-environment';

@Injectable()
export class MockEnvironment implements AppEnvironment {
  homeRoute = 'home';
  production = false;
  hideDataPane = true;
  api = 'apiRoot';
  irbUrl = 'irbUrl';
  title = 'CR Connect';
  googleAnalyticsKey = 'some_key';
  sentryKey = 'some_key';
}
