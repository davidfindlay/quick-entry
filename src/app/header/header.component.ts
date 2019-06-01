import {Component, OnInit} from '@angular/core';

import {User} from '../models/user';
import {UserService} from '../user.service';
import {AuthenticationService} from '../authentication.service';
import {Subscription} from 'rxjs/Subscription';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    displayName: string;
  users: User;
  userSubscription: Subscription;

  constructor(private userService: UserService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {

      // Get initial state
      this.users = this.userService.getUsers();
      this.updateDisplayName();

      // Maintain state
    this.userSubscription = this.userService.userChanged
      .subscribe((user: User) => {
        this.users = this.userService.getUsers();
        this.updateDisplayName();

      });
  }

  onLogOutClick() {

    console.log('onLogOutClick()');

    this.authenticationService.logout();
    this.updateDisplayName();

  }

  updateDisplayName() {
      if (this.users) {
          if (this.users.firstname !== '') {
              this.displayName = this.users.firstname + ' ' + this.users.surname;
          } else {
              this.displayName = this.users.username;
          }
      } else {
          this.displayName = '';
      }
  }

}
