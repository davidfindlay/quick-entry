import {Component, OnInit, ViewChild} from '@angular/core';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetService} from '../../meet.service';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {Meet} from '../../models/meet';
import {environment} from '../../../environments/environment';
import {FirstDataRenderedEvent} from 'ag-grid-community';
import {EntryListService} from '../services/entry-list.service';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  active = 1;

  tableApi;
  columnApi;

  meetId;
  meet;
  meetName;

  entryFields = [
    { headerName: 'Entry ID', field: 'meet_entries_id', resizable: true, width: 100, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Entrant', field: 'member_name', resizable: true, width: 150, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'MSA Number', field: 'member_number', resizable: true, width: 120, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Club Code', field: 'club_code', resizable: true, width: 100, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Club Name', field: 'club_name', resizable: true, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Classification', field: 'classification', resizable: true, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Status', field: 'entry_status', resizable: true, sortable: true,
      filter: true, floatingFilter: true },
    // { headerName: 'Total Ex GST', field: 'ex_gst', resizable: true, sortable: true,
    //   filter: true, floatingFilter: true },
    { headerName: 'Total Inc GST', field: 'inc_gst', resizable: true, sortable: true,
      filter: true, floatingFilter: true, type: 'numericColumn' },
    { headerName: 'Paid', field: 'paid', resizable: true, sortable: true,
      filter: true, floatingFilter: true, type: 'numericColumn' }
  ];

  pendingFields = [
    { headerName: 'Entry ID', field: 'pending_id', resizable: true, width: 100, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Entrant', field: 'entrant_name', resizable: true, width: 150, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Club Code', field: 'club_code', resizable: true, width: 100, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Club Name', field: 'club_name', resizable: true, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Status', field: 'entry_status', resizable: true, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Reason', field: 'pending_reason', resizable: true, sortable: true,
      filter: true, floatingFilter: true },
    //
    // TODO:  Add pending entry cost and payments
    //
    // { headerName: 'Total Ex GST', field: 'ex_gst', resizable: true, sortable: true,
    //   filter: true, floatingFilter: true },
    // { headerName: 'Total Inc GST', field: 'inc_gst', resizable: true, sortable: true,
    //   filter: true, floatingFilter: true, type: 'numericColumn' },
    // { headerName: 'Paid', field: 'paid', resizable: true, sortable: true,
    //   filter: true, floatingFilter: true, type: 'numericColumn' }
  ];

  entryRows = [];
  pendingRows = [];

  limit = 10;
  totalProcessedEntries;
  totalMealsComments;
  totalPendingEntries;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private meetService: MeetService,
              private entryListService: EntryListService,
              private http: HttpClient,
              private spinner: NgxSpinnerService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.spinner.show();

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

    this.entryListService.getMeetEntriesList(this.meetId).subscribe((res: any) => {
      this.entryRows = res;
      this.spinner.hide();
    }, (err) => {
      console.error(err);
      this.spinner.hide();
    });

    this.entryListService.getPendingEntries(this.meetId).subscribe((res: any) => {
      this.pendingRows = res;
      this.spinner.hide();
    }, (err) => {
      console.error(err);
      this.spinner.hide();
    });

  }

  onGridReady($event) {
    this.tableApi = $event.api;
    this.columnApi = $event.columnApi;
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  exportEntries() {
    this.tableApi.exportDataAsCsv();
  }

}
