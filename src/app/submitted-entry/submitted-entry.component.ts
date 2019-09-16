import {Component, Input, OnInit} from '@angular/core';
import {Meet} from '../models/meet';
import {IncompleteEntry} from '../models/incomplete_entry';
import {MeetEntry} from '../models/meet-entry';
import {MeetEntryStatusService} from '../meet-entry-status.service';
import {EntryService} from '../entry.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-submitted-entry',
  templateUrl: './submitted-entry.component.html',
  styleUrls: ['./submitted-entry.component.css']
})
export class SubmittedEntryComponent implements OnInit {

  @Input() meet: Meet;
  @Input() submittedEntry: MeetEntry;

  eventRows = [];

  constructor(private statuses: MeetEntryStatusService,
              private entryService: EntryService,
              private router: Router) { }

  ngOnInit() {
    for (const eventEntry of this.submittedEntry.events) {
      this.eventRows.push({
        progNumber: this.getEventProgramNo(eventEntry.event_id),
        progSuffix: this.getEventProgramNoSuffix(eventEntry.event_id),
        eventDetails: this.getEventDetails(eventEntry.event_id),
        seedtime: eventEntry.seedtime
      });
    }

    this.eventRows.sort(function (a, b) {
      return a.progNumber - b.progNumber || a.progSuffix - b.progSuffix;
    });

  }

  getEventProgramNo(eventId: number) {
    if (this.meet.events !== undefined && this.meet.events !== null) {
      const event = this.meet.events.filter(x => x.id === eventId);
      if (event.length === 1) {
        const progNo = event[0].prognumber;
        return progNo;
      } else {
        console.log('Event ' + eventId + ' not found.');
      }
    } else {
      console.log('Unable to get events for meet ' + this.meet.meetname);
    }
  }

  getEventProgramNoSuffix(eventId: number) {
    if (this.meet.events !== undefined && this.meet.events !== null) {
      const event = this.meet.events.filter(x => x.id === eventId);
      if (event.length === 1) {
        return event[0].progsuffix;
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

  getStatusText(statusCode) {
    return this.statuses.getStatus(statusCode);
  }

  entriesOpen() {
    const currentTime = new Date();
    const deadline = new Date(this.meet.deadline + ' 23:59:59');
    if (deadline >= currentTime) {
      return true;
    } else {
      return false;
    }
  }

  editSubmittedEntry(submittedEntry) {
    this.entryService.editSubmittedEntry(submittedEntry.id).subscribe((edit: any) => {
      this.router.navigate(['/', 'enter', edit.meet_id , 'step1'])
    });
  }

}
