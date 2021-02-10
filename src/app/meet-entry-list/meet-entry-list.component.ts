import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MeetService} from '../meet.service';
import {Meet} from '../models/meet';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-meet-entry-list',
  templateUrl: './meet-entry-list.component.html',
  styleUrls: ['./meet-entry-list.component.css']
})
export class MeetEntryListComponent implements OnInit {

  @ViewChild('entryTable', {static: true}) table: any;

  meets: Meet[];
  meetId: number;
  years: number[] = [];

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
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.meetService.getAllMeets().subscribe((meets: Meet[]) => {
      this.meets = meets;

      for (const meet of this.meets) {
        if (meet.startdate) {
          const year = new Date(meet.startdate).getFullYear();
          if (!this.years.includes(year)) {
            this.years.push(year);
          }
        }
      }
    });



    console.log(this.years);

    this.meetId = parseInt(this.route.snapshot.paramMap.get('meetId'), 10);
    this.createForm();
    this.loadMeet();

    this.route.params.subscribe(
      params => {
        this.meetId = params['meetId'];
        this.loadMeet();
      });

    this.createForm();
  }

  loadMeet() {

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

        let clubCode = '';
        let clubName = '';
        if (entry.club !== undefined && entry.club !== null) {
          clubCode = entry.club.code;
          clubName = entry.club.clubname;
        }

        let memberSurname = '';
        let memberFirstname = '';
        if (entry.member !== undefined && entry.member !== null) {
          memberSurname = entry.member.surname;
          memberFirstname = entry.member.firstname;
        }

        const row = {
          'id': entry.id,
          'code': entry.code,
          'Entrant': memberSurname + ', ' + memberFirstname,
          'Club': clubCode,
          'clubname': clubName,
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
      this.spinner.hide();

    });

  }

  createForm() {
    const dt = new Date();
    this.meetSelectorForm = this.fb.group({
      meetYear: [dt.getFullYear(), Validators.required],
      meet: [this.meetId, Validators.required]
    });

    this.meetSelectorFormSub = this.meetSelectorForm.valueChanges.subscribe((change) => {
      this.spinner.show();
      if (change.meet !== this.meetId) {
        this.router.navigate(['/', 'meet-entries', change.meet]);
        console.log('Selected meet ' + this.meetId);
      }

    });
  }

  view(id) {
    this.router.navigate(['/', 'meet-entry', id]);
  }

}
