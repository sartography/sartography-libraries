import {EventEmitter, Injectable, Output} from '@angular/core';
import {User} from '../types/user';
import {ApiService} from './api.service';

import {GoogleAnalyticsService} from './google-analytics.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  @Output() userChanged = new EventEmitter<User>();
  private realUser: User;
  private impersonatedUser: User;
  constructor(private api: ApiService,
              public googleAnalyticsService: GoogleAnalyticsService) {
  }

  public _loadUser() {
    this.impersonatedUser = undefined;
    const impersonateUid = localStorage.getItem('admin_view_as');

    if (this.isAdmin) {
      this.api.getUser(impersonateUid || undefined).subscribe(u => {
        if (this.realUser.uid !== impersonateUid && this.realUser.uid !== u.uid) {
          this.impersonatedUser = u;
        } else {
          this.realUser = u;
        }

        this._afterUserLoad();
      }, () => this._onLoginError());
    } else if (impersonateUid) {
      // Get the real user first
      this.api.getUser().subscribe(u => {
        this.realUser = u;

        // Then impersonate
        if (this.isAdmin) {
          this._loadUser();
        }
      }, () => this._onLoginError());
    } else {
      this.api.getUser().subscribe(u => {
        this.realUser = u;
        this._afterUserLoad();
      }, () => this._onLoginError());
    }
  }


  private _afterUserLoad() {
    if (this.realUser && this.realUser.uid) {
      this.googleAnalyticsService.setUser(this.realUser.uid);
    }
    this.userChanged.emit(this.user);
  }


  get isAdmin(): boolean {
    return this.realUser && this.realUser.is_admin;
  }

  get user(): User {
    if (this.isAdmin) {
      const isViewingAs = !!localStorage.getItem('admin_view_as') && this.impersonatedUser;
      return isViewingAs ? this.impersonatedUser : this.realUser;
    } else {
      return this.realUser;
    }
  }

  get isImpersonating(): boolean {
    return !!(localStorage.getItem('admin_view_as') && this.impersonatedUser);
  }

  viewAs(uid: string) {
    if (this.isAdmin && (uid !== this.realUser.uid)) {
      localStorage.setItem('admin_view_as', uid);
    } else {
      localStorage.removeItem('admin_view_as');
    }

    this._loadUser();
  }

  private _onLoginError() {
    localStorage.removeItem('admin_view_as');
    localStorage.removeItem('token');
  }

}

