import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-club-relay-status',
  templateUrl: './club-relay-status.component.html',
  styleUrls: ['./club-relay-status.component.css']
})
export class ClubRelayStatusComponent implements OnInit, OnChanges {

  @Input('teamInfo') teamInfo;
  @Input('payments') payments;

  numberOfTeams;
  totalCost;
  totalPaid = 0;

  constructor() { }

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
    if (this.payments) {
      for (const payment of this.payments) {
        this.totalPaid += payment.amount;
      }
    }
  }

}
