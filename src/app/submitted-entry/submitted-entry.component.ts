import {Component, Input, OnInit} from '@angular/core';
import {Meet} from '../models/meet';
import {IncompleteEntry} from '../models/incomplete_entry';
import {MeetEntry} from '../models/meet-entry';
import {MeetEntryStatusService} from '../meet-entry-status.service';
import {EntryService} from '../entry.service';
import {Router} from '@angular/router';
import {MeetService} from '../meet.service';
import {PaypalService} from '../paypal/paypal.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {UserService} from '../user.service';

@Component({
  selector: 'app-submitted-entry',
  templateUrl: './submitted-entry.component.html',
  styleUrls: ['./submitted-entry.component.css']
})
export class SubmittedEntryComponent implements OnInit {

  @Input() meet: Meet;
  @Input() submittedEntry: MeetEntry;

  paymentOwed = false;
  paymentAmountOwed = 0;

  paypalAvailable = false;
  loggedIn = false;
  eventRows = [];

  constructor(private statuses: MeetEntryStatusService,
              private meetService: MeetService,
              private entryService: EntryService,
              private paypalService: PaypalService,
              private router: Router,
              private userService: UserService,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      this.loggedIn = true;
    }

    if (this.submittedEntry.events !== undefined && this.submittedEntry.events !== null) {
      if (this.submittedEntry.events.length > 0) {
        for (const eventEntry of this.submittedEntry.events) {
          this.eventRows.push({
            progNumber: this.getEventProgramNo(eventEntry.event_id),
            progSuffix: this.getEventProgramNoSuffix(eventEntry.event_id),
            eventDetails: this.getEventDetails(eventEntry.event_id),
            seedtime: eventEntry.seedtime
          });
        }
      }
    }

    this.eventRows.sort(function (a, b) {
      return a.progNumber - b.progNumber || a.progSuffix - b.progSuffix;
    });

    // Determine if payment is needed
    let totalPayments = 0;
    if (this.submittedEntry.payments !== undefined && this.submittedEntry.payments !== null) {
      for (const payment of this.submittedEntry.payments) {
        totalPayments += payment.amount;
      }
    }

    if (totalPayments < this.submittedEntry.cost) {
      this.paymentOwed = true;
      this.paymentAmountOwed = this.submittedEntry.cost - totalPayments;
    }

    // Is PayPal option available?
    if (this.meet.payment_types !== undefined && this.meet.payment_types !== null) {
      for (const paymentType of this.meet.payment_types) {
        if (paymentType.payment_type_id === 1) {
          this.paypalAvailable = true;
        }
      }
    }

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
    this.entryService.editSubmittedEntry(submittedEntry.code).subscribe((edit: any) => {
      this.router.navigate(['/', 'enter', edit.meet_id, 'step1'])
    });
  }

  viewSubmittedEntry() {
    this.router.navigate(['/', 'entry-confirmation', this.submittedEntry.id]);
  }

  payNow(submittedEntry) {
    this.spinner.show();
    this.router.navigate(['/', 'paypal-depart']);

    this.paypalService.createPaymentFinalisedEntry(submittedEntry).subscribe((payment: any) => {
      if (payment.success !== false) {
        window.location.assign(payment.approvalUrl);
      } else {
        // This shouldn't be hit
        this.paymentOwed = false;
      }

    }, (error: any) => {
      // Handle paypal error
      console.log('Got error can\'t go to paypal');

      this.spinner.hide();
    });
  }

}
