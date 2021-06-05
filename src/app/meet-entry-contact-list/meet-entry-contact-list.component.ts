import {Component, OnInit, ViewChild} from '@angular/core';
import {Meet} from '../models/meet';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MeetService} from '../meet.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-meet-entry-contact-list',
  templateUrl: './meet-entry-contact-list.component.html',
  styleUrls: ['./meet-entry-contact-list.component.css']
})
export class MeetEntryContactListComponent implements OnInit {

  @ViewChild('entryTable', {static: true}) table: any;

  meets: Meet[];
  meetId: number;

  entries;
  tableRows = [];
  columns = [
    { name: 'Entrant' },
    { name: 'Club' },
    { name: 'Status' },
    { name: 'Phone'},
    { name: 'Email'}
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
      meetYear: [2020, Validators.required],
      meet: [0, Validators.required]
    });

    this.meetSelectorFormSub = this.meetSelectorForm.valueChanges.subscribe((change) => {
      this.meetId = change.meet;
      console.log('Selected meet ' + this.meetId);

      this.http.get(environment.api + 'meet_entries/' + this.meetId).subscribe((entries: any) => {
        let phone = '';
        let email = '';
        this.entries = entries.meet_entries;

        this.tableRows = [];
        console.log(this.entries);

        for (const entry of this.entries) {

          const member = entry.member;
          if (member !== undefined && member !== null) {
            const phones = member.phones;
            if (phones !== undefined && phones !== null) {
              phones.sort((a, b) => (a.id < b.id) ? 1 : -1)
              if (phones.length > 0) {
                if (phones[0].phonenumber !== undefined && phones[0].phonenumber !== null) {
                  phone = phones[0].phonenumber;
                } else {
                  phone = 'n/a';
                }
              } else {
                phone = 'n/a';
              }
            }

            const emails = member.emails;
            if (emails !== undefined && emails !== null) {
              emails.sort((a, b) => (a.id < b.id) ? 1 : -1)
              if (emails.length > 0) {
                if (emails[0].address !== undefined && emails[0].address !== null) {
                  email = emails[0].address;
                } else {
                  email = 'n/a';
                }
              } else {
                email = 'n/a';
              }
            }
          }

          let status_label = '';
          if (entry.status !== undefined && entry.status !== null) {
            if (entry.status.status !== undefined && entry.status.status !== null) {
              status_label = entry.status.status.label;
            }
          }

          const row = {
            'id': entry.id,
            'code': entry.code,
            'Entrant': entry.member.surname + ', ' + entry.member.firstname,
            'Club': entry.club.code,
            'clubname': entry.club.clubname,
            'Status': status_label,
            'Email': email,
            'Phone': phone
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
