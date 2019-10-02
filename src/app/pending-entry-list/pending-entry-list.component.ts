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
  meetId: number;

  meetList = [];

  entries;
  tableRows = [];
  columns = [
    { name: 'Entrant' },
    { name: 'Club' },
    { name: 'Cost' },
    { name: 'Paid' },
    { name: 'Status' },
    { name: 'Pending Reason'}

  ];

  showFinalised = false;
  showPending = true;
  showIncomplete = false;

  meetSelectorForm: FormGroup;
  meetSelectorFormSub;

  constructor(private fb: FormBuilder,
              private meetService: MeetService,
              private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.meets = this.meetService.getMeets();

    for (const meet in this.meets) {

    }

    this.meetId = parseInt(this.route.snapshot.paramMap.get('meetId'), 10);
    this.createForm();
    this.loadMeet();

    this.route.params.subscribe(
      params => {
        this.meetId = params['meetId'];
        this.loadMeet();
      });
  }

  createForm() {
    this.meetSelectorForm = this.fb.group({
      meetYear: [2019, Validators.required],
      meet: [this.meetId, Validators.required],
      showPending: true,
      showFinalised: false,
      showIncomplete: false
    });

    this.meetSelectorFormSub = this.meetSelectorForm.valueChanges.subscribe((change) => {
      this.spinner.show();
      if (change.meet !== this.meetId) {
        this.router.navigate(['/', 'pending-entries', change.meet]);
        console.log('Selected meet ' + this.meetId);
      }

      console.log(change);

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

      this.loadMeet();

    });

  }

  loadMeet() {
    this.http.get(environment.api + 'pending_entries/' + this.meetId).subscribe((entries: any) => {
      this.entries = entries.pending_entries;

      this.tableRows = [];

      for (const entry of this.entries) {
        console.log(entry);
        const row = {
          'id': entry.id,
          'code': entry.code,
          'Entrant': entry.entrydata.entrantDetails.entrantSurname + ', ' + entry.entrydata.entrantDetails.entrantFirstName,
          'Club':  entry.entrydata.membershipDetails.club_code,
          'clubname': entry.entrydata.membershipDetails.club_name,
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

        this.tableRows.push(row);
      }

      this.tableRows = [...this.tableRows];
      this.table.recalculate();

      this.spinner.hide();

      // console.log(this.tableRows);

    });
  }

  actionEntry(pendingId) {
    this.router.navigate(['/', 'pending-entry', pendingId]);
  }

}
