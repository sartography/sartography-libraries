import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import {ApiService} from './api.service';
import {APP_BASE_HREF} from '@angular/common';
import {Router} from '@angular/router';
import {MockEnvironment} from '../testing/mocks/environment.mocks';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('UserService', () => {
  let service: UserService;
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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
