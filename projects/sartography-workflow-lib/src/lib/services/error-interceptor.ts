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

        // Redirect users through the login process, passing in the url back
        // to the session endpoint, so we can capture the token and save it.
        if (this.environment.production) {
          console.log('ErrorInterceptor redirecting to API login');

          // get the url of the page the user is currently on, and save it in
          // local storage.
          localStorage.setItem('prev_url', location.href);
          this.apiService.redirectToLogin(location.origin + '/session');
        } else {
          console.log('ErrorInterceptor redirecting to /');

          // We're not on production, so just redirect to the fake login screen.
          this.apiService.openUrl('/sign-in');
        }
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }))
  }
}
