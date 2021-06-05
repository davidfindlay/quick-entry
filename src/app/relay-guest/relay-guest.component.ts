import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MeetService} from '../meet.service';
import {TimeService} from '../time.service';
import {Meet} from '../models/meet';
import {environment} from '../../environments/environment';
import {ICreateOrderRequest, IPayPalConfig} from 'ngx-paypal';
import {RelayService} from '../relay.service';
import {Alert} from '../models/alert';

@Component({
  selector: 'app-relay-guest',
  templateUrl: './relay-guest.component.html',
  styleUrls: ['./relay-guest.component.css']
})
export class RelayGuestComponent implements OnInit {

  relayForm: FormGroup;
  relayEvents = [];
  numberOfTeams = 1;
  paymentAlerts: Alert[];
  meetId = 200;
  totalAge = 0;

  showSuccess;

  public payPalConfig ?: IPayPalConfig;

  constructor(private meetService: MeetService,
              private relayService: RelayService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.initConfig();
    this.createForm();

    this.meetService.getSingleMeet(200).subscribe((meetDetails: Meet) => {
      for (const meetEvent of meetDetails.events) {
        if (meetEvent.legs > 1) {
          this.relayEvents.push(meetEvent);
        }
      }
      console.log(this.relayEvents);
    });

    this.relayForm.valueChanges.subscribe((change) => {
      this.updateAge(change)
    });

  }

  createForm() {
    this.relayForm = this.fb.group({
      relayMeet: 200,
      relayEvent: ['', Validators.required],
      contactFirstName: ['', Validators.required],
      contactSurname: ['', Validators.required],
      contactEmail: ['', Validators.required],
      contactMobile: ['', Validators.required],
      newTeamName: [''],
      swimmer1FirstName: ['', Validators.required],
      swimmer1Surname: ['', Validators.required],
      swimmer1Age: ['', Validators.required],
      swimmer1Mobile: ['', Validators.required],
      swimmer2FirstName: ['', Validators.required],
      swimmer2Surname: ['', Validators.required],
      swimmer2Age: ['', Validators.required],
      swimmer2Mobile: ['', Validators.required],
      swimmer3FirstName: ['', Validators.required],
      swimmer3Surname: ['', Validators.required],
      swimmer3Age: ['', Validators.required],
      swimmer3Mobile: ['', Validators.required],
      swimmer4FirstName: ['', Validators.required],
      swimmer4Surname: ['', Validators.required],
      swimmer4Age: ['', Validators.required],
      swimmer4Mobile: ['', Validators.required],
      seedTime: ['']
    });
  }

  fixSeedTime() {
    const formattedSeedTime = TimeService.rewriteTimeEM(this.relayForm.controls.seedTime.value);
    this.relayForm.controls.seedTime.patchValue(formattedSeedTime, {emitEvent: false});
  }

  getEventDetails(meetEvent) {
    let genderText = '';

    switch (meetEvent.event_type.gender) {
      case 1:
        genderText = 'Men\'s';
        break;
      case 2:
        genderText = 'Women\'s';
        break;
      case 3:
        genderText = 'Mixed';
        break;
    }

    const eventDetails = '#' + meetEvent.prognumber + meetEvent.progsuffix + ': ' + genderText + ' ' + meetEvent.legs + 'x' +
      meetEvent.event_distance.distance + ' ' + meetEvent.event_discipline.discipline;

    return eventDetails;
  }

  resetForm() {
    this.relayForm.patchValue({
      relayMeet: 200,
      relayEvent: [''],
      contactFirstName: [''],
      contactSurname: [''],
      contactEmail: [''],
      contactMobile: [''],
      teamName: [''],
      swimmer1FirstName: [''],
      swimmer1Surname: [''],
      swimmer1Age: [''],
      swimmer1Mobile: [''],
      swimmer2FirstName: [''],
      swimmer2Surname: [''],
      swimmer2Age: [''],
      swimmer2Mobile: [''],
      swimmer3FirstName: [''],
      swimmer3Surname: [''],
      swimmer3Age: [''],
      swimmer3Mobile: [''],
      swimmer4FirstName: [''],
      swimmer4Surname: [''],
      swimmer4Age: [''],
      swimmer4Mobile: [''],
      seedTime: ['']
    });

    this.resetAlerts();
  }

  submitTeam() {

  }

  getOwed() {
    return 20;
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'AUD',
      clientId: environment.paypalClientId,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'AUD',
              value: this.getOwed().toString(),
              breakdown: {
                item_total: {
                  currency_code: 'AUD',
                  value: this.getOwed().toString()
                }
              }
            },
            items: [
              {
                name: 'Relay Team',
                quantity: this.numberOfTeams.toString(),
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'AUD',
                  value: (this.getOwed() / this.numberOfTeams).toString(),
                },
              }
            ]
          }
        ],
        application_context: {
          'shipping_preference': 'NO_SHIPPING'
        }
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

        const relayData = this.relayForm.value;
        relayData.paymentData = data;

        this.relayService.reportGuestPayment(this.meetId, relayData).subscribe((status: any) => {
          console.log(status);
          this.paymentAlerts.push({
            type: 'success',
            message: 'Payment received.'
          });

          this.showSuccess = true;
          this.resetForm();

        });

      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.showSuccess = true;
        this.paymentAlerts.push({
          type: 'warning',
          message: 'Payment cancelled.'
        });
      },
      onError: err => {
        console.log('OnError', err);
        this.showSuccess = true;
        this.paymentAlerts.push({
          type: 'danger',
          message: 'An error occured. Please try again later.'
        });
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  updateAge(change) {
    this.totalAge = change.swimmer1Age + change.swimmer2Age + change.swimmer3Age + change.swimmer4Age;
  }

  resetAlerts() {
    this.paymentAlerts = [];
  }

  closeAlert(alert: Alert) {
    this.paymentAlerts.splice(this.paymentAlerts.indexOf(alert), 1);
  }

}
