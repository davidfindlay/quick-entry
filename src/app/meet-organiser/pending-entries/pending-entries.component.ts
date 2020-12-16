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
  selector: 'app-pending-entries',
  templateUrl: './pending-entries.component.html',
  styleUrls: ['./pending-entries.component.css']
})
export class PendingEntriesComponent implements OnInit {

  @ViewChild('table', { static: false }) table: DatatableComponent;

  tableControl: FormGroup;

  meetId;
  meet;
  meetName;
  entries;
  entryTable = [];
  entryTableUnfiltered = [];
  entryColumns = [];
  // entryColumns = [
  //   { name: 'Entry ID', prop: 'meet_entries_id', summaryFunc: () => null, headerClass: 'text-center', cellClass: 'text-center', flexGrow: 1.5},
  //   { name: 'Date/Time', prop: 'updated_at', flexGrow: 4 },
  //   { name: 'Entrant', prop: 'member_details', flexGrow: 4 },
  //   { name: 'Club', prop: 'club_details', headerClass: 'text-center', cellClass: 'text-center', flexGrow: 1 },
  //   { name: 'Events', prop: 'events', headerClass: 'text-center', cellClass: 'text-center', flexGrow: 1},
  //   { name: 'Classification', prop: 'classification', headerClass: 'text-center', cellClass: 'text-center', flexGrow: 1},
  //   { name: 'Entry Status', prop: 'entry_status', headerClass: 'text-center', cellClass: 'text-center', flexGrow: 2},
  //   { name: 'Total Ex GST', prop: 'ex_gst', headerClass: 'text-center', cellClass: 'text-right', flexGrow: 2},
  //   { name: 'Total Inc GST', prop: 'inc_gst', headerClass: 'text-center', cellClass: 'text-right', flexGrow: 2},
  //   { name: 'Paid', prop: 'paid', headerClass: 'text-center', cellClass: 'text-right', flexGrow: 2}
  // ];

  limit = 10;
  totalPendingEntries;
  totalMealsComments;
  totalProcessedEntries;

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

    this.http.get(environment.api + 'pending_entries/' + this.meetId).subscribe((entries: any) => {
      this.entryTable = [];
      // this.totalProcessedEntries = 0;
      if (entries.success !== undefined && entries.success !== null && entries.success !== false) {




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
