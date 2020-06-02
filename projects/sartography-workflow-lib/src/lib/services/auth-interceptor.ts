import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {GoogleAnalyticsService} from './google-analytics.service';

/**
 * Intercepts all calls to the backend and assigns an
 * authorization code so we know who this nice person is.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private googleAnalyticsService: GoogleAnalyticsService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const token = localStorage.getItem('token');

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    this.googleAnalyticsService.authEvent(req);

    // send cloned request with header to the next handler.
    return next.handle(req);
  }
}
