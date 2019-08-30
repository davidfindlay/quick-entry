import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-entry-confirmation',
  templateUrl: './entry-confirmation.component.html',
  styleUrls: ['./entry-confirmation.component.css']
})
export class EntryConfirmationComponent implements OnInit {

  formValidSubject = new BehaviorSubject<boolean>(true);

  meet_id;
  meet: Meet;
  meetName;

  entry;
  paymentOptionForm;

  eventEntries: EntryEvent[];

  window = window;

  paypalSuccess;
  paypalToken;

  statusCode = 0;
  statusText = 'Not Submitted: This entry has not yet been submitted. Click Next to submit this entry.';

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
              private ngxSpinner: NgxSpinnerService) { }

  ngOnInit() {
    this.meet_id = +this.route.snapshot.paramMap.get('meet');
    this.meet = this.meetService.getMeet(this.meet_id);
    if (this.meet) {

      this.meetName = this.meet.meetname;
    }

    this.entry = this.entryService.getEntry(this.meet_id);
    console.log(this.entry);

    this.eventEntries = this.entry.entryEvents;
    this.eventEntries.sort((a, b) => (a.program_no > b.program_no) ? 1 : -1);

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
    this.paypalSuccess = this.route.snapshot.paramMap.get('paypalsuccess');
    this.paypalToken = this.route.snapshot.paramMap.get('token');

    this.entryService.entriesChanged.subscribe((entries) => {
      this.entry = this.entryService.getEntry(this.meet_id);
      console.log(this.entry);

      this.statusCode = this.entry.status;
    });

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

        this.ngxSpinner.hide();

        this.entryService.setStatus(this.entryService.getEntry(this.meet_id), finalised.status);

        if (this.paymentOptionForm.controls.paymentOption.value === 'paypal') {
          // this.paypalPay(finalised.meet_entry);
          console.log('not moving to paypal');
        }

      });
    });

  }

  paypalPay(entry) {



    const paymentDetails = {
      entryId: entry.id,
      meetId: entry.meet_id
    };

    this.http.post(environment.payPalLegacyUrl, paymentDetails).subscribe((url: any) => {
      this.ngxSpinner.hide();
      console.log(url);
      console.log('Paypal payment redirect to ' + url.approvalUrl);
      // @ts-ignore
      window.location.assign(url.approvalUrl);
    });
  }


}
