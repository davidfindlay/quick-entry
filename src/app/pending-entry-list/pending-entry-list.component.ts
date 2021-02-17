import {Component, OnInit, ViewChild} from '@angular/core';
import {Meet} from '../models/meet';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MeetService} from '../meet.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-pending-entry-list',
  templateUrl: './pending-entry-list.component.html',
  styleUrls: ['./pending-entry-list.component.css']
})
export class PendingEntryListComponent implements OnInit {

  @ViewChild('entryTable', {static: true}) table: any;

  meets: Meet[];
  filteredMeets: Meet[];
  meetId: number;
  years: number[] = [];
  yearSelected: number;

  meetList = [];

  entries;
  tableRows = [];
  columns = [
    {name: 'Entrant'},
    {name: 'Club'},
    {name: 'Cost'},
    {name: 'Paid'},
    {name: 'Status'},
    {name: 'Pending Reason'}

  ];

  showFinalised = false;
  showPending = true;
  showIncomplete = false;
  showCancelled =  false;

  listControl: FormGroup;
  meetSelectorFormSub;

  meetSelectorForm: FormGroup;

  constructor(private fb: FormBuilder,
              private meetService: MeetService,
              private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.spinner.show();
    this.meetService.getAllMeets().subscribe((meets: Meet[]) => {
      this.meets = meets;

      for (let i = 0, len = this.meets.length; i < len; i++) {
        const meet = this.meets[i];
        const startDate = new Date(meet.startdate);
        // console.log(startDate);

        const year = startDate.getFullYear();
        // console.log('meet=' + meet.id + ' year=' + year);
        if (!this.years.includes(year)) {
          this.years.push(year);
        }

      }

      const dt = new Date();
      if (this.years.includes(dt.getFullYear())) {
        this.meetSelectorForm.patchValue({
          meetYear: dt.getFullYear()
        });
      } else {

      }

    });

    this.meetId = parseInt(this.route.snapshot.paramMap.get('meetId'), 10);
    this.loadMeet();

    this.route.params.subscribe(
      params => {
        this.meetId = params['meetId'];
        this.loadMeet();
      });

    this.createForm();

  }

  createForm() {
    const dt = new Date();
    this.listControl = this.fb.group({
      showPending: true,
      showFinalised: false,
      showIncomplete: false,
      showCancelled: false
    });

    this.meetSelectorFormSub = this.meetSelectorForm.valueChanges.subscribe((change) => {
      this.spinner.show();

      if (change.meetYear !== this.yearSelected) {
        this.yearSelected = parseInt(change.meetYear, 10);
        console.log('Change selected year to ' + change.meetYear)
      }

      console.log('Current meet: ' + this.meetId);
      console.log(change);
      if (change.meet !== this.meetId) {
        this.router.navigate(['/', 'pending-entries', change.meet]);
        console.log('Selected meet ' + this.meetId);
      }

      // console.log(change);

      if (change.showPending) {
        this.showPending = true;
      } else {
        this.showPending = false;
      }

      if (change.showFinalised) {
        this.showFinalised = true;
      } else {
        this.showFinalised = false;
      }

      if (change.showIncomplete) {
        this.showIncomplete = true;
      } else {
        this.showIncomplete = false;
      }

      if (change.showCancelled) {
        this.showCancelled = true;
      } else {
        this.showCancelled = false;
      }

      this.loadMeet();

    });

  }

  loadMeet() {
    this.http.get(environment.api + 'pending_entries/' + 195).subscribe((entries: any) => {
      this.entries = entries.pending_entries;

      this.tableRows = [];

      for (const entry of this.entries) {
        // console.log(entry);
        let club_code = '';
        let club_name = '';

        if (entry.entrydata.entrantDetails === undefined || entry.entrydata.entrantDetails === null) {
          continue;
        }

        if (entry.entrydata.membershipDetails !== undefined && entry.entrydata.membershipDetails !== null) {
          club_code = entry.entrydata.membershipDetails.club_code;
          club_name = entry.entrydata.membershipDetails.club_name;
        }

        const row = {
          'id': entry.id,
          'code': entry.code,
          'Entrant': entry.entrydata.entrantDetails.entrantSurname + ', ' + entry.entrydata.entrantDetails.entrantFirstName,
          'Club': club_code,
          'clubname': club_name,
          'Status': entry.status.label,
          'Reason': entry.pending_reason,
          'Updated': entry.updated_at
        };

        if (!this.showPending) {
          if (entry.status_id === 1 || entry.status_id === 14) {
            continue;
          }
        }

        if (!this.showIncomplete) {
          if (entry.status_id === 12) {
            continue;
          }
        }

        if (!this.showFinalised) {
          if (entry.finalised_at !== null) {
            continue;
          }
        }

        if (!this.showCancelled) {
          if (entry.status_id === 11) {
            continue;
          }
        }

        this.tableRows.push(row);
      }

      this.tableRows = [...this.tableRows];
      this.table.recalculate();

      this.spinner.hide();

      console.log(this.tableRows);

    });
  }

  actionEntry(pendingId) {
    this.router.navigate(['/', 'pending-entry', pendingId]);
  }

}
