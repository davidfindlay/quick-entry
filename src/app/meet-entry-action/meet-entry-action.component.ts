import {ApplicationRef, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Meet} from '../models/meet';
import {EntryEvent} from '../models/entryevent';
import {ActivatedRoute} from '@angular/router';
import {EntryService} from '../entry.service';
import {FormBuilder, FormGroup} from '@angular/forms';
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
  owedAmount = 0;
  meetEntryId;

  memberSearchResult;
  existingEntries;

  created_at;
  updated_at;

  editing = false;
  unableToLoad = false;

  meetActionForm: FormGroup;

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
    this.entryService.getMeetEntryFO(this.meetEntryId).subscribe((entry: any) => {

      if (entry === undefined || entry === null) {
        this.unableToLoad = true;
        console.error('Unable to load entry: ' + this.meetEntryId);
      } else {

        this.loadEntry(entry);
      }

    });

    this.meetActionForm = this.fb.group({
      clubSelector: ''
    });

    this.resetAlerts();
  }

  loadEntry(entry) {
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

    for (const payment of this.entry.payments) {
      this.totalPayments += payment.amount;
    }

    this.owedAmount = this.meetFee - this.paidAmount;

    this.cdref.detectChanges();
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
      console.log(details);

    }, (error: any) => {
      console.log(error);
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
