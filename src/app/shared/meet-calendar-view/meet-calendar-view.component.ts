import {Component, Input, OnInit} from '@angular/core';
import {MeetService} from '../../meet.service';
import {Meet} from '../../models/meet';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-meet-calendar-view',
  templateUrl: './meet-calendar-view.component.html',
  styleUrls: ['./meet-calendar-view.component.css']
})
export class MeetCalendarViewComponent implements OnInit {

  @Input('header') header = true;
  @Input('admin') admin = false;
  @Input('refresh') refresh: Subject<any>;

  active = 1;

  meets: Meet[] = [];

  meetYears: number[] = [];
  pastYears: number[] = [];
  futureYears: number[] = [];

  constructor(private meetService: MeetService) { }

  ngOnInit() {

    if (this.refresh) {
      console.log('subscribing to refresh monitoring');
      this.refresh.subscribe((refresh) => {
        console.log(refresh);
        console.log('got refresh request');
        this.reload();
      })
    }

    this.reload();
  }

  // convertDates(meets) {
  //   for (const meet of meets) {
  //     meet.startdate = new Date(meet.startdate);
  //     meet.enddate = new Date(meet.enddate);
  //     meet.deadline = new Date(meet.deadline);
  //   }
  // }

  reload() {
    const d = new Date();
    this.meetYears = [];
    this.futureYears = [];
    this.pastYears = [];
    this.meetYears.push(d.getFullYear());

    this.meetService.getAllMeets().subscribe((meets: Meet[]) => {

      console.log(meets);
      // Convert dates to dates
      // this.convertDates(meets);
      this.meets = meets;

      for (const meet of meets) {

        const meetDate = new Date(meet.startdate);

        if (!this.meetYears.includes(meetDate.getFullYear())) {
          this.meetYears.push(meetDate.getFullYear());
        }

      }

      this.sortYears();
    });
  }

  sortYears() {
    this.meetYears.sort((a, b) => {return a - b});
    const d = new Date();
    for (const year of this.meetYears) {
      if (year >= d.getFullYear()) {
        this.futureYears.push(year);
      } else {
        this.pastYears.push(year);
      }
    }

    this.pastYears.sort((a, b) => {return b - a});
  }

  getMeetsByYear(year) {
    const yearMeets = [];
    for (const meet of this.meets) {
      const meetDate = new Date(meet.startdate);
      if (year === meetDate.getFullYear()) {
        yearMeets.push(meet);
      }
    }

    yearMeets.sort((a, b) => (b.meetDate > a.meetDate ? -1 : 1));

    return yearMeets;
  }

}
