import {ApplicationRef, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Meet} from '../models/meet';
import {EntryEvent} from '../models/entryevent';
import {ActivatedRoute} from '@angular/router';
import {EntryService} from '../entry.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MeetService} from '../meet.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-meet-entry-action',
  templateUrl: './meet-entry-action.component.html',
  styleUrls: ['./meet-entry-action.component.css'],
})
export class MeetEntryActionComponent implements OnInit {

  @ViewChild('deleteConfirm', {static: true}) deleteConfirm: ElementRef;
  @ViewChild('applyPayment', {static: true}) applyPayment: ElementRef;
  @ViewChild('transferPayment', {static: true}) transferPayment: ElementRef;

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

  meetActionForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private entryService: EntryService,
              private meetService: MeetService,
              private fb: FormBuilder,
              private cdref: ChangeDetectorRef,
              private appref: ApplicationRef,
              private modal: NgbModal) { }

  ngOnInit() {
    console.log('meet entry action ');
    this.meetEntryId = this.route.snapshot.paramMap.get('entryId');
    this.entryService.getMeetEntryFO(this.meetEntryId).subscribe((entry: any) => {
      console.log('got entry');
      this.loadEntry(entry);
    });

    this.meetActionForm = this.fb.group({
      clubSelector: '',
    });
  }

  loadEntry(entry) {
    console.log('load entry');
    this.incompleteEntry = entry;
    this.meet_id = entry.meet_id;
    this.meet = this.meetService.getMeet(this.meet_id);
    this.meetName = this.meet.meetname;
    this.meetFee = this.meet.meetfee;
    console.log(entry);
    this.statusLabel = entry.status_label;
    this.statusText = entry.status_description;
    this.eventEntries = entry.entrydata.entryEvents;
    this.paidAmount = entry.paidAmount;
    this.entry = entry.entrydata;

    for (const payment of this.entry.payments) {
      this.totalPayments += payment.amount;
    }

    this.owedAmount = this.entry.cost - this.totalPayments;

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

}
