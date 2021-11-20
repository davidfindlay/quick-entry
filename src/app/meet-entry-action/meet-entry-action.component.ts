import {ApplicationRef, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Meet} from '../models/meet';
import {EntryEvent} from '../models/entryevent';
import {ActivatedRoute} from '@angular/router';
import {EntryService} from '../entry.service';
import {Form, FormBuilder, FormGroup} from '@angular/forms';
import {MeetService} from '../meet.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {Alert} from '../models/alert';

@Component({
  selector: 'app-meet-entry-action',
  templateUrl: './meet-entry-action.component.html',
  styleUrls: ['./meet-entry-action.component.css']
})
export class MeetEntryActionComponent implements OnInit {

  @ViewChild('deleteConfirm', {static: true}) deleteConfirm: ElementRef;
  @ViewChild('applyPayment', {static: true}) applyPayment: ElementRef;
  @ViewChild('transferPayment', {static: true}) transferPayment: ElementRef;
  @ViewChild('emailConfirm', {static: true}) emailConfirm: ElementRef;
  @ViewChild('paymentLinkConfirm', {static: true}) paymentLinkConfirm: ElementRef;

  meet_id;
  meet: Meet;
  meetName;
  meetFee = 0;

  entry;
  incompleteEntry;
  eventEntries: EntryEvent[];

  statusLabel = '';
  statusText = '';

  membershipType = '';
  disabilityClassificationRequired = 'No';
  strokeDispensationRequired = 'No';
  medicalCertificate = 'No';
  medicalCondition = 'No';

  paidAmount = 0;
  totalPayments = 0;
  eventFees = 0;
  totalFees = 0;
  owedAmount = 0;
  meetEntryId;

  memberSearchResult;
  existingEntries;

  created_at;
  updated_at;

  editing = false;
  unableToLoad = false;

  meetActionForm: FormGroup;
  applyPaymentForm: FormGroup;

  alerts: Alert[];

  constructor(private route: ActivatedRoute,
              private entryService: EntryService,
              private meetService: MeetService,
              private fb: FormBuilder,
              private cdref: ChangeDetectorRef,
              private appref: ApplicationRef,
              private modal: NgbModal,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.meetEntryId = this.route.snapshot.paramMap.get('entryId');

    this.loadEntry(this.meetEntryId);

    this.meetActionForm = this.fb.group({
      clubSelector: ''
    });

    this.applyPaymentForm = this.fb.group({
      paymentMethod: 1,
      amount: '',
      reason: '',
      received: new Date()
    });

    this.resetAlerts();
  }

  loadEntry(entryId) {

    this.entryService.getMeetEntryFO(this.meetEntryId).subscribe((entry: any) => {

      if (entry === undefined || entry === null) {
        this.unableToLoad = true;
        console.error('Unable to load entry: ' + this.meetEntryId);
      } else {

        this.entry = entry.entrydata;
        this.incompleteEntry = entry;
        this.meet_id = entry.meet_id;
        this.meet = this.meetService.getMeet(this.meet_id);
        this.meetName = this.meet.meetname;
        this.meetFee = this.meet.meetfee;
        this.statusLabel = entry.status_label;
        this.statusText = entry.status_description;
        this.eventEntries = entry.entrydata.entryEvents;
        this.paidAmount = this.entry.paidAmount;
        this.spinner.hide();
        this.created_at = this.entry.created_at;
        this.updated_at = this.entry.updated_at;

        console.log(this.entry);

        this.totalPayments = 0;

        for (const payment of this.entry.payments) {
          console.log(payment);
          this.totalPayments += payment.amount;
        }

        // Determine event fees
        this.eventFees = this.getEventFees();
        this.totalFees = this.meetFee + this.eventFees;
        this.owedAmount = this.totalFees - this.paidAmount;

        this.cdref.detectChanges();

      }

    });

  }

