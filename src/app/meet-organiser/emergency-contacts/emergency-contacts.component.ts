import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetService} from '../../meet.service';
import {HttpClient} from '@angular/common/http';
import {Meet} from '../../models/meet';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-emergency-contacts',
  templateUrl: './emergency-contacts.component.html',
  styleUrls: ['./emergency-contacts.component.css']
})
export class EmergencyContactsComponent implements OnInit {

  meetId;
  meet;
  meetName;
  entries;
  contactTable = [];
  contactColumns = [
    { name: 'Entry ID', prop: 'meet_entries_id' },
    { name: 'Entrant', prop: 'entrant_details' },
    { name: 'Club', prop: 'club' },
    { name: 'Emergency Contact', prop: 'emergency_details' },
    { name: 'Phone', prop: 'phone'},
    { name: 'Email', prop: 'email'}
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private meetService: MeetService,
              private http: HttpClient) { }


  ngOnInit() {
    this.meetId = parseInt(this.activatedRoute.snapshot.params['meetId'], 10);
    console.log('Emergency Contacts meetId = ' + this.meetId);
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
        let emergency_details = 'n/a';
        let emergency_phone = 'n/a';
        let emergency_email = 'n/a';
        if (this.entries[i].member.emergency !== undefined && this.entries[i].member.emergency !== null) {
          emergency_details = this.entries[i].member.emergency.surname + ', ' + this.entries[i].member.emergency.firstname;

          if (this.entries[i].member.emergency.phone !== undefined && this.entries[i].member.emergency.phone !== null) {
            emergency_phone = this.entries[i].member.emergency.phone.phonenumber;
          }

          emergency_email = 'n/a';
        }

        let club_details = 'n/a';

        if (this.entries[i].club !== undefined && this.entries[i].club !== null) {
          club_details = this.entries[i].club.clubname + ' (' + this.entries[i].club.code + ')';
        }

        const row = {
          meet_entries_id: this.entries[i].id,
          entrant_details: member_details,
          emergency_details: emergency_details,
          club: club_details,
          phone: emergency_phone,
          email: emergency_email
        }

        this.contactTable.push(row);
      }

      this.contactTable = [...this.contactTable];

    });
  }

}
