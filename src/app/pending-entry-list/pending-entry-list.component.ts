import {Component, OnInit, ViewChild} from '@angular/core';
import {Meet} from '../models/meet';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MeetService} from '../meet.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';

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

  meetSelectorForm: FormGroup;
  meetSelectorFormSub;

  constructor(private fb: FormBuilder,
              private meetService: MeetService,
              private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute) { }

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
      meet: [this.meetId, Validators.required]
    });

    this.meetSelectorFormSub = this.meetSelectorForm.valueChanges.subscribe((change) => {
      this.router.navigate(['/', 'pending-entries', change.meet]);
      console.log('Selected meet ' + this.meetId);
      // this.loadMeet();
    });
  }

  loadMeet() {
    this.http.get(environment.api + 'pending_entries/' + this.meetId).subscribe((entries: any) => {
      this.entries = entries.pending_entries;

      this.tableRows = [];

      for (const entry of this.entries) {
        // console.log(entry);
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
        this.tableRows.push(row);
      }

      this.tableRows = [...this.tableRows];
      this.table.recalculate();

      // console.log(this.tableRows);

    });
  }

  actionEntry(pendingId) {
    this.router.navigate(['/', 'pending-entry', pendingId]);
  }

}
