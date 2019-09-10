import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication';
import {UserService} from '../user.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {

  constructor(private authService: AuthenticationService,
              private userService: UserService) { }

  ngOnInit() {
  }

}
