import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {Subject} from 'rxjs';
import {User} from './models/user';
import { AuthService } from 'ngx-auth';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';

import { environment } from '../environments/environment';
import { of, throwError } from 'rxjs';


@Injectable()
export class AuthenticationService implements AuthService {
  public token: string;
  public user: User;

  private interruptedUrl: string;

  authenticationChanged = new Subject<User>();

  constructor(private http: HttpClient) {
      const currentUser = localStorage.getItem('currentUser');

      if (currentUser) {
          const userObj = JSON.parse(currentUser);
          const user = userObj.user;
          this.user = user;
          const token = userObj.token;
          this.token = token;

          this.authenticationChanged.next(user);
      }
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post(environment.api + 'auth/login',
        JSON.stringify({username: username, password: password}))
      .pipe(map((response: any) => {
        // Login successful if there's a JWT in the response
            console.log(response);


        const token = response.token;
        const user = response.user;

        if (token) {
          // Set token
          this.token = token;

          // Store token
          localStorage.setItem('currentUser', JSON.stringify({user: user, token: token}));

          this.authenticationChanged.next(user);
          this.user = user;
          console.log('Successful Log in');

          // Return success
          return true;
        } else {
          // return failure
          this.authenticationChanged.next(null);
          this.user = null;
          console.log('Failed log in');
          return false;
        }
      }),
        catchError(e => {
            if (e.status === 401) {
                console.log('401 Unauthorised');
                return throwError('Unauthorised');
            }
        }));
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    console.log('log out requested');
    this.token = null;
    this.user = null;
    localStorage.removeItem('currentUser');
    this.authenticationChanged.next(null);
  }

  getToken(): string {
    return(this.token);
  }

  getUser(): User {
      return(this.user);
  }

    public isAuthorized(): Observable<boolean> {
        const isAuthorized: boolean = !!localStorage.getItem('accessToken');

        return of(isAuthorized);
    }

    public getAccessToken(): Observable<string> {
        const accessToken: string = localStorage.getItem('accessToken');

        return of(accessToken);
    }

    public refreshToken(): Observable<any> {
        const refreshToken: string = localStorage.getItem('refreshToken');

        return this.http
            .post(environment.api + 'auth/refresh-token', { refreshToken });
    }

    public refreshShouldHappen(response: HttpErrorResponse): boolean {
        return response.status === 401;
    }

    public verifyTokenRequest(url: string): boolean {
        return url.endsWith('refresh-token');
    }

    public getInterruptedUrl(): string {
        return this.interruptedUrl;
    }

    public setInterruptedUrl(url: string): void {
        this.interruptedUrl = url;
    }

}
