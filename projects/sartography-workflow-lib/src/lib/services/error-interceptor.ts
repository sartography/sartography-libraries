import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AppEnvironment} from '../types/app-environment';
import {ApiService} from './api.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private apiService: ApiService,
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {

      // Watch for a redirect on calls to the API, not permission denied.
      if (err.status === 401 || err.status === 403) {

        // auto logout if 401 or 403 response returned from API
        localStorage.removeItem('currentUser');
        this.apiService.redirectToLogin();
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }))
  }
}
