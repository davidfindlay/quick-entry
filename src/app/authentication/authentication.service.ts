import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap, map, switchMap, catchError, timeout} from 'rxjs/operators';
import { AuthService } from 'ngx-auth';
import {TokenStorage} from './token.service';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {User} from '../models/user';
import {environment} from '../../environments/environment';
import {of} from 'rxjs/internal/observable/of';

interface AccessData {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

@Injectable()
export class AuthenticationService implements AuthService {

  private interruptedUrl: string;
  private user: User;

  public authenticationChanged = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
    // Check if we have token
    this.isAuthorized().subscribe((authorized: boolean) => {
      if (authorized) {
        this.user = JSON.parse(localStorage.getItem('user'));
        this.authenticationChanged.next(this.user);
      } else {
        this.authenticationChanged.next(null);
      }
    });


  }

  /**
   * Check, if user already authorized.
   * @description Should return Observable with true or false values
   * @returns {Observable<boolean>}
   * @memberOf AuthService
   */
  public isAuthorized(): Observable < boolean > {
    // return this.tokenStorage
    //   .getAccessToken()
    //   .pipe(map(token => !!token));
    console.log('isAuthorized');

    return new Observable((observer) => {
      this.tokenStorage.getAccessToken().subscribe((token: string) => {
        console.log('test');
        console.log(token);
        if (token !== undefined && token !== null) {
          console.log('isAuthorized true');
          observer.next(true);
        } else {
          console.log('isAuthorized false');
          observer.next(false);
        }
      });
    });
  }

  /**
   * Get access token
   * @description Should return access token in Observable from e.g.
   * localStorage
   * @returns {Observable<string>}
   */
  public getAccessToken(): Observable < string > {
    return this.tokenStorage.getAccessToken();
  }

  /**
   * Function, that should perform refresh token verifyTokenRequest
   * @description Should be successfully completed so interceptor
   * can execute pending requests or retry original one
   * @returns {Observable<any>}
   */
  public refreshToken(): Observable <AccessData> {
    this.logout();
    this.router.navigate(['/login']);
    return of(null);
  }

  /**
   * Function, checks response of failed request to determine,
   * whether token be refreshed or not.
   * @description Essentialy checks status
   * @param {Response} response
   * @returns {boolean}
   */
  public refreshShouldHappen(response: HttpErrorResponse): boolean {
    return response.status === 401;
  }

  /**
   * Verify that outgoing request is refresh-token,
   * so interceptor won't intercept this request
   * @param {string} url
   * @returns {boolean}
   */
  public verifyTokenRequest(url: string): boolean {
    return url.endsWith('/refresh/');
  }

  /**
   * EXTRA AUTH METHODS
   */

  public login(username, password, keepmeloggedin): Observable<any> {
    console.log('login request for ' + username);
    return this.http.post(environment.api + `login/`, {'username': username, 'password': password,
      'keepmeloggedin': keepmeloggedin})
      .pipe(tap((tokens: AccessData) => {
        console.log(tokens);
        this.saveAccessData(tokens);
        if (this.getInterruptedUrl() !== undefined && this.getInterruptedUrl() !== null) {
          console.log('Attempt to navigate to interrupted route' + this.getInterruptedUrl());
          // this.router.navigate()
        }
      }));
  }

  /**
   * Logout
   */
  public logout(): void {
    this.tokenStorage.clear();
    this.user = null;
    localStorage.removeItem('user');
    this.authenticationChanged.next(null);
  }

  /**
   * Save access data in the storage
   *
   * @private
   * @param {AccessData} data
   */
  private saveAccessData(access_data: AccessData) {

    if (access_data.access_token == null) {
      console.log('Clear tokens cause new ones are null');
      this.tokenStorage.clear();
      localStorage.removeItem('user');
      return;
    }

    if (access_data.access_token !== null) {
      console.log('Store access token');

      const expiry = new Date();
      expiry.setSeconds(expiry.getSeconds() + access_data.expires_in);
      this.tokenStorage.setAccessToken(access_data.access_token, expiry);
      this.user = access_data.user;
      localStorage.setItem('user', JSON.stringify(this.user));
      this.authenticationChanged.next(this.user);
    }
  }

  public getInterruptedUrl(): string {
    console.log('interruptedUrl was ' + this.interruptedUrl);
    return this.interruptedUrl;
  }

  public setInterruptedUrl(url: string): void {
    console.log('interruptedUrl set to ' + url);
    this.interruptedUrl = url;
  }

  public getUser() {
    return this.user;
  }

}
