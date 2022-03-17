import { Component, OnInit } from '@angular/core';
import {SportsTGMember} from '../models/sportstg-member';
import {MembershipImportService} from '../membership-import.service';
import {DateTime} from 'luxon';

@Component({
  selector: 'app-sportstg-members',
  templateUrl: './sportstg-members.component.html',
  styleUrls: ['./sportstg-members.component.css']
})
export class SportstgMembersComponent implements OnInit {

  members: SportsTGMember[];

  constructor(private membershipImportService: MembershipImportService) { }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.membershipImportService.getSportsTGMembers().subscribe((results: any) => {
      this.members = results.sportstg_members;
      console.log(this.members);
    });
  }

  getLocal(tsString) {
    const tsDt = DateTime.fromSQL(tsString, { zone: 'UTC' });
    return tsDt.setZone('Australia/Brisbane').toFormat('d/L/yyyy h:m a');
  }

}
