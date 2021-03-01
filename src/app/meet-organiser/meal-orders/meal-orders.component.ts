import {Component, OnInit, ViewChild} from '@angular/core';
import {Meet} from '../../models/meet';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetService} from '../../meet.service';
import {EntryService} from '../../entry.service';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-meal-orders',
  templateUrl: './meal-orders.component.html',
  styleUrls: ['./meal-orders.component.css']
})
export class MealOrdersComponent implements OnInit {

  @ViewChild('table', { static: false }) table: DatatableComponent;

  tableControl: FormGroup;

  meetId;
  meet;
  meetName;
  entries;
  orderTable = [];
  orderTableUnfiltered = [];
  orderColumns = [
    { name: 'Entry ID', prop: 'meet_entries_id', summaryFunc: () => null, headerClass: 'text-center', cellClass: 'text-center', flexGrow: 1.5},
    { name: 'Date/Time', prop: 'updated_at', flexGrow: 4 },
    { name: 'Entrant', prop: 'member_details', flexGrow: 4 },
    { name: 'Club', prop: 'club_details', headerClass: 'text-center', cellClass: 'text-center', flexGrow: 1 },
    { name: 'Meals', prop: 'meals', headerClass: 'text-center', cellClass: 'text-center', flexGrow: 1},
    { name: 'Comments', prop: 'comments', flexGrow: 4},
    { name: 'Entry Status', prop: 'entry_status', headerClass: 'text-center', cellClass: 'text-center', flexGrow: 2},
    { name: 'Total Ex GST', prop: 'ex_gst', headerClass: 'text-center', cellClass: 'text-right', flexGrow: 2},
    { name: 'Total Inc GST', prop: 'inc_gst', headerClass: 'text-center', cellClass: 'text-right', flexGrow: 2}
  ];

  limit = 10;
  totalMealsOrdered;
  totalMealsComments;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private meetService: MeetService,
              private http: HttpClient,
              private spinner: NgxSpinnerService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.spinner.show();

    this.tableControl = this.fb.group({
      filter: '',
      limit: '10'
    });

    this.tableControl.valueChanges.subscribe(val => {
      if (val.limit === 'all') {
        this.limit = undefined;
      } else {
        this.limit = val.limit;
      }
      console.log('Limited updated to: ' + this.limit);
    });

    this.activatedRoute.params.subscribe((params) => {
      if (params['meetId'] !== undefined && params['meetId'] !== null && params['meetId'] !== this.meetId) {
        this.meetId = parseInt(params['meetId'], 10);
        this.loadMeet();
        this.spinner.show();
      }
    });

    this.meetId = parseInt(this.activatedRoute.snapshot.params['meetId'], 10);
    console.log('Meals meetId = ' + this.meetId);
    this.loadMeet();
  }

  loadMeet() {
    this.entries = [];
    this.orderTable = [];
    this.meetService.getAllMeets().subscribe((meets: Meet[]) => {
      const meet = meets.filter(x => x.id === this.meetId)[0];
      if (meet !== undefined && meet !== null) {
        this.meet = meet;
        this.meetName = meet.meetname;
      } else {
        console.error('Unable to load meet details for meetId: ' + this.meetId);
      }
    }, (err) => {
      console.log(err);
    });

    this.http.get(environment.api + 'meet_entries/' + this.meetId).subscribe((entries: any) => {
      this.orderTable = [];
      if (entries.success !== undefined && entries.success !== null && entries.success !== false) {
        this.entries = entries.meet_entries;

        this.totalMealsOrdered = 0;
        this.totalMealsComments = 0;

        for (let i = 0; i < this.entries.length; i++) {

          if (this.entries[i].meals === 0) {
            continue;
          }

          let updated = '';

          if (this.entries[i].updated_at !== undefined && this.entries[i].updated_at !== null) {
            updated = this.entries[i].updated_at;
          }

          const member_details = this.entries[i].member.surname + ', ' + this.entries[i].member.firstname + ' (' + this.entries[i].member.number + ')';

          let club_details = 'n/a';

          if (this.entries[i].club !== undefined && this.entries[i].club !== null) {
            club_details = '<abbr title="' + this.entries[i].club.clubname + '">' + this.entries[i].club.code + '</abbr>';
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

          this.totalMealsOrdered += parseInt(this.entries[i].meals, 10);

          if (this.entries[i].meals_comments !== undefined && this.entries[i].meals_comments !== null && this.entries[i].meals_comments !== '') {
            this.totalMealsComments++;
          }

          this.orderTable.push(row);
        }

        this.orderTableUnfiltered = [...this.orderTable];
        this.orderTable = this.orderTableUnfiltered;
        this.table.recalculate();
      }
      this.spinner.hide();
    }, (err) => {
      console.error(err);
      this.spinner.hide();
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.orderTableUnfiltered.filter(function(d) {
      return d.member_details.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.orderTable = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

}
