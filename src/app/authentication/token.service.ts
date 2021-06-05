import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class TokenStorage {

  /**
   * Get access token
   * @returns {Observable<string>}
   */
  public getAccessToken(): Observable<string> {
    const token: string = <string>localStorage.getItem('accessToken');
    const tokenExpiry = localStorage.getItem('accessTokenExpires');
    const tokenExpireDate = new Date(tokenExpiry);
    const now = new Date();

    if (now > tokenExpireDate) {
      console.log('token.service: getAccessToken: token expired');
      return of(null);
    } else {
      console.log('token.service: getAccessToken: token valid');
      return of(token);
    }
  }

  /**
   * Get refresh token
   * @returns {Observable<string>}
   */
  public getRefreshToken(): Observable<string> {
    const token: string = <string>localStorage.getItem('refreshToken');

    return of(token);
  }

  /**
   * Set access token
   * @returns {TokenStorage}
   */
  public setAccessToken(token: string, expires: Date): TokenStorage {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('accessTokenExpires', expires.toISOString());

    return this;
  }

  /**
   * Set refresh token
   * @returns {TokenStorage}
   */
  public setRefreshToken(token: string, expires: Date): TokenStorage {
    localStorage.setItem('refreshToken', token);

    return this;
  }

  /**
   * Remove tokens
   */
  public clear() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
