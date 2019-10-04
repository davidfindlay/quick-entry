import { Component, OnInit } from '@angular/core';
import {User} from '../models/user';
import {UserService} from '../user.service';
import {AuthenticationService} from '../authentication';


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  user: User;

  constructor(private authService: AuthenticationService,
              private userService: UserService) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    console.log(this.user);
  }

}