  getEventFees() {

    // TODO: this is a workaround - need to fix handling of non member entries
    let member = true;
    if (this.entry.membershipDetails.member_number.substr(0, 1) === 'X') {
      member = false;
    }

    let eventFees = 0;

    for (const eventDetails of this.entry.entryEvents) {
      const eventFee = this.getEventFee(eventDetails.event_id, member);
      eventFees += eventFee;
    }

    return eventFees;
  }

  getEventFee(event_id: number, member: boolean) {
    const eventDetails = this.meet.events.find(x => x.id === event_id);

    if (eventDetails) {
      // If it's a relay event, don't return a cost for an individual.
      if (eventDetails.legs > 1) {
        return 0;
      }

      if (member) {
        return eventDetails.eventfee;
      } else {
        if (eventDetails.eventfee_non_member) {
          return eventDetails.eventfee_non_member;
        } else {
          return eventDetails.eventfee;
        }
      }

    }

    return 1;
  }

  getLegs(event_id) {
    const events = this.meet.events.filter(x => x.id === event_id);

    if (events.length > 0) {
      return events[0].legs;
    }

    return 1;
  }

  getEventName(event_id) {
    const events = this.meet.events.filter(x => x.id === event_id);

    if (events.length > 0) {
      if (events[0].eventname === null) {
        return '';
      } else {
        return events[0].eventname;
      }
    }

    return '';
  }

  clickApplyPayment() {
    console.log('Open apply payment');
    this.modal.open(this.applyPayment).result.then((details: any) => {

      if (details === 'apply') {

        const received = this.applyPaymentForm.get('received').value;
        const amount = this.applyPaymentForm.get('amount').value;
        const reason = this.applyPaymentForm.get('reason').value;
        const paymentMethod = this.applyPaymentForm.get('paymentMethod').value;

        const paymentDetails = {
          entry_id: this.meetEntryId,
          member_id: this.entry.member_id,
          received: received,
          method: paymentMethod,
          amount: amount,
          comment: reason
        };

        console.log(paymentDetails);

        this.entryService.applyPayment(this.meetEntryId, paymentDetails).subscribe((response: any) => {
          this.loadEntry(this.meetEntryId);
        });
      }
    }, (error: any) => {
      console.error(error);
    });

    this.appref.tick();
  }

  clickTransferPayment() {
    this.modal.open(this.transferPayment).result.then((approved: any) => {
      console.log(approved);

    }, (error: any) => {
      console.log(error);
    });
    this.appref.tick();
  }

  payEmail() {
    this.modal.open(this.paymentLinkConfirm).result.then((approved: any) => {
      if (approved === 'Yes') {
        this.spinner.show();
        console.log('resendEmail: Yes');
        this.entryService.sendPaymentLink(this.meetEntryId).subscribe((response: any) => {
          if (response.success) {
            this.alerts.push({
              type: 'success',
              message: response.message
            });
          } else {
            this.alerts.push({
              type: 'danger',
              message: response.message
            });
          }
          this.spinner.hide();

        }, (error) => {
          console.error(error);
          this.alerts.push({
            type: 'danger',
            message: 'Unable to send payment link email for unknown reason. Please contact the system administrator. '
          });
          this.spinner.hide();
        });
      }

    }, (error: any) => {
      console.log(error);
    });
    this.appref.tick();
  }

  resendEmail() {
    this.modal.open(this.emailConfirm).result.then((approved: any) => {
      if (approved === 'Yes') {
        this.spinner.show();
        console.log('resendEmail: Yes');
        this.entryService.sendEmailConfirmation(this.meetEntryId).subscribe((response: any) => {
          if (response.success) {
            this.alerts.push({
              type: 'success',
              message: response.message
            });
          } else {
            this.alerts.push({
              type: 'danger',
              message: response.message
            });
          }
          this.spinner.hide();

        }, (error) => {
          console.error(error);
          this.alerts.push({
            type: 'danger',
            message: 'Unable to send confirmation email for unknown reason. Please contact the system administrator. '
          });
          this.spinner.hide();
        });
      }

    }, (error: any) => {
      console.log(error);
    });
    this.appref.tick();
  }

  resetAlerts() {
    this.alerts = [];
  }

  closeAlert(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

}
