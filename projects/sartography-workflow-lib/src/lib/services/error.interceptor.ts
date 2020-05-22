import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ApiService} from './api.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private apiService: ApiService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // Watch for a redirect on calls to the api, not permission denied.

        // auto logout if 401 response returned from api
        localStorage.removeItem('currentUser');
        // get the url of the page the user is currently on, and save it to the
        // 'previous_page' in local storage.
        localStorage.setItem('prev_url', this.router.url);

        // Redirect users through the login process, passing in the url back
        // to the session endpoint, so we can capture the token and save it.
        this.apiService.redirectToLogin(this.router.url)
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }))
  }
}
