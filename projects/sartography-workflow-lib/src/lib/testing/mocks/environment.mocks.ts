import {Injectable} from '@angular/core';
import {AppEnvironment} from '../../types/app-environment';

@Injectable()
export class MockEnvironment implements AppEnvironment {
  homeRoute = 'home';
  production = false;
  api = 'apiRoot';
  irbUrl = 'irbUrl';
  baseHref = '/';
}
