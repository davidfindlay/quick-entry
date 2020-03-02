import { Component, OnInit } from '@angular/core';
import {MeetMerchandise} from '../../models/meet-merchandise';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetService} from '../../meet.service';
import {Meet} from '../../models/meet';
import {CurrencyPipe} from '@angular/common';


@Component({
  selector: 'app-merchandise-orders',
  templateUrl: './merchandise-orders.component.html',
  styleUrls: ['./merchandise-orders.component.css']
})
export class MerchandiseOrdersComponent implements OnInit {

  meetId;
  meet;
  meetName;
  orders;
  orderTable = [];
  orderColumns = [
    { name: 'Entry ID', prop: 'meet_entries_id' },
    { name: 'Date/Time', prop: 'updated_at' },
    { name: 'Entrant', prop: 'member_details' },
    { name: 'Items', prop: 'items' },
    { name: 'Entry Status', prop: 'status' },
    { name: 'Total Ex GST', prop: 'ex_gst'},
    { name: 'Total Inc GST', prop: 'inc_gst'}
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private meetService: MeetService) { }

  ngOnInit() {
    this.meetId = parseInt(this.activatedRoute.snapshot.params['meetId'], 10);
    console.log('Meet Merchandise meetId = ' + this.meetId);
    this.meetService.getMeetDetails(this.meetId).subscribe((meet: Meet) => {
      if (meet !== undefined && meet !== null) {
        this.meet = meet;
        this.meetName = meet.meetname;
      } else {
        console.error('Unable to load meet details for meetId: ' + this.meetId);
      }
    });

    this.meetService.getMerchandiseOrders(this.meetId).subscribe((res: any) => {
      if (res.success !== undefined && res.success !== null) {
        this.orders = res.orders;

        for (let i = 0; i < res.orders.length; i++) {
          let member_details = 'n/a';
          if (res.orders[i].member !== undefined && res.orders[i].member !== null) {
            member_details = res.orders[i].member.surname + ', ' + res.orders[i].member.firstname + '(' + res.orders[i].member.number + ')';
          }

          let items = '';

          for (let j = 0; j < res.orders[i].items.length; j++) {
            items += res.orders[i].items[j].qty + 'x ' +
              res.orders[i].items[j].merchandise.item_name + ' (' +
              res.orders[i].items[j].merchandise.sku + ')<br />';
          }

          const item_row = {
            meet_entries_id: res.orders[i].meet_entries_id,
            updated_at: res.orders[i].updated_at,
            member_details: member_details,
            items: items,
            status: res.orders[i].status_text,
            ex_gst: res.orders[i].total_exgst,
            inc_gst: res.orders[i].total_gst
          };

          this.orderTable.push(item_row);
        }

        console.log(this.orderTable);

      }

      this.orderTable = [...this.orderTable];
    });
  }

  configureMerchandise() {
    this.router.navigate(['items'], {relativeTo: this.activatedRoute})
  }

}
