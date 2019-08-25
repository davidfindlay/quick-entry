import {Component, OnInit, Input} from '@angular/core';
import * as moment from 'moment';
import {EntryService} from '../entry.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-meet-list-item',
    templateUrl: './meet-list-item.component.html',
    styleUrls: ['./meet-list-item.component.css']
})

export class MeetListItemComponent implements OnInit {

    @Input() meet;
    @Input() index: number;

    constructor(private entryService: EntryService,
                private router: Router) {
    }

    ngOnInit() {

        // console.log(this.meet);

    }

    // Returns pretty formatted date of meet
    getMeetDates(): string {

        let formattedDate = '';
        const startdate = '';
        const enddate = '';

        if (startdate === enddate) {
            formattedDate = moment(this.meet.startdate).format('dddd') + ' ' + moment(this.meet.startdate).format('LL');
        } else {
            formattedDate = moment(this.meet.startdate).format('dddd') + ' '
                + moment(this.meet.startdate).format('LL') + ' to '
                + moment(this.meet.enddate).format('dddd') + ' '
                + moment(this.meet.enddate).format('LL');
        }

        return(formattedDate);

    }

    // Returns pretty formatted deadline of meet
    getMeetDeadline(): string {

        const formattedDeadline = moment(this.meet.deadline).format('dddd') + ' ' + moment(this.meet.deadline).format('LL');

        return(formattedDeadline);

    }

    // Determines whether meet is open or not
    isOpen(): boolean {

        const closedstart = moment(this.meet.deadline, 'YYYY-MM-DD', true).add(1, 'days');

        if (moment() >= closedstart) {
            return false;
        } else {
            if (this.meet.status === 1 || this.meet.status === 2) {
                return true;
            }
        }
    }

    hasEntry() {
      const meetId = this.meet.id;
      const entry = this.entryService.getEntry(meetId);

      if (entry !== undefined && entry !== null) {
        return true;
      } else {
        return false;
      }
    }

  /**
   * Determine how far along existing entry is before opening it
   */
  openExistingEntry() {
    const meetId = this.meet.id;
    const entry = this.entryService.getEntry(meetId);

    if (entry !== undefined && entry !== null) {
      if (entry.entrantDetails === undefined) {
        this.router.navigate(['enter', meetId, 'step1']);
      } else if (entry.membershipDetails === undefined) {
        this.router.navigate(['enter', meetId, 'step2']);
      } else if (entry.medicalDetails === undefined) {
        this.router.navigate(['enter', meetId, 'step3']);
      } else {
        this.router.navigate(['enter', meetId, 'step4']);
      }
    } else {
      this.router.navigate(['enter', meetId, 'step1']);
    }
  }

}
