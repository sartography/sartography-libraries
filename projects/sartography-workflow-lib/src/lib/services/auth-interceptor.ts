/** Intercepts all calls to the backend and assigns an authorization code so we know who this nice person is. */

import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() { }

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

    // send cloned request with header to the next handler.
    return next.handle(req);
  }
}
