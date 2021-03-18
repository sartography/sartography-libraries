import { TestBed, fakeAsync } from '@angular/core/testing';
import { UserService } from './user.service';
import {ApiService} from './api.service';
import {APP_BASE_HREF} from '@angular/common';
import {Router} from '@angular/router';
import {MockEnvironment} from '../testing/mocks/environment.mocks';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {mockUser0, mockUser1} from '../testing/mocks/user.mocks';



describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const mockEnvironment = new MockEnvironment();
  const mockRouter = {
    createUrlTree: jasmine.createSpy('createUrlTree'),
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useValue: mockEnvironment},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: Router, useValue: mockRouter},
        {provide: Location, useValue: location},
      ]
    });
    service = TestBed.inject(UserService);
  });

  beforeEach(() => {
  localStorage.removeItem('admin_view_as');
  localStorage.setItem('token', 'some_token');
  httpMock = TestBed.inject(HttpTestingController);
  const userReq = httpMock.expectOne('apiRoot/user');
  expect(userReq.request.method).toEqual('GET');
  userReq.flush(mockUser0);


  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load user', () => {
    expect(!!localStorage.getItem( 'admin_view_as')).toBeFalse();
    expect((service as any)._realUser.value).toEqual(mockUser0);
    expect((service as any)._isAdmin.value).toBeTrue();
    expect((service as any)._isImpersonating.value).toBeFalse();

  });

  it('should impersonate user',() => {
    // click on the nav link and then verify user is != realUser

    (service as any).viewAs('rhh8n')
    // First step - we get back the main user
    const userReq1 = httpMock.expectOne('apiRoot/user');
    expect(userReq1.request.method).toEqual('GET');
    userReq1.flush(mockUser0);
    // second step - we get back the impersonated user
    const userReq = httpMock.expectOne('apiRoot/user?admin_impersonate_uid=rhh8n');
    expect(userReq.request.method).toEqual('GET');
    userReq.flush(mockUser1);

    // now we should be impersonating but still admin so we can still switch
    expect(localStorage.getItem( 'admin_view_as')).toEqual('rhh8n')
    expect((service as any)._isAdmin.value).toBeTrue();
    expect((service as any)._isImpersonating.value).toBeTrue();

  });




});
