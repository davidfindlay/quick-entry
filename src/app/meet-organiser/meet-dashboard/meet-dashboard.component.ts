import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetService} from '../../meet.service';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {Meet} from '../../models/meet';
import {CountdownComponent} from 'ngx-countdown';
import {DashboardService} from '../services/dashboard.service';

@Component({
  selector: 'app-meet-dashboard',
  templateUrl: './meet-dashboard.component.html',
  styleUrls: ['./meet-dashboard.component.css']
})
export class MeetDashboardComponent implements OnInit {

  @ViewChild('deadlineCountdown', { static: false }) private countdown: CountdownComponent;

  meetId;
  meet;
  meetName;
  entries;
  clubEntries;

  deadline;
  totalPendingEntries;
  totalProcessedEntries;

  deadlineCountdownConfig

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private meetService: MeetService,
              private http: HttpClient,
              private spinner: NgxSpinnerService,
              private dashboardService: DashboardService) { }

  ngOnInit() {
    this.spinner.show();
    this.meetId = parseInt(this.activatedRoute.snapshot.params['meetId'], 10);
    console.log('Meet Merchandise meetId = ' + this.meetId);
    this.dashboardService.getDashboardData(this.meetId).subscribe((data: any) => {
      console.log(data);

      this.meet = data.meet;
      this.deadline = this.meet.deadline;
      this.meetName = this.meet.meetname;
      this.clubEntries = data.clubEntries;

      this.totalPendingEntries = data.pendingCount;
      this.totalProcessedEntries = data.entryCount;

      this.spinner.hide();

    });
  }

}
