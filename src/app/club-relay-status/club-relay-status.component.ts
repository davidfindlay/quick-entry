import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  IPayPalConfig,
  ICreateOrderRequest
} from 'ngx-paypal';

@Component({
  selector: 'app-club-relay-status',
  templateUrl: './club-relay-status.component.html',
  styleUrls: ['./club-relay-status.component.css']
})
export class ClubRelayStatusComponent implements OnInit, OnChanges {

  @Input('teamInfo') teamInfo;
  @Input('payments') payments;
  @ViewChild('makePayment', {static: false}) makePayment;

  public payPalConfig ?: IPayPalConfig;

  numberOfTeams;
  totalCost;
  totalPaid = 0;

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
    this.getNumberOfTeams();
    this.getTotalCost();
    this.getTotalPayments();
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
    if (this.payments && this.payments.isArray()) {
      for (const payment of this.payments) {
        this.totalPaid += payment.amount;
      }
    }
  }

  makePaymentClick() {

    this.modalService.open(this.makePayment, {size: 'lg'}).result.then((result) => {
      if (result === 'yes') {

      }
    }, (reason) => {

    });


  }

  private initConfig(): void {
    // this.payPalConfig = {
    //   clientId: 'sb',
    //   // for creating orders (transactions) on server see
    //   // https://developer.paypal.com/docs/checkout/reference/server-integration/set-up-transaction/
    //   createOrderOnServer: (data) => fetch('/my-server/create-paypal-transaction')
    //     .then((res) => res.json())
    //     .then((order) => data.orderID),
    //   authorizeOnServer: (approveData) => {
    //     fetch('/my-server/authorize-paypal-transaction', {
    //       body: JSON.stringify({
    //         orderID: approveData.orderID
    //       })
    //     }).then((res) => {
    //       return res.json();
    //     }).then((details) => {
    //       alert('Authorization created for ' + details.payer_given_name);
    //     });
    //   },
    //   onCancel: (data, actions) => {
    //     console.log('OnCancel', data, actions);
    //     this.showCancel = true;
    //   },
    //   onError: err => {
    //     console.log('OnError', err);
    //     this.showError = true;
    //   },
    //   onClick: (data, actions) => {
    //     console.log('onClick', data, actions);
    //     this.resetStatus();
    //   },
    // };
  }

}
