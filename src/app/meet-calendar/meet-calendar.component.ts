import {Component, Input, OnInit} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-meet-calendar',
  templateUrl: './meet-calendar.component.html',
  styleUrls: ['./meet-calendar.component.css']
})
export class MeetCalendarComponent implements OnInit {

  @Input('refresh') refresh: Subject<any>;

  constructor() { }

  ngOnInit() {
    if (this.refresh) {
      this.refresh.subscribe((refresh) => {
        console.log('Got refresh request')
      });
    }
  }

}
