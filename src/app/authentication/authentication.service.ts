import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap, map, switchMap, catchError, timeout} from 'rxjs/operators';
import { AuthService } from 'ngx-auth';
import {TokenStorage} from './token.service';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import * as jwt_decode from 'jwt-decode';
import {EnvironmentSpecificService} from '../environment-specific.service';
import {EnvSpecific} from '../models/env-specific';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {User} from '../models/user';

interface AccessData {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

@Injectable()
export class AuthenticationService implements AuthService {

  private api: string;

  private interruptedUrl: string;
  private user: User;

  public authenticationChanged = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router,
    private spinner: NgxSpinnerService,
    private envSpecificSvc: EnvironmentSpecificService
  ) {
    envSpecificSvc.subscribe(this, this.setApi);

    // Check if we have token

  }

  setApi(caller: any, es: EnvSpecific) {
    const thisCaller = caller as AuthenticationService;
    thisCaller.api = es.api;
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

    return this.tokenStorage
      .getAccessToken()
      .pipe(map((token) => {
        if (token !== null) {
          return true;
        }
      }));
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

    this.spinner.show();

    console.log('refreshToken');

    return this.tokenStorage
      .getRefreshToken()
      .pipe(
        switchMap((refreshToken: string) =>
          this.http.post(this.api + `token/refresh/`, { 'refresh': refreshToken })
        ),
        timeout(5000),
        tap((tokens: AccessData) => {
          console.log('got tokens');
          console.log(tokens);
          this.saveAccessData(tokens);
          this.spinner.hide();
        }),
        catchError((err) => {
          console.log('caught error, do logout');
          console.log(err);
          this.logout();

          this.router.navigate(['/login']);

          return Observable.throw(err);
        })
      );
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

  public login(username, password): Observable<any> {
    console.log('login request for ' + username);
    return this.http.post(this.api + `login/`, {'username': username, 'password': password})
      .pipe(tap((tokens: AccessData) => {
        this.saveAccessData(tokens);
      }));
  }

  /**
   * Logout
   */
  public logout(): void {
    this.tokenStorage.clear();
    this.user = null;
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
      return;
    }

    if (access_data.access_token !== null) {
      console.log('Store access token');
      this.tokenStorage.setAccessToken(access_data.access_token);
      this.user = access_data.user;
      this.authenticationChanged.next(this.user);
    }
  }

  public getInterruptedUrl(): string {
    return this.interruptedUrl;
  }

  public setInterruptedUrl(url: string): void {
    this.interruptedUrl = url;
  }

  public getUser() {
    return this.user;
  }

}
