import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Inject, Injectable, NgZone} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ApiErrorsComponent} from '../components/api-errors/api-errors.component';
import {ApiError} from '../types/api';
import {AppEnvironment} from '../types/app-environment';
import {ApiService} from './api.service';
import {GoogleAnalyticsService} from './google-analytics.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private apiService: ApiService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private router: Router,
    private zone: NgZone,
    public bottomSheet: MatBottomSheet
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

      // Display API Error
      if (err.status === 400 || err.status === 500) {
        this.zone.run(() => {
          this.bottomSheet.open(ApiErrorsComponent, {data: {apiErrors: [err.error]}});
        });
      }

      // Log error to google if possible
      if (err.error) {
        this.googleAnalyticsService.errorEvent(err.error);
      }

      const errorMessage = err.message || err.statusText;
      return throwError(errorMessage);
    }))
  }
}
