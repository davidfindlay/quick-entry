import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication';
import {UserService} from '../user.service';
import {User} from '../models/user';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {

  userIsAdmin = false;
  userLoggedIn;

  constructor(private authService: AuthenticationService,
              private userService: UserService) { }

  ngOnInit() {
    if (this.userService.getUsers()) {
      const user = this.userService.getUsers();
      console.log(user);
      this.userIsAdmin = user.is_admin;
    }

    this.userService.userChanged.subscribe((user: User) => {
      console.log(user);
      if (user === null) {
        this.userIsAdmin = false;
        this.userLoggedIn = false;
      } else {
        this.userLoggedIn = true;
        this.userIsAdmin = user.is_admin;
      }
    });
  }

}
