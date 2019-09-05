import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import * as moment from 'moment';
import {EntryService} from '../entry.service';
import {Router} from '@angular/router';
import {IncompleteEntry} from '../models/incomplete_entry';
import {MeetEntryStatusService} from '../meet-entry-status.service';
import {MeetEntry} from '../models/meet-entry';
import {UserService} from '../user.service';
import {AuthenticationService} from '../authentication';

@Component({
  selector: 'app-meet-list-item',
  templateUrl: './meet-list-item.component.html',
  styleUrls: ['./meet-list-item.component.css']
})

export class MeetListItemComponent implements OnInit {

  @Input() meet;
  @Input() index: number;

  incompleteSubscription;
  incompleteEntries: IncompleteEntry[] = [];

  submittedSubscription;
  submittedEntries: MeetEntry[] = [];

  userDetails;

  constructor(private entryService: EntryService,
              private router: Router,
              private statuses: MeetEntryStatusService,
              private userService: UserService,
              private authService: AuthenticationService) {
  }

  ngOnInit() {

    // console.log(this.meet);
    if (this.userService.isLoggedIn()) {
      console.log('user is logged in');
      this.incompleteSubscription = this.entryService.incompleteChanged.subscribe((incomplete: IncompleteEntry[]) => {
        if (incomplete !== undefined && incomplete !== null) {
          this.incompleteEntries = incomplete.filter(x => x.meet_id === this.meet.id);

          for (const entry of this.incompleteEntries) {
            const currentEntry: any = entry;
            console.log(currentEntry.entrydata);
            const entryData = JSON.parse(currentEntry.entrydata);
            entry.entrydata = entryData;
          }
        }
      });

      this.submittedSubscription = this.entryService.submittedChanged.subscribe((submitted: MeetEntry[]) => {
        // console.log(submitted);
        if (submitted !== undefined && submitted !== null) {
          this.submittedEntries = submitted.filter(x => x.meet_id === this.meet.id);
          console.log(this.submittedEntries);
        }
      });

      this.userDetails = this.userService.getUsers();
      console.log(this.userDetails);
    }
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

    return (formattedDate);

  }

  // Returns pretty formatted deadline of meet
  getMeetDeadline(): string {

    const formattedDeadline = moment(this.meet.deadline).format('dddd') + ' ' + moment(this.meet.deadline).format('LL');

    return (formattedDeadline);

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

  getStatusText(statusCode) {
    return this.statuses.getStatus(statusCode);
  }

  getEventProgramNo(eventId: number) {
    if (this.meet.events !== undefined && this.meet.events !== null) {
      const event = this.meet.events.filter(x => x.id === eventId);
      if (event.length === 1) {
        let progNo = event[0].prognumber;
        if (event[0].progsuffix !== null) {
          progNo += event[0].progsuffix;
        }
        return progNo;
      } else {
        console.log('Event ' + eventId + ' not found.');
      }
    } else {
      console.log('Unable to get events for meet ' + this.meet.meetname);
    }
  }

  getEventDetails(eventId: number) {
    if (this.meet.events !== undefined && this.meet.events !== null) {
      const event = this.meet.events.filter(x => x.id === eventId);
      if (event.length === 1) {
        let eventDetails = event[0].event_distance.distance + ' ' + event[0].event_discipline.discipline;
        if (event[0].eventname !== null && event[0].eventname !== '') {
          eventDetails = event[0].eventname + ': ' + eventDetails;
        }
        return eventDetails;
      } else {
        console.log('Event ' + eventId + ' not found.');
      }
    } else {
      console.log('Unable to get events for meet ' + this.meet.meetname);
    }
  }

}
