import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {of, Subscription} from 'rxjs';
import {ApiService} from '../../services/api.service';
import {MockEnvironment} from '../../testing/mocks/environment.mocks';
import {mockUser0} from '../../testing/mocks/user.mocks';
import {SessionRedirectComponent} from './session-redirect.component';
import {APP_BASE_HREF} from '@angular/common';

describe('SessionRedirectComponent', () => {
  let component: SessionRedirectComponent;
  let fixture: ComponentFixture<SessionRedirectComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SessionRedirectComponent],
      imports: [
        HttpClientTestingModule,
        MatBottomSheetModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: ''},
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({token: 'some_token'})),
          }
        },
        ApiService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SessionRedirectComponent);
    localStorage.setItem('prev_url', 'some_prev_url');
    component = fixture.componentInstance;
    const goPrevUrlSpy = spyOn(component, 'goPrevUrl').and.callThrough();
    const openUrlSpy = spyOn((component as any).api, 'openUrl').and.returnValue(of(null));
    fixture.detectChanges();

    const token = localStorage.getItem('token');
    expect(token).toEqual('some_token');

    const getUserReq = httpMock.expectOne('apiRoot/user');
    expect(getUserReq.request.method).toEqual('GET');
    getUserReq.flush(mockUser0);

    expect(goPrevUrlSpy).toHaveBeenCalled();
    expect(openUrlSpy).toHaveBeenCalled();
  });

  afterEach(() => {
    fixture.destroy();
    httpMock.verify();
  });

  it('should get user and go to previous URL', () => {
    expect(component).toBeTruthy();
  });

});
