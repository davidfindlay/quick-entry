import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetService} from '../../meet.service';
import {HttpClient} from '@angular/common/http';
import {Meet} from '../../models/meet';
import {environment} from '../../../environments/environment';
import {FirstDataRenderedEvent} from 'ag-grid-community';
import {ContactsService} from '../services/contacts.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  tableApi;
  columnApi;

  meetId;
  meet;
  meetName;
  entries;

  contactFields = [
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
    { headerName: 'Phone', field: 'contact_phone', resizable: true },
    { headerName: 'Email', field: 'contact_email', resizable: true },
  ];

  contactRows = [];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private meetService: MeetService,
              private contactsService: ContactsService,
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

    this.contactsService.getContactsFromMeetEntries(this.meetId).subscribe((res: any) => {
      this.contactRows = res;
    });
  }

  onGridReady($event) {
    this.tableApi = $event.api;
    this.columnApi = $event.columnApi;
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  exportContacts() {
    this.tableApi.exportDataAsCsv();
  }

}
