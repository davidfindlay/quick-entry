import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MeetService} from '../meet.service';
import {TimeService} from '../time.service';
import {Meet} from '../models/meet';
import {environment} from '../../environments/environment';
import {ICreateOrderRequest, IPayPalConfig} from 'ngx-paypal';
import {RelayService} from '../relay.service';
import {Alert} from '../models/alert';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetEvent} from '../models/meet-event';

@Component({
  selector: 'app-relay-guest',
  templateUrl: './relay-guest.component.html',
  styleUrls: ['./relay-guest.component.css']
})
export class RelayGuestComponent implements OnInit {

  meet: Meet;
  meetEvent: MeetEvent;
  meetId;

  relayForm: FormGroup;
  relayEvents = [];
  numberOfTeams = 1;
  paymentAlerts: Alert[];
  totalAge = 0;

  eventFee;
  eventFeeNonMember;
  membersOnly = false;

  showSuccess = false;

  public payPalConfig ?: IPayPalConfig;

  constructor(private meetService: MeetService,
              private relayService: RelayService,
              private fb: FormBuilder,
              private cdRef: ChangeDetectorRef,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {

    this.route.params.subscribe((routeParams) => {
      if (routeParams.meetId && parseInt(routeParams.meetId, 10) !== 0) {
        this.meetId = parseInt(routeParams.meetId, 10);
        this.loadMeet(parseInt(routeParams.meetId, 10))
      }
    });

    this.initConfig();
    this.createForm();
    this.resetAlerts();

    this.relayForm.valueChanges.subscribe((change) => {
      this.updateAge(change)
    });

    this.relayForm.controls['relayEvent'].valueChanges.subscribe((change) => {
      this.meetEvent = this.meet.events.find(x => x.id === parseInt(change, 10));
      if (this.meetEvent) {
        this.eventFee = this.meetEvent.eventfee;
        this.eventFeeNonMember = this.meetEvent.eventfee_non_member;
      }
    });

    this.relayForm.controls['memberRelay'].valueChanges.subscribe((change) => {
      if (change.toString() === 'yes') {
        this.membersOnly = true;
      } else {
        this.membersOnly = false;
      }
    });

  }

  loadMeet(meetId) {
    this.meetService.getSingleMeet(meetId).subscribe((meetDetails: Meet) => {
      this.meet = meetDetails;
      for (const meetEvent of meetDetails.events) {
        if (meetEvent.legs > 1) {
          this.relayEvents.push(meetEvent);
        }
      }
      console.log(this.relayEvents);
    });
  }

  createForm() {
    this.relayForm = this.fb.group({
      meetId: this.meetId,
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
      seedTime: [''],
      memberRelay: ['', Validators.required]
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
      meetId: this.meetId,
      relayEvent: [''],
      contactFirstName: [''],
      contactSurname: [''],
      contactEmail: [''],
      contactMobile: [''],
      newTeamName: [''],
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

    this.meetEvent = null;

  }

  submitTeam() {

  }

  getOwed() {
    if (!this.eventFeeNonMember) {
      return this.eventFee;
    } else {
      if (this.relayForm.get('memberRelay').value === 'yes')  {
        return this.eventFee;
      }
    }

    return this.eventFeeNonMember;
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
                  value: (this.getOwed()).toString(),
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
            message: status.message
          });

          this.showSuccess = true;
          this.resetForm();
          console.log('success');
          this.cdRef.detectChanges();

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
