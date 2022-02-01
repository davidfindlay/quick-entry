import { Component, OnInit } from '@angular/core';
import {SportsTGMember} from '../models/sportstg-member';

@Component({
  selector: 'app-sportstg-members',
  templateUrl: './sportstg-members.component.html',
  styleUrls: ['./sportstg-members.component.css']
})
export class SportstgMembersComponent implements OnInit {

  members: SportsTGMember[];

  constructor() { }

  ngOnInit(): void {
  }

}
