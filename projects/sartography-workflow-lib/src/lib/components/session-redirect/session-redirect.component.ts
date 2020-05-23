import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'lib-session-redirect',
  templateUrl: 'session-redirect.component.html',
  styleUrls: ['./session-redirect.component.scss']
})
export class SessionRedirectComponent {

  /**
   * Accepts a token from the server, then redirects the user to the home page.
   * This allows single sign on through Shibboleth.
   */
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router) {

    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('token')) {
        const token = paramMap.get('token');

        if (token) {
          localStorage.setItem('token', token);
          this.api.getUser().subscribe(_ => this.goPrevUrl());
        }
      }
    });
  }

  goPrevUrl() {
    const prevUrl = localStorage.getItem('prev_url') || '/';
    localStorage.removeItem('prev_url');
    this.api.openUrl(prevUrl);
  }
}
