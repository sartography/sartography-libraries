import {AppEnvironment} from '../../types/app-environment';
import { Injectable } from "@angular/core";

@Injectable()
export class MockEnvironment implements AppEnvironment {
  production = false;
  api = 'apiRoot';
  googleAnalyticsKey = '';
  irbUrl = '';
}
