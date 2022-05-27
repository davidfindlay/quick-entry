import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetService} from '../../meet.service';
import {HttpClient} from '@angular/common/http';
import {Meet} from '../../models/meet';
import {environment} from '../../../environments/environment';
import {FirstDataRenderedEvent} from 'ag-grid-community';
import {EmergencyContactsService} from '../services/emergency-contacts.service';

@Component({
  selector: 'app-emergency-contacts',
  templateUrl: './emergency-contacts.component.html',
  styleUrls: ['./emergency-contacts.component.css']
})
export class EmergencyContactsComponent implements OnInit {

  tableApi;
  columnApi;

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

  emergencyContactFields = [
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
    { headerName: 'Emergency Contact Name', field: 'contact_name', resizable: true, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Emergency Contact Phone', field: 'contact_phone', resizable: true, sortable: true,
      filter: true, floatingFilter: true },
  ];

  emergencyContactRows = [];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private meetService: MeetService,
              private emergencyContactService: EmergencyContactsService,
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

    this.emergencyContactService.getEmergencyContactsFromMeetEntries(this.meetId).subscribe((emergencyContacts: any) => {
      // console.log(emergencyContacts);
      this.emergencyContactRows = emergencyContacts;
    });
  }

  onGridReady($event) {
    this.tableApi = $event.api;
    this.columnApi = $event.columnApi;
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  exportExportEmergencyContacts() {
    this.tableApi.exportDataAsCsv();
  }

}
