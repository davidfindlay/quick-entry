import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetService} from '../../meet.service';
import {HttpClient} from '@angular/common/http';
import {Meet} from '../../models/meet';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  meetId;
  meet;
  meetName;
  entries;
  contactTable = [];
  contactColumns = [
    { name: 'Entry ID', prop: 'meet_entries_id' },
    { name: 'Entrant', prop: 'entrant_details' },
    { name: 'Club', prop: 'club' },
    { name: 'Phone', prop: 'phone'},
    { name: 'Email', prop: 'email'}
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private meetService: MeetService,
              private http: HttpClient) { }

  ngOnInit() {
    this.meetId = parseInt(this.activatedRoute.snapshot.params['meetId'], 10);
    console.log('Entrant Contacts meetId = ' + this.meetId);
    this.meetService.getMeetDetails(this.meetId).subscribe((meet: Meet) => {
      if (meet !== undefined && meet !== null) {
        this.meet = meet;
        this.meetName = meet.meetname;
      } else {
        console.error('Unable to load meet details for meetId: ' + this.meetId);
      }
    });

    this.http.get(environment.api + 'meet_entries/' + this.meetId).subscribe((entries: any) => {
      this.entries = entries.meet_entries;

      for (let i = 0; i < this.entries.length; i++) {

        let updated = '';

        if (this.entries[i].updated_at !== undefined && this.entries[i].updated_at !== null) {
          updated = this.entries[i].updated_at;
        }

        const member_details = this.entries[i].member.surname + ', ' + this.entries[i].member.firstname + ' (' + this.entries[i].member.number + ')';
        let entrant_phone = 'n/a';
        let entrant_email = 'n/a';

        if (this.entries[i].member.phones !== undefined && this.entries[i].member.phones !== null) {
          const latest_phone = this.entries[i].member.phones.length - 1;
          entrant_phone = this.entries[i].member.phones[latest_phone].phonenumber;
        }

        if (this.entries[i].member.emails !== undefined && this.entries[i].member.emails !== null) {
          const latest_email = this.entries[i].member.emails.length - 1;
          entrant_email = this.entries[i].member.emails[latest_email].address;
        }

        let club_details = 'n/a';

        if (this.entries[i].club !== undefined && this.entries[i].club !== null) {
          club_details = this.entries[i].club.clubname + ' (' + this.entries[i].club.code + ')';
        }

        const row = {
          meet_entries_id: this.entries[i].id,
          entrant_details: member_details,
          club: club_details,
          phone: '<a href=\"tel:' + entrant_phone + '\">' + entrant_phone + '</a>',
          email: '<a href=\"mailto:' + entrant_email + '\">' + entrant_email + '</a>'
        };

        this.contactTable.push(row);
      }

      this.contactTable = [...this.contactTable];

    });
  }

}
