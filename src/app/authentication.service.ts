import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Subject} from 'rxjs/Subject';
import {User} from './models/user';
import { AuthService } from 'ngx-auth';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {EnvironmentSpecificService} from './environment-specific.service';
import {EnvSpecific} from './models/env-specific';


@Injectable()
export class AuthenticationService implements AuthService {
  private api;

  public token: string;
  public user: User;

  private interruptedUrl: string;

  authenticationChanged = new Subject<User>();

  constructor(private http: HttpClient,
              private envSpecificSvc: EnvironmentSpecificService) {
    envSpecificSvc.subscribe(this, this.setApi);
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

  setApi(caller: any, es: EnvSpecific) {
    const thisCaller = caller as AuthenticationService;
    thisCaller.api = es.api;
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post(this.api + 'auth/login',
        JSON.stringify({username: username, password: password}))
        .map((response: any) => {
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
      })
        .catch(e => {
            if (e.status === 401) {
                console.log('401 Unauthorised');
                return Observable.throw('Unauthorised');
            }
        });
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    console.log('log out requested')
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

        return Observable.of(isAuthorized);
    }

    public getAccessToken(): Observable<string> {
        const accessToken: string = localStorage.getItem('accessToken');

        return Observable.of(accessToken);
    }

    public refreshToken(): Observable<any> {
        const refreshToken: string = localStorage.getItem('refreshToken');

        return this.http
            .post(this.api + 'auth/refresh-token', { refreshToken });
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
