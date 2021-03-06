import {HttpClient} from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {environment} from '../../environments/environment';
import {MeetService} from '../meet.service';
import {Meet} from '../models/meet';

@Component({
  selector: 'app-meet-entry-list',
  templateUrl: './meet-entry-list.component.html',
  styleUrls: ['./meet-entry-list.component.css'],
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
    { name: 'Status' },

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
    this.meetId = parseInt(this.route.snapshot.paramMap.get('meetId'), 10);
    this.loadMeet();

    this.route.params.subscribe(
      params => {
        console.log('load new meet');
        this.meetId = params['meetId'];
        this.loadMeet();
      });
  }

  loadMeet() {
    console.log('load Meet: ' + this.meetId);
    this.spinner.show();
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
          id: entry.id,
          code: entry.code,
          Entrant: entry.member.surname + ', ' + entry.member.firstname,
          Club: entry.club.code,
          clubname: entry.club.clubname,
          Cost: entry.cost,
          Paid: paid,
          Updated: entry.updated_at,
          Status: status_label,
        };
        this.tableRows.push(row);
      }

      this.tableRows = [...this.tableRows];
      this.table.recalculate();

      console.log(this.tableRows);

      this.spinner.hide();

    });
  }

  view(id) {
    this.router.navigate(['/', 'meet-entry', id]);
  }

}
