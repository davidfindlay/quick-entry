import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Meet} from '../models/meet';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PlatformLocation} from '@angular/common';
import {UserService} from '../user.service';
import {MeetService} from '../meet.service';
import {EntryService} from '../entry.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {IPayPalConfig, ICreateOrderRequest, IPayPalButtonStyle} from 'ngx-paypal';

import { environment } from '../../environments/environment';

import {PaymentOption} from '../models/paymentoption';
import {EntryEvent} from '../models/entryevent';
import {EntryFormObject} from '../models/entry-form-object';
import {HttpClient} from '@angular/common/http';
import {NgxSpinner} from 'ngx-spinner/lib/ngx-spinner.enum';
import {NgxSpinnerService} from 'ngx-spinner';
import {MeetEntryStatusService} from '../meet-entry-status.service';
import {WorkflowNavComponent} from '../workflow-nav/workflow-nav.component';
import {PaypalService} from '../paypal/paypal.service';
import {ClubsService} from '../clubs.service';
import {AuthenticationService} from '../authentication';
import {IncompleteEntry} from '../models/incomplete_entry';
import {MeetEntryStatusCode} from '../models/meet-entry-status-code';

@Component({
  selector: 'app-entry-confirmation',
  templateUrl: './entry-confirmation.component.html',
  styleUrls: ['./entry-confirmation.component.css']
})
export class EntryConfirmationComponent implements OnInit {

  @ViewChild(WorkflowNavComponent, {static: false})
  workflowNav: WorkflowNavComponent;

  formValidSubject = new BehaviorSubject<boolean>(false);

  meet_id;
  meet: Meet;
  meetName;

  @Input() entry;
  pending_entry_id;
  meet_entry_id;
  paymentOptionForm;

  eventEntries: EntryEvent[];

  window = window;
  error = '';

  paypalSuccess;
  paypalToken;
  paymentId;
  payerID;

  paidAmount = 0;
  paypalData = null;

  statusCode = 0;
  statusLabel = 'Not Submitted';
  statusText = 'This entry has not yet been submitted. Click Next to submit this entry.';

  membershipType = '';
  disabilityClassificationRequired = 'No';
  strokeDispensationRequired = 'No';
  medicalCertificate = 'No';
  medicalCondition = 'No';

