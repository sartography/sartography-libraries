import {APP_BASE_HREF} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {NgZone} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {Router} from '@angular/router';
import {MockEnvironment} from '../testing/mocks/environment.mocks';
import {MockNgZone} from '../testing/mocks/ngzone.mocks';
import {mockApiError, mockApiErrorResponse, mockErrorResponse} from '../testing/mocks/study-status.mocks';
import {Study} from '../types/study';
import {ApiService} from './api.service';
import {ErrorInterceptor} from './error-interceptor';
import {GoogleAnalyticsService} from './google-analytics.service';

describe('ErrorInterceptor', () => {
  let errorInterceptor: ErrorInterceptor;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  const mockEnvironment = new MockEnvironment();
  const mockRouter = {
    createUrlTree: jasmine.createSpy('createUrlTree'),
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatBottomSheetModule,
        NoopAnimationsModule,
      ],
      providers: [
        ErrorInterceptor,
        ApiService,
        {
          provide: GoogleAnalyticsService, useValue: {
            errorEvent: () => {
            }
          }
        },
        {provide: 'APP_ENVIRONMENT', useValue: mockEnvironment},
        {provide: APP_BASE_HREF, useValue: ''},
        {provide: NgZone, useClass: MockNgZone},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        {provide: Router, useValue: mockRouter},
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    errorInterceptor = TestBed.inject(ErrorInterceptor);
  });

  it('should create', () => {
    expect(errorInterceptor).toBeDefined();
  });

  it('redirects to login on unauthorized error', () => {
    const redirectToLoginSpy = spyOn((errorInterceptor as any).apiService, 'redirectToLogin').and.stub();
    const errorStatus = 403;
    const fakeUrl = 'apiRoot/home';
    const expectedMessage = `Http failure response for ${fakeUrl}: ${errorStatus} unauthorized`;
    localStorage.setItem('currentUser', 'some_user');

    httpClient.get<Study>(fakeUrl).subscribe(
      _ => fail(`should have failed with a ${errorStatus} error`),
      error => {
        expect(error).toEqual(expectedMessage, 'message')
      }
    );

    const req = httpMock.expectOne(fakeUrl);
    req.flush(null, {status: errorStatus, statusText: 'unauthorized'});

    expect(localStorage.getItem('currentUser')).toBeFalsy();
    expect(redirectToLoginSpy).toHaveBeenCalled();
  });

  it('display API error in bottom sheet', () => {
    const bottomSheetOpenSpy = spyOn(errorInterceptor.bottomSheet, 'open').and.stub()
    const logErrorSpy = spyOn((errorInterceptor as any).googleAnalyticsService, 'errorEvent').and.stub();
    const errorStatus = 400;
    const fakeUrl = 'apiRoot/study/12345';
    const expectedMessage = `Http failure response for ${fakeUrl}: ${errorStatus} api_error`;

    httpClient.get<Study>(fakeUrl).subscribe(
      _ => fail(`should have failed with a ${errorStatus} error`),
      error => {
        expect(error).toEqual(expectedMessage, 'message')
      }
    );

    const req = httpMock.expectOne(fakeUrl);
    req.flush(mockApiError, {status: errorStatus, statusText: 'api_error'});

    expect(bottomSheetOpenSpy).toHaveBeenCalledWith(jasmine.any(Function), {data: {apiErrors: [mockApiError]}});
    expect(logErrorSpy).toHaveBeenCalledWith(mockApiError);
  });

});
