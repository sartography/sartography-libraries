import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'lib-session-redirect',
  templateUrl: 'session-redirect.component.html',
  styleUrls: ['./session-redirect.component.scss']
})
export class SessionRedirectComponent implements OnInit, OnDestroy {

  token: string;
  private sub: Subscription;
  private TOKEN_KEY = 'token';

  /**
   * Accepts a token from the server, then redirects the user to the home page.
   * This allows single sign on through Shibboleth.  Token should be passed as
   * a get parameter, not on the path.
   */
  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {
    this.sub = this.route.queryParamMap.subscribe(paramMap => {
      this.token = paramMap.get('token');
      console.log('Setting Token to:', this.token);
      localStorage.setItem('token', this.token);
      console.log('Token is now set to:', localStorage.getItem('token'));
      this.api.getUser().subscribe(_ => this.goPrevUrl());
    });
  }

  ngOnInit() {
    console.log('ngOnInit')
  }

  ngOnDestroy() {
    console.log('ngOnDestroy')
    this.sub.unsubscribe();
  }

  goPrevUrl() {
    const prevUrl = localStorage.getItem('prev_url') || '/';
    localStorage.removeItem('prev_url');
    this.api.openUrl(prevUrl);
  }

}
