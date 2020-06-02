import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {SessionRedirectComponent} from '../components/session-redirect/session-redirect.component';
import {MockEnvironment} from '../testing/mocks/environment.mocks';
import {GoogleAnalyticsService} from './google-analytics.service';

describe('GoogleAnalyticsService', () => {
  let service: GoogleAnalyticsService;
  const mockEnvironment = new MockEnvironment();
  const mockRouter = {
    createUrlTree: jasmine.createSpy('createUrlTree'),
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => TestBed.configureTestingModule({
    declarations: [SessionRedirectComponent],
    imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
      {
        path: 'session/:token',
        component: SessionRedirectComponent
      }
    ])],
    providers: [
      GoogleAnalyticsService,
      {provide: 'APP_ENVIRONMENT', useValue: mockEnvironment},
      {provide: APP_BASE_HREF, useValue: ''},
      {provide: Router, useValue: mockRouter},
      {provide: Location, useValue: location},
    ]
  }));

  it('should be created', () => {
    service = TestBed.inject(GoogleAnalyticsService);
    expect(service).toBeTruthy();
  });
});
