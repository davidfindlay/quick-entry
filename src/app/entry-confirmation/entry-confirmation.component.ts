import {Component, OnInit, ViewChild} from '@angular/core';
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
import {Entry} from '../models/entry';
import {HttpClient} from '@angular/common/http';
import {NgxSpinner} from 'ngx-spinner/lib/ngx-spinner.enum';
import {NgxSpinnerService} from 'ngx-spinner';
import {MeetEntryStatusService} from '../meet-entry-status.service';
import {WorkflowNavComponent} from '../workflow-nav/workflow-nav.component';
import {PaypalService} from '../paypal.service';
import {ClubsService} from '../clubs.service';

@Component({
  selector: 'app-entry-confirmation',
  templateUrl: './entry-confirmation.component.html',
  styleUrls: ['./entry-confirmation.component.css']
})
export class EntryConfirmationComponent implements OnInit {

  @ViewChild(WorkflowNavComponent, {static: false})
  workflowNav: WorkflowNavComponent;

  formValidSubject = new BehaviorSubject<boolean>(true);

  meet_id;
  meet: Meet;
  meetName;

  entry;
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

  public defaultPrice: string = '9.99';
  public payPalConfig?: IPayPalConfig;

  public showSuccess: boolean = false;
  public showCancel: boolean = false;
  public showError: boolean = false;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private location: PlatformLocation,
              private userService: UserService,
              private meetService: MeetService,
              private entryService: EntryService,
              private http: HttpClient,
              private ngxSpinner: NgxSpinnerService,
              private statuses: MeetEntryStatusService,
              private paypalService: PaypalService,
              private clubService: ClubsService) { }

  ngOnInit() {
    this.meet_id = +this.route.snapshot.paramMap.get('meet');
    this.meet = this.meetService.getMeet(this.meet_id);
    if (this.meet) {

      this.meetName = this.meet.meetname;
    }

    this.entry = this.entryService.getEntry(this.meet_id);
    console.log(this.entry);

    this.eventEntries = this.entry.entryEvents;
    this.eventEntries.sort((a, b) => (parseInt(a.program_no, 10) > parseInt(b.program_no, 10)) ? 1 : -1);

    this.paymentOptionForm = this.fb.group({
      paymentOption: ['paypal', Validators.required]
    });

    this.paymentOptionForm.valueChanges.subscribe(val => {
      if (this.paymentOptionForm.valid) {
        this.formValidSubject.next(true);
      } else {
        this.formValidSubject.next(false);
      }
    });

    // Paypal status
    console.log(this.route.snapshot);
    this.paypalSuccess = this.route.snapshot.queryParams['paypalsuccess'];
    this.paypalToken = this.route.snapshot.queryParams['token'];
    this.paymentId = this.route.snapshot.queryParams['paymentId'];
    this.payerID = this.route.snapshot.queryParams['PayerID'];

    if (this.paypalSuccess && this.paypalSuccess !== 'false') {
      console.log('Got paypal success');
      this.ngxSpinner.show();
      const paymentDetails = {
        paypalSuccess: this.paypalSuccess,
        paypalToken: this.paypalToken,
        paymentId: this.paymentId,
        payerID: this.payerID
      };

      this.paypalService.finalisePayment(paymentDetails).subscribe((paid: any) => {
        console.log(paid);
        this.paidAmount = paid.paid;
        this.paypalData = paid.paypalPayment;
        this.showPaymentChoice = false;
        this.workflowNav.enableFinishButton();
        this.entryService.setStatus(this.entryService.getEntry(this.meet_id), paid.status);
        this.entryService.deleteEntry(this.meet_id);
        this.ngxSpinner.hide();
      });
    }

    this.entryService.entriesChanged.subscribe((entries) => {
      this.entry = this.entryService.getEntry(this.meet_id);
      console.log(this.entry);

      this.statusCode = this.entry.status;
        this.statuses.getStatus(this.entry.status).subscribe((status) => {
          if (status !== null) {
            this.statusLabel = status.label;
            this.statusText = status.description;
          }
        });

    });

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

  }

  toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  private resetStatus(): void {
    this.showError = false;
    this.showSuccess = false;
    this.showCancel = false;
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
    this.ngxSpinner.show();
    console.log('submit');
    this.entryService.storeIncompleteEntry(this.entryService.getEntry(this.meet_id)).subscribe((entrySaved: Entry) => {
      console.log('Saved entry to incomplete store');
      this.entryService.finalise(this.entryService.getEntry(this.meet_id)).subscribe((finalised: any) => {
        console.log('Finalise entry');
        console.log(finalised);

        this.entryService.setStatus(this.entryService.getEntry(this.meet_id), finalised.status);

        // Disable the form
        this.showPaymentChoice = false;
        this.workflowNav.enableFinishButton();

        if (this.paymentOptionForm.controls.paymentOption.value === 'paypal') {

          let paypalPayment;
          if (finalised.incomplete_entry !== undefined) {
            paypalPayment = this.paypalService.createPaymentIncompleteEntry(finalised.incomplete_entry);
          } else if (finalised.meet_entry !== undefined) {
            paypalPayment = this.paypalService.createPaymentFinalisedEntry(finalised.meet_entry);
          }

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
          this.entryService.deleteEntry(this.meet_id);

        }

      }, (error: any) => {
        console.log(error);
        this.ngxSpinner.hide();
        this.error = error.explanation;
      });
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
