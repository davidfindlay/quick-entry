import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MeetService} from '../meet.service';
import {Meet} from '../models/meet';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';

@Component({
  selector: 'app-meet-entry-list',
  templateUrl: './meet-entry-list.component.html',
  styleUrls: ['./meet-entry-list.component.css']
})
export class MeetEntryListComponent implements OnInit {

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
    { name: 'Status' }

  ];

  meetSelectorForm: FormGroup;
  meetSelectorFormSub;

  constructor(private fb: FormBuilder,
              private meetService: MeetService,
              private http: HttpClient,
              private router: Router) { }

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

      this.http.get(environment.api + 'meet_entries/' + this.meetId).subscribe((entries: any) => {
        this.entries = entries.meet_entries;

        this.tableRows = [];

        for (const entry of this.entries) {
          let paid = 0;

          for (const payment of entry.payments) {
            paid += payment.amount;
          }

          let status_label = '';
          if (entry.status !== undefined && entry.status !== null) {
            if (entry.status.status !== undefined && entry.status.status !== null) {
              status_label = entry.status.status.label;
            }
          }

          const row = {
            'id': entry.id,
            'Entrant': entry.member.surname + ', ' + entry.member.firstname,
            'Club': entry.club.code,
            'clubname': entry.club.clubname,
            'Cost': entry.cost,
            'Paid': paid,
            'Updated': entry.updated_at,
            'Status': status_label
          };
          this.tableRows.push(row);
        }

        this.tableRows = [...this.tableRows];
        this.table.recalculate();

        console.log(this.tableRows);

      });
    });
  }

  view(id) {
    this.router.navigate(['/', 'meet-entry', id]);
  }

}
