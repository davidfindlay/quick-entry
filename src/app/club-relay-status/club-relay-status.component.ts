import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {
  IPayPalConfig,
  ICreateOrderRequest
} from 'ngx-paypal';
import {environment} from '../../environments/environment';
import {Alert} from '../models/alert';
import {RelayService} from '../relay.service';

@Component({
  selector: 'app-club-relay-status',
  templateUrl: './club-relay-status.component.html',
  styleUrls: ['./club-relay-status.component.css']
})
export class ClubRelayStatusComponent implements OnInit, OnChanges {

  @Input('clubId') clubId;
  @Input('meetId') meetId;
  @Input('teamInfo') teamInfo;
  @Input('payments') payments;
  @ViewChild('makePayment', {static: false}) makePayment: NgbModalRef;

  @Output() notifyParent: EventEmitter<any> = new EventEmitter();

  public payPalConfig ?: IPayPalConfig;

  numberOfTeams;
  totalCost;
  totalPaid = 0;
  enableClientPayments = false;

  showSuccess = false;
  paymentNeeded = false;
  paymentAlerts: Alert[];

  modalRef: NgbModalRef;

  constructor(private modalService: NgbModal,
              private relayService: RelayService) {
  }

  ngOnInit() {
    this.initConfig();
    this.resetPaymentAlerts();
    this.getNumberOfTeams();
    this.getTotalCost();
    this.getTotalPayments();

    if (environment.enableClientPayments) {
      this.enableClientPayments = true;
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getNumberOfTeams();
    this.getTotalCost();
    this.getTotalPayments();
  }

  getNumberOfTeams() {
    this.numberOfTeams = this.teamInfo.length;
  }

  getTotalCost() {
    this.totalCost = 0;
    for (const relay of this.teamInfo) {
      this.totalCost += relay.cost;
    }
  }

  getTotalPayments() {
    this.totalPaid = 0;
    if (this.payments) {
      for (const payment of this.payments) {
        this.totalPaid += payment.amount;
      }
    }

    if (this.totalPaid < this.totalCost) {
      this.paymentNeeded = true;
    }
  }

  makePaymentClick() {

    this.modalService.open(this.makePayment, {size: 'lg'}).result.then((result) => {
      if (result === 'yes') {

      }
    }, (reason) => {

    });
  }

  getOwed(): number {
    return this.totalCost - this.totalPaid;
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
                name: 'Relay Teams',
                quantity: this.numberOfTeams,
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

        this.relayService.reportPayment(this.clubId, this.meetId, data).subscribe((status: any) => {
          console.log(status);
          this.paymentAlerts.push({
            type: 'success',
            message: 'Payment received.'
          });

          this.notifyParent.emit(true);
          this.getTotalPayments();
          this.showSuccess = true;
          this.paymentNeeded = false;
          this.modalService.dismissAll();

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

  resetPaymentAlerts() {
    this.paymentAlerts = [];
  }

  closePaymentAlert(alert: Alert) {
    this.paymentAlerts.splice(this.paymentAlerts.indexOf(alert), 1);
  }

}
