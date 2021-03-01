import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication';
import {UserService} from '../user.service';
import {User} from '../models/user';
import {Member} from '../models/member';
import {MeetService} from '../meet.service';
import {Meet} from '../models/meet';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {

  userIsAdmin = false;
  userIsMeetOrganiser = true;
  userLoggedIn;

  meetName = 'Meet Organiser';
  meetsOrganising = [];

  constructor(private authService: AuthenticationService,
              private userService: UserService,
              private meetService: MeetService) { }

  ngOnInit() {
    if (this.userService.getUsers()) {
      const user = this.userService.getUsers();
      console.log(user);
      this.userIsAdmin = user.is_admin;
      if (user !== undefined && user !== null) {
        this.getMeetOrganiserMenu();
      }
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

    this.userService.memberChanged.subscribe((member: Member) => {
      this.getMeetOrganiserMenu();
    });
  }

  getMeetOrganiserMenu() {
    console.log('getMeetOrganiserMenu');
    const meetsOrganised = this.userService.getMeetsOrganised();
    this.meetService.getAllMeets().subscribe((meets: Meet[]) => {
      this.meetsOrganising = [];
      for (let x = 0; x < meetsOrganised.length; x++) {
        for (let y = 0; y < meets.length; y++) {
          if (meets[y].id === meetsOrganised[x]) {
            if (this.meetsOrganising.indexOf(meets[y]) === -1) {
              this.meetsOrganising.push(meets[y]);
            }
          }
        }
      }
    });

  }

}
