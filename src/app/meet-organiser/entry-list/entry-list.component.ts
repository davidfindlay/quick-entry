import {Component, OnInit, ViewChild} from '@angular/core';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetService} from '../../meet.service';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {Meet} from '../../models/meet';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  @ViewChild('table', { static: false }) table: DatatableComponent;

  tableControl: FormGroup;

  meetId;
  meet;
  meetName;
  entries;
  entryTable = [];
  entryTableUnfiltered = [];

  entryColumns = [
    { name: 'Entry ID', prop: 'meet_entries_id', summaryFunc: () => null, headerClass: 'text-center', cellClass: 'text-center', flexGrow: 1.5},
    { name: 'Date/Time', prop: 'updated_at', flexGrow: 4 },
    { name: 'Entrant', prop: 'member_details', flexGrow: 4 },
    { name: 'Club', prop: 'club_details', headerClass: 'text-center', cellClass: 'text-center', flexGrow: 1 },
    { name: 'Events', prop: 'events', headerClass: 'text-center', cellClass: 'text-center', flexGrow: 1},
    { name: 'Classification', prop: 'classification', headerClass: 'text-center', cellClass: 'text-center', flexGrow: 1},
    { name: 'Entry Status', prop: 'entry_status', headerClass: 'text-center', cellClass: 'text-center', flexGrow: 2},
    { name: 'Total Ex GST', prop: 'ex_gst', headerClass: 'text-center', cellClass: 'text-right', flexGrow: 2},
    { name: 'Total Inc GST', prop: 'inc_gst', headerClass: 'text-center', cellClass: 'text-right', flexGrow: 2},
    { name: 'Paid', prop: 'paid', headerClass: 'text-center', cellClass: 'text-right', flexGrow: 2}
  ];

  limit = 10;
  totalProcessedEntries;
  totalMealsComments;
  totalPendingEntries;

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
    console.log('Entry list meetId = ' + this.meetId);
    this.loadMeet();
  }

  loadMeet() {
    this.entries = [];
    this.entryTable = [];
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
      this.entryTable = [];
      this.totalProcessedEntries = 0;
      if (entries.success !== undefined && entries.success !== null && entries.success !== false) {
        this.entries = entries.meet_entries;

        for (let i = 0; i < this.entries.length; i++) {

          let updated = '';

          if (this.entries[i].updated_at !== undefined && this.entries[i].updated_at !== null) {
            updated = this.entries[i].updated_at;
          }

          const member_details = this.entries[i].member.surname + ', ' + this.entries[i].member.firstname + ' (' + this.entries[i].member.number + ')';

          let club_details = 'n/a';
          let club_name = 'n/a';
          let club_code = 'n/a';

          if (this.entries[i].club !== undefined && this.entries[i].club !== null) {
            club_details = '<abbr title="' + this.entries[i].club.clubname + '">' + this.entries[i].club.code + '</abbr>';
            club_name = this.entries[i].club.clubname;
            club_code = this.entries[i].club.code;
          }

          let status = 'n/a';
          if (this.entries[i].status !== undefined && this.entries[i].status !== null) {
            if (this.entries[i].status.status !== undefined && this.entries[i].status.status !== null) {
              status = this.entries[i].status.status.label;
            }
          }

          const ex_gst = this.entries[i].cost - (this.entries[i].cost / 11);

          let paid = 0;
          if (this.entries[i].payments !== undefined && this.entries[i].payments !== null) {
            for (let x = 0; x < this.entries[i].payments.length; x++) {
              if (this.entries[i].payments[x].amount !== undefined && this.entries[i].payments[x].amount !== null) {
                paid += this.entries[i].payments[x].amount;
              }
            }
          }

          let numEvents = 0;
          if (this.entries[i].events !== undefined && this.entries[i].payments !== null) {
            for (let x = 0; x < this.entries[i].events.length; x++) {
              if (this.entries[i].events[x].cancelled !== undefined && this.entries[i].events[x].cancelled !== null && this.entries[i].events[x].cancelled === 0) {
                numEvents++;
              }
            }
          }

          const classifications = [];
          if (this.entries[i].disability_s !== undefined && this.entries[i].disability_s !== null) {
            classifications.push(this.entries[i].disability_s.classification);
          }
          if (this.entries[i].disability_sb !== undefined && this.entries[i].disability_sb !== null) {
            classifications.push(this.entries[i].disability_sb.classification);
          }
          if (this.entries[i].disability_sm !== undefined && this.entries[i].disability_sm !== null) {
            classifications.push(this.entries[i].disability_sm.classification);
          }

          const classifications_text = classifications.join(' - ');

          const row = {
            meet_entries_id: this.entries[i].id,
            updated_at: updated,
            member_details: member_details,
            club_details: club_details,
            club_name: club_name,
            club_code: club_code,
            events: numEvents,
            medical: this.entries[i].medical,
            medical_condition: this.entries[i].medical_condition,
            medical_safety: this.entries[i].medical_safety,
            medical_details: this.entries[i].medical_details,
            notes: this.entries[i].notes,
            classification: classifications_text,
            entry_status: status,
            ex_gst: ex_gst,
            inc_gst: this.entries[i].cost,
            paid: paid
          };

          this.totalProcessedEntries++;

          this.entryTable.push(row);
        }

        this.entryTableUnfiltered = [...this.entryTable];
        this.entryTable = this.entryTableUnfiltered;
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
    const temp = this.entryTableUnfiltered.filter(function(d) {
      return d.member_details.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.entryTable = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

}