  showPaymentChoice = true;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private location: PlatformLocation,
              private userService: UserService,
              private authService: AuthenticationService,
              private meetService: MeetService,
              private entryService: EntryService,
              private http: HttpClient,
              private ngxSpinner: NgxSpinnerService,
              private statuses: MeetEntryStatusService,
              private paypalService: PaypalService,
              private clubService: ClubsService) { }

  ngOnInit() {
    this.ngxSpinner.show();
    this.meet_id = +this.route.snapshot.paramMap.get('meet');
    this.pending_entry_id = +this.route.snapshot.paramMap.get('pendingId');
    this.meet_entry_id = +this.route.snapshot.paramMap.get('entryId');

    console.log(this.meet_id);
    console.log(this.pending_entry_id);
    console.log(this.meet_entry_id);

    this.paymentOptionForm = this.fb.group({
      paymentOption: ['paypal', Validators.required]
    });

    if (this.meet_id !== undefined && this.meet_id !== null && this.meet_id !== 0) {
      this.meet = this.meetService.getMeet(this.meet_id);
      this.meetName = this.meet.meetname;
      this.entry = this.entryService.getIncompleteEntryFO(this.meet_id);
      this.paidAmount = parseFloat(this.entry.edit_paid);
      console.log(this.entry);
      this.loadEntry();
    } else if (this.pending_entry_id !== undefined && this.pending_entry_id !== null && this.pending_entry_id !== 0) {
      this.entryService.getPendingEntry(this.pending_entry_id).subscribe((entry: IncompleteEntry) => {
        console.log(entry);
        this.meet = this.meetService.getMeet(entry.meet_id);
        this.meetName = this.meet.meetname;
        this.entry = entry.entrydata;
        this.statusLabel = entry.status_label;
        this.statusText = entry.status_description;
        if (this.entry.paymentDetails !== undefined && this.entry.paymentDetails !== null) {
          this.paidAmount = parseFloat(this.entry.paymentDetails.amount);
        } else {
          this.paidAmount = parseFloat(this.entry.edit_paid);
        }
        console.log('meet fee: ' + this.meet.meetfee + ' paid: ' + this.paidAmount);
        if (this.paidAmount === this.meet.meetfee) {
          this.showPaymentChoice = false;
          this.workflowNav.enableFinishButton();
        } else {
          this.workflowNav.disableBack();
          this.workflowNav.disableCancel();
        }
        this.loadEntry();
      });
    } else if (this.meet_entry_id !== undefined && this.meet_entry_id !== null && this.meet_entry_id !== 0) {
      this.entryService.getMeetEntryFO(this.meet_entry_id).subscribe((entry: IncompleteEntry) => {
        console.log(entry);
        this.meet = this.meetService.getMeet(entry.meet_id);
        this.meetName = this.meet.meetname;
        this.entry = entry.entrydata;
        this.statusLabel = entry.status_label;
        this.statusText = entry.status_description;
        this.paidAmount = entry.paid_amount;
        console.log('meet fee: ' + this.meet.meetfee + ' paid: ' + this.paidAmount);
        if (this.paidAmount === this.meet.meetfee) {
          this.showPaymentChoice = false;
          this.workflowNav.enableFinishButton();
        } else {
          this.workflowNav.disableBack();
          this.workflowNav.disableCancel();
        }
        this.loadEntry();
      });
    }

  }

  loadEntry() {

    this.eventEntries = this.entry.entryEvents;
    this.eventEntries.sort((a, b) => (parseInt(a.program_no, 10) > parseInt(b.program_no, 10)) ? 1 : -1);

    this.paymentOptionForm.valueChanges.subscribe(val => {
      if (this.paymentOptionForm.valid) {
        this.formValidSubject.next(true);
      } else {
        this.formValidSubject.next(false);
      }
    });

    if (this.paymentOptionForm.valid) {
      this.formValidSubject.next(true);
    } else {
      this.formValidSubject.next(false);
    }



    // this.entryService.incompleteChanged.subscribe((entries) => {
      // this.entry = this.entryService.getIncompleteEntryFO(this.meet_id);
      // console.log(this.entry);
      //
      // if (this.entry !== undefined && this.entry !== null) {
      //
      //   this.statusCode = this.entry.status;
      //   this.statuses.getStatus(this.entry.status).subscribe((status) => {
      //     if (status !== null) {
      //       this.statusLabel = status.label;
      //       this.statusText = status.description;
      //     }
      //   });
      //
      // }

    // });

    switch (this.entry.membershipDetails.member_type) {
      case 'msa':
        this.membershipType = 'Masters Swimming Australia member';
        break;
      case 'international':
        this.membershipType = 'International Masters Swimming member';
        break;
      case 'guest':
        this.membershipType = 'Guest swimmer';
        break;
      case 'non_member':
        this.membershipType = 'Non-member';
        break;
    }

    if (this.entry.medicalDetails.classification !== 'no') {
      this.disabilityClassificationRequired = this.toTitleCase(this.entry.medicalDetails.classification);
    }

    if (this.entry.medicalDetails.dispensation === 'true') {
      this.strokeDispensationRequired = 'Yes';
    }

    if (this.entry.medicalDetails.medicalCertificate === 'true') {
      this.medicalCertificate = 'Yes';
    }

    if (this.entry.medicalDetails.medicalCondition === 'true') {
      this.medicalCondition = 'Yes';
    }

    this.ngxSpinner.hide();

  }

  toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  onSubmit($event) {
    switch ($event) {
      case 'cancel':
        this.entryService.deleteEntry(this.meet_id);
        break;
      case 'saveAndExit':
        this.saveEntry();
        break;
      case 'submit':
        this.saveEntry();
        this.submit();
        break;
    }
  }

  saveEntry() {
    const paymentOption: PaymentOption = Object.assign({}, this.paymentOptionForm.value);
    this.entryService.setPaymentOptions(this.meet_id, paymentOption);
    console.log('saveentry');
  }

  submit() {
    // this.ngxSpinner.show();
    console.log('submit');
    this.entryService.storeIncompleteEntry(this.entryService.getIncompleteEntryFO(this.meet_id)).subscribe((entrySaved: IncompleteEntry) => {
      console.log('Saved entry to incomplete store');
      this.entry = entrySaved.entrydata;
      console.log(entrySaved);
        this.statusLabel = entrySaved.status_label;
        this.statusText = entrySaved.status_description;
      this.pending_entry_id = this.entry.id;
      this.entryService.finalise(entrySaved).subscribe((finalised: any) => {
        console.log('Finalise entry');
        console.log(finalised);

        if (finalised.meet_entry !== undefined && finalised.meet_entry !== null) {
          this.meet_entry_id = finalised.meet_entry.id;
        }

        // this.entryService.setStatus(this.entryService.getIncompleteEntry(this.meet_id), finalised.status);

        this.statusLabel = finalised.status_label;
        this.statusText = finalised.status_description;

        // Disable the form
        this.showPaymentChoice = false;
        this.workflowNav.enableFinishButton();

        if (this.userService.getUsers() === null) {
          this.entryService.deleteEntry(this.meet_id);
        }

        if (this.paymentOptionForm.controls.paymentOption.value === 'paypal') {

          let paypalPayment;
          if (finalised.pending_entry !== undefined) {
            paypalPayment = this.paypalService.createPaymentIncompleteEntry(finalised.pending_entry);
          } else if (finalised.meet_entry !== undefined) {
            paypalPayment = this.paypalService.createPaymentFinalisedEntry(finalised.meet_entry);
          }

          this.router.navigate(['/', 'paypal-depart']);

          paypalPayment.subscribe((paymentDetails: any) => {
            this.ngxSpinner.hide();
            window.location.assign(paymentDetails.approvalUrl);
          }, (error: any) => {

            // Handle paypal error
            console.log('Got error can\'t go to paypal');

            this.ngxSpinner.hide();
            this.showPaymentChoice = false;
            this.workflowNav.enableFinishButton();

          });

        } else {
          this.ngxSpinner.hide();
          // Remove finished entry from entry service
          if (this.userService.getUsers() !== null) {
            this.entryService.retrieveIncompleteEntries();
          } else {
            this.entryService.deleteEntry(this.meet_id);
          }

        }

      }, (error: any) => {
        console.log(error);
        this.ngxSpinner.hide();
        this.error = error.explanation;
      });
    },
      (error: any) => {
      console.log(error);
      this.ngxSpinner.hide();
      });

  }

  paypalPay(entry) {
    console.log(entry);

    const paymentDetails = {
      entryId: entry.id,
      meetId: entry.meet_id
    };

    this.http.post(environment.payPalLegacyUrl, paymentDetails).subscribe((url: any) => {

      console.log(url);
      console.log('Paypal payment redirect to ' + url.approvalUrl);
      // @ts-ignore
      window.location.assign(url.approvalUrl);
    });
  }

  enablePaymentOption(paymentType) {
    let paymentTypeId = 0;
    if (paymentType === 'paypal') {
      paymentTypeId = 1;
    }
    if (paymentType === 'club') {
      paymentTypeId = 2;
    }

    const meetPaymentTypes = this.meet.payment_types;
    if (meetPaymentTypes === undefined && meetPaymentTypes === null) {
      return false;
    }

    const filtered = meetPaymentTypes.filter(x => x.payment_type_id === paymentTypeId);

    if (filtered.length > 0) {
      return true;
    }

    return false;
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

}
