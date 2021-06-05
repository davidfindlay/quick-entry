import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate  {

  constructor(private userService: UserService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.userService.getUsers()) {
      const user = this.userService.getUsers();
      if (user !== undefined && user !== null) {
        if (user.is_admin) {
          return true;
        } else {
          this.router.navigate(['/not-authorised']);
          return false;
        }
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
