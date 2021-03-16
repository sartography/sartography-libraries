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
  private readonly _user = new BehaviorSubject<User>(undefined);
  private readonly _isAdmin = new BehaviorSubject(false);
  private readonly _isImpersonating = new BehaviorSubject(false);
  private readonly _realUser = new BehaviorSubject<User>(undefined);
  // we give the option to use observables
  readonly user$ = this._user.asObservable();
  readonly realUser$ =this._realUser.asObservable();
  readonly isImpersonating$ = this._isImpersonating.asObservable();
  readonly isAdmin$ = this._isAdmin.asObservable();

  constructor(private api: ApiService,
              public googleAnalyticsService: GoogleAnalyticsService) {
    this._loadUser()
  }

  private _impersonate() {
    const impersonateUid = localStorage.getItem('admin_view_as');
    if ((impersonateUid !== null) &&
        (impersonateUid !== this._realUser.value.uid) &&
        this._isAdmin.value) {
          this.api.getUser(impersonateUid).subscribe(u => {
            this._user.next(u);
            this._isImpersonating.next(true);
            this._afterUserLoad()
      }, () => this._onLoginError())
    } else {
      this._user.next(this._realUser.value);
      this._isImpersonating.next(false);
      this._afterUserLoad();
    }
  }

  private _loadUser() {
    this.api.getUser().subscribe(u => {
      this._realUser.next(u);
      this._isAdmin.next(u.is_admin);
      this._impersonate();
    }, () => this._onLoginError());
  }

  private _afterUserLoad() {
    if (this._realUser.value && this._realUser.value.uid) {
      this.googleAnalyticsService.setUser(this._realUser.value.uid);
    }
    this.userChanged.emit(this._user.value);
  }

  viewAs(uid: string) {
    if (this._isAdmin.value && (uid !== this._realUser.value.uid)) {
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

