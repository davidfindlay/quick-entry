import { Component, OnInit } from '@angular/core';
import {Meet} from '../models/meet';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PlatformLocation} from '@angular/common';
import {UserService} from '../user.service';
import {MeetService} from '../meet.service';
import {EntryService} from '../entry.service';
import {Subject} from 'rxjs';
import {IPayPalConfig, ICreateOrderRequest, IPayPalButtonStyle} from 'ngx-paypal';

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

  public payPalConfig ?: IPayPalConfig;

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

    this.initPaypalConfig();

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
        break;
    }
  }

  saveEntry() {
    console.log('saveentry');
  }

  private initPaypalConfig(): void {
    this.payPalConfig = {
      currency: 'AUD',
      clientId: 'AZWwmMRH-EF8MkmCfwNITJfMrsQ4Nbkd24LtT66jx5mnXHOEzvVxl2ZfqhdMTCWJI1Q_qdHANwDkrcXu',
      createOrderOnClient: (data) => < ICreateOrderRequest > {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'AUD',
            value: '25.00',
            breakdown: {
              item_total: {
                currency_code: 'AUD',
                value: '25.00'
              }
            }
          },
          items: [{
            name: 'Entry Fees',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'AUD',
              value: '25.00',
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: <IPayPalButtonStyle> {
        label: 'pay',
        size: 'large',
        shape: 'rect',
        layout: 'horizontal'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        // this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        // this.showCancel = true;

      },
      onError: err => {
        console.log('OnError', err);
        // this.showError = true;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        // this.resetStatus();
      },
    };
  }

}
