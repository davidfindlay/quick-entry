import { Component, OnInit } from '@angular/core';
import {Meet} from '../models/meet';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PlatformLocation} from '@angular/common';
import {UserService} from '../user.service';
import {MeetService} from '../meet.service';
import {EntryService} from '../entry.service';
import {Subject} from 'rxjs';
import {IPayPalConfig, ICreateOrderRequest, IPayPalButtonStyle} from 'ngx-paypal';

import {PaymentOption} from '../models/paymentoption';

@Component({
  selector: 'app-entry-confirmation',
  templateUrl: './entry-confirmation.component.html',
  styleUrls: ['./entry-confirmation.component.css']
})
export class EntryConfirmationComponent implements OnInit {

  formValidSubject = new Subject<boolean>();

  meet_id;
  meet: Meet;
  meetName;

  entry;
  paymentOptionForm;


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
              private entryService: EntryService) { }

  ngOnInit() {
    this.meet_id = +this.route.snapshot.paramMap.get('meet');
    this.meet = this.meetService.getMeet(this.meet_id);
    if (this.meet) {

      this.meetName = this.meet.meetname;
    }

    this.entry = this.entryService.getEntry(this.meet_id);


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

    this.initConfig();

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
    console.log('submit');
    this.entryService.storeIncompleteEntry(this.entryService.getEntry(this.meet_id));
    this.entryService.finalise(this.entryService.getEntry(this.meet_id));
  }


  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data) => < ICreateOrderRequest > {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: '9.99',
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: '9.99'
              }
            }
          },
          items: [{
            name: 'Enterprise Subscription',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'EUR',
              value: '9.99',
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.showCancel = true;

      },
      onError: err => {
        console.log('OnError', err);
        this.showError = true;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        this.resetStatus();
      }
    };
  }

}
