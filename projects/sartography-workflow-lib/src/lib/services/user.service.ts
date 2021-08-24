import {EventEmitter, Injectable, Output} from '@angular/core';
import {User} from '../types/user';
import {ApiService} from './api.service';

import {GoogleAnalyticsService} from './google-analytics.service';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  @Output() userChanged = new EventEmitter<User>();
  private readonly user = new BehaviorSubject<User>(undefined);
  private readonly isAdmin = new BehaviorSubject(false);
  private readonly isImpersonating = new BehaviorSubject(false);
  private readonly realUser = new BehaviorSubject<User>(undefined);
  // we give the option to use observables
  readonly user$ = this.user.asObservable();
  readonly realUser$ = this.realUser.asObservable();
  readonly isImpersonating$ = this.isImpersonating.asObservable();
  readonly isAdmin$ = this.isAdmin.asObservable();

  constructor(private api: ApiService,
              public googleAnalyticsService: GoogleAnalyticsService) {
    this._loadUser();
  }

  private _impersonate() {
    const impersonateUid = localStorage.getItem('admin_view_as');
    if ((impersonateUid !== null) &&
        (impersonateUid !== this.realUser.value.uid) &&
        this.isAdmin.value) {
          this.api.getUser(impersonateUid).subscribe(u => {
            this.user.next(u);
            this.isImpersonating.next(true);
            this._afterUserLoad();
      }, () => this._onLoginError());
    } else {
      this.user.next(this.realUser.value);
      this.isImpersonating.next(false);
      this._afterUserLoad();
    }
  }

  private _loadUser() {
    this.api.getUser().subscribe(u => {
      if (u) {
        this.realUser.next(u);
        this.isAdmin.next(u.is_admin);
        this._impersonate();
      } else {
        this._onLoginError();
      }
    }, () => this._onLoginError());
  }

  private _afterUserLoad() {
    if (this.realUser.value && this.realUser.value.uid) {
      this.googleAnalyticsService.setUser(this.realUser.value.uid);
    }
    this.userChanged.emit(this.user.value);
  }

  viewAs(uid: string) {
    if (this.isAdmin.value && (uid !== this.realUser.value.uid)) {
      localStorage.setItem('admin_view_as', uid);
    } else {
      localStorage.removeItem('admin_view_as');
    }
    this._loadUser();
  }

  private _onLoginError() {
    localStorage.removeItem('admin_view_as');
    localStorage.removeItem('token');
    this.userChanged.emit(null);
  }

}

