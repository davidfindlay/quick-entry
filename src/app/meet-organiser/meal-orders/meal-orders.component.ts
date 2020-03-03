import { Component, OnInit } from '@angular/core';
import {Meet} from '../../models/meet';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetService} from '../../meet.service';
import {EntryService} from '../../entry.service';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-meal-orders',
  templateUrl: './meal-orders.component.html',
  styleUrls: ['./meal-orders.component.css']
})
export class MealOrdersComponent implements OnInit {

  meetId;
  meet;
  meetName;
  entries;
  orderTable = [];
  orderColumns = [
    { name: 'Entry ID', prop: 'meet_entries_id' },
    { name: 'Date/Time', prop: 'updated_at' },
    { name: 'Entrant', prop: 'member_details' },
    { name: 'Club', prop: 'club_details' },
    { name: 'Meals', prop: 'meals'},
    { name: 'Comments', prop: 'comments'},
    { name: 'Entry Status', prop: 'entry_status'},
    { name: 'Total Ex GST', prop: 'ex_gst'},
    { name: 'Total Inc GST', prop: 'inc_gst'}
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private meetService: MeetService,
              private http: HttpClient,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.meetId = parseInt(this.activatedRoute.snapshot.params['meetId'], 10);
    console.log('Meet Merchandise meetId = ' + this.meetId);
    this.meetService.getMeetDetails(this.meetId).subscribe((meet: Meet) => {
      if (meet !== undefined && meet !== null) {
        this.meet = meet;
        this.meetName = meet.meetname;
      } else {
        console.error('Unable to load meet details for meetId: ' + this.meetId);
        this.spinner.hide()
      }
    });

    this.http.get(environment.api + 'meet_entries/' + this.meetId).subscribe((entries: any) => {
      if (entries.success !== undefined && entries.success !== null && entries.success !== false) {
        this.entries = entries.meet_entries;

        for (let i = 0; i < this.entries.length; i++) {

          let updated = '';

          if (this.entries[i].updated_at !== undefined && this.entries[i].updated_at !== null) {
            updated = this.entries[i].updated_at;
          }

          const member_details = this.entries[i].member.surname + ', ' + this.entries[i].member.firstname + ' (' + this.entries[i].member.number + ')';

          let club_details = 'n/a';

          if (this.entries[i].club !== undefined && this.entries[i].club !== null) {
            club_details = this.entries[i].club.clubname + ' (' + this.entries[i].club.code + ')';
          }

          let status = 'n/a';
          if (this.entries[i].status !== undefined && this.entries[i].status !== null) {
            if (this.entries[i].status.status !== undefined && this.entries[i].status.status !== null) {
              status = this.entries[i].status.status.label;
            }
          }

          const row = {
            meet_entries_id: this.entries[i].id,
            updated_at: updated,
            member_details: member_details,
            club_details: club_details,
            meals: this.entries[i].meals,
            comments: this.entries[i].meals_comments,
            entry_status: status,

          };

          this.orderTable.push(row);
        }

        this.orderTable = [...this.orderTable];
      }
      this.spinner.hide();
    }, (err) => {
      console.error(err);
      this.spinner.hide();
    });
  }

}
