import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';
import {ApiService} from '../../services/api.service';
import {MockEnvironment} from '../../testing/mocks/environment.mocks';
import {mockUser} from '../../testing/mocks/user.mocks';
import {SessionRedirectComponent} from './session-redirect.component';

describe('SessionRedirectComponent', () => {
  let component: SessionRedirectComponent;
  let fixture: ComponentFixture<SessionRedirectComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SessionRedirectComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({token: 'some_token'})),
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
    component = fixture.componentInstance;
    fixture.detectChanges();

    localStorage.setItem('token', 'some_token');
    const goPrevUrlSpy = spyOn(component, 'goPrevUrl').and.callThrough();
    const sReq = httpMock.expectOne('apiRoot/user');
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(mockUser);
    expect(goPrevUrlSpy).toHaveBeenCalled();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
