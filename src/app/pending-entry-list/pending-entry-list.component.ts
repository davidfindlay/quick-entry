import {Component, OnInit, ViewChild} from '@angular/core';
import {Meet} from '../models/meet';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MeetService} from '../meet.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-pending-entry-list',
  templateUrl: './pending-entry-list.component.html',
  styleUrls: ['./pending-entry-list.component.css']
})
export class PendingEntryListComponent implements OnInit {

  @ViewChild('entryTable', {static: true}) table: any;

  meets: Meet[];
  meetId: number;

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
              private http: HttpClient) { }

  ngOnInit() {
    this.meets = this.meetService.getMeets();
    this.createForm();
  }

  createForm() {
    this.meetSelectorForm = this.fb.group({
      meetYear: [2019, Validators.required],
      meet: [0, Validators.required]
    });

    this.meetSelectorFormSub = this.meetSelectorForm.valueChanges.subscribe((change) => {
      this.meetId = change.meet;
      console.log('Selected meet ' + this.meetId);

      this.http.get(environment.api + 'pending_entries/' + this.meetId).subscribe((entries: any) => {
        this.entries = entries.pending_entries;

        this.tableRows = [];

        for (const entry of this.entries) {
          const row = {
            'Entrant': entry.entrydata.entrantDetails.entrantSurname + ', ' + entry.entrydata.entrantDetails.entrantFirstName,
            'Club': entry.entrydata.membershipDetails.club_name + ' (' + entry.entrydata.membershipDetails.club_code + ')',
            'Status': entry.entrydata.status_id,
            'Reason': entry.pending_reason
          };
          this.tableRows.push(row);
        }

        this.tableRows = [...this.tableRows];
        this.table.recalculate();

        console.log(this.tableRows);

      });
    });
  }

}
