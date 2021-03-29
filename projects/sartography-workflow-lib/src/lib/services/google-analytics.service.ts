import {APP_BASE_HREF} from '@angular/common';
import {HttpRequest} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {ApiError} from '../types/api';
import {AppEnvironment} from '../types/app-environment';

declare var gtag;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  analyticsKey: string;

  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    @Inject(APP_BASE_HREF) public baseHref: string,
    private router: Router,
  ) {
    this.analyticsKey = this.environment.googleAnalyticsKey;
  }

  public authEvent(req: HttpRequest<any>) {
    this.event('login', 'authentication', req.url)
  }

  public errorEvent(error: ApiError) {
    this.event(error.code, 'error_messages', error.message);
  }

  public setUser(uid) {
    if (typeof gtag !== 'undefined') {
      gtag('set', {user_id: uid}); // Set the user ID using signed-in user_id.
    }
    this.event('user-id available', 'authentication', uid)
  }

  public init(analyticsKey) {
    this.analyticsKey = analyticsKey || this.analyticsKey;
    this.listenForRouteChanges();

    try {
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = 'https://www.googletagmanager.com/gtag/js?id=' + this.analyticsKey;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '` + this.analyticsKey + `', {'send_page_view': false});
      `;
      document.head.appendChild(script2);
    } catch (ex) {
      console.error('Error appending google analytics');
      console.error(ex);
    }
  }

  private event(action: string, category: string, label: string) {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label
      });
    }
  }

  private listenForRouteChanges() {
    const analyticsKey = this.environment.googleAnalyticsKey;
    this.router.events.subscribe(event => {
      if (gtag && event instanceof NavigationEnd) {
        gtag('config', analyticsKey, {
          page_path: event.urlAfterRedirects,
        });
      }
    });
  }
}
