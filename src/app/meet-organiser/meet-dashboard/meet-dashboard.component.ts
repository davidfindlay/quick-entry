import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetService} from '../../meet.service';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {Meet} from '../../models/meet';

@Component({
  selector: 'app-meet-dashboard',
  templateUrl: './meet-dashboard.component.html',
  styleUrls: ['./meet-dashboard.component.css']
})
export class MeetDashboardComponent implements OnInit {

  meetId;
  meet;
  meetName;
  entries;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private meetService: MeetService,
              private http: HttpClient,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.meetId = parseInt(this.activatedRoute.snapshot.params['meetId'], 10);
    console.log('Meet Merchandise meetId = ' + this.meetId);
    this.meetService.getMeetDetails(this.meetId).subscribe((meet: Meet) => {
      if (meet !== undefined && meet !== null) {
        this.meet = meet;
        this.meetName = meet.meetname;
        this.spinner.hide();
      } else {
        console.error('Unable to load meet details for meetId: ' + this.meetId);
        this.spinner.hide();
      }
    });
  }

}
