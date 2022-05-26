import { Component, OnInit } from '@angular/core';
import {MeetMerchandise} from '../../models/meet-merchandise';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetService} from '../../meet.service';
import {Meet} from '../../models/meet';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {NgxSpinnerService} from 'ngx-spinner';
import {FirstDataRenderedEvent} from 'ag-grid-community';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MerchandiseService} from '../services/merchandise.service';


@Component({
  selector: 'app-merchandise-orders',
  templateUrl: './merchandise-orders.component.html',
  styleUrls: ['./merchandise-orders.component.css']
})
export class MerchandiseOrdersComponent implements OnInit {

  entryOrderForm: FormGroup;

  active = 1;

  meetId;
  meet;
  meetName;
  orders;
  orderTable = [];

  entryOrderFields = [
    { headerName: 'Entry ID', field: 'meet_entries_id', resizable: true, width: 100, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Entrant', field: 'member_name', resizable: true, width: 150, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'MSA Number', field: 'member_number', resizable: true, width: 120, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Club Code', field: 'club_code', resizable: true, width: 100, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Club Name', field: 'club_name', resizable: true, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Status', field: 'status', resizable: true, width: 120, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Total Ex GST', field: 'ex_gst', resizable: true, width: 120, sortable: true, type: 'numericColumn'},
    { headerName: 'Total Inc GST', field: 'inc_gst', resizable: true, width: 120, sortable: true, type: 'numericColumn'}
  ];

  itemOrderFields = [
    { headerName: 'Entry ID', field: 'meet_entries_id', resizable: true, width: 100, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Entrant', field: 'member_name', resizable: true, width: 150, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'MSA Number', field: 'member_number', resizable: true, width: 120, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Club Code', field: 'club_code', resizable: true, width: 100, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Club Name', field: 'club_name', resizable: true, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Status', field: 'status', resizable: true, width: 120, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Qty', field: 'qty', resizable: true, width: 60 , sortable: true, type: 'numericColumn'},
    { headerName: 'Item', field: 'item', resizable: true, sortable: true,
      filter: true, floatingFilter: true }
  ];

  itemFields = [
    { headerName: 'Item ID', field: 'id', resizable: true, width: 80, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'SKU', field: 'sku', resizable: true, width: 100, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Item Name', field: 'item_name', resizable: true, width: 250, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Qty', field: 'orders', resizable: true, width: 80, type: 'numericColumn', sortable: true },
    { headerName: 'Price Ex GST', field: 'exgst', resizable: true, width: 120, type: 'numericColumn', sortable: true,
      valueFormatter: params => this.currencyFormatter(params.data.exgst)},
    { headerName: 'Price Inc GST', field: 'gst', resizable: true, width: 120, type: 'numericColumn', sortable: true,
      valueFormatter: params => this.currencyFormatter(params.data.gst)},
    { headerName: 'Total Ex GST', field: 'orders_exgst', resizable: true, width: 120, type: 'numericColumn',
      valueFormatter: params => this.currencyFormatter(params.data.orders_exgst), sortable: true },
    { headerName: 'Total Inc GST', field: 'orders_total', resizable: true, width: 120, type: 'numericColumn',
      valueFormatter: params => this.currencyFormatter(params.data.orders_total), sortable: true }
  ];

  mealOrderFields = [
    { headerName: 'Entry ID', field: 'meet_entries_id', resizable: true, width: 100, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Entrant', field: 'member_name', resizable: true, width: 150, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'MSA Number', field: 'member_number', resizable: true, width: 120, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Club Code', field: 'club_code', resizable: true, width: 100, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Club Name', field: 'club_name', resizable: true, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Status', field: 'status', resizable: true, width: 120, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Qty', field: 'qty', resizable: true, width: 60 , sortable: true, type: 'numericColumn'},
    { headerName: 'Comments', field: 'comments', resizable: true, sortable: true,
      filter: true, floatingFilter: true }
  ];

  entryOrderRows = [];
  itemOrderRows = [];
  itemRows = [];
  mealOrderRows = [];
  tableApi;
  columnApi;

  merchandiseExists;

  merchandiseSummary = [];

  clubs = [];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private currencyPipe: CurrencyPipe,
              private datePipe: DatePipe,
              private fb: FormBuilder,
              private meetService: MeetService,
              private merchandiseService: MerchandiseService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.createForms();
    this.meetId = parseInt(this.activatedRoute.snapshot.params['meetId'], 10);
    console.log('Meet Merchandise meetId = ' + this.meetId);
    this.meetService.getMeetDetails(this.meetId).subscribe((meet: Meet) => {
      if (meet !== undefined && meet !== null) {
        this.meet = meet;
        this.meetName = meet.meetname;

        if (this.meet.merchandise !== undefined && this.meet.merchandise !== null) {
          if (this.meet.merchandise.length > 0) {
            this.merchandiseExists = true;
            this.itemRows = this.meet.merchandise;
          } else {
            this.merchandiseExists = false;
          }
        }
      } else {
        this.spinner.hide();
        console.error('Unable to load meet details for meetId: ' + this.meetId);
      }
    });

    this.merchandiseService.getMerchandiseSummary(this.meetId).subscribe((res: any) => {
      this.merchandiseSummary = res.merchandise_summary;
    }, (err) => {
      console.error(err);
      this.merchandiseSummary = [];
    });

    this.meetService.getMerchandiseOrders(this.meetId).subscribe((res: any) => {
      if (res.success !== undefined && res.success !== null) {
        this.orders = res.orders;

        for (let i = 0; i < res.orders.length; i++) {
          let member_details = 'n/a';
          if (res.orders[i].member !== undefined && res.orders[i].member !== null) {
            member_details = res.orders[i].member.surname + ', ' + res.orders[i].member.firstname + '(' + res.orders[i].member.number + ')';
          }

          let club_details = 'n/a';

          if (this.orders[i].meet_entry !== undefined && this.orders[i].meet_entry !== null) {
            if (this.orders[i].meet_entry.club !== undefined && this.orders[i].meet_entry.club !== null) {
              club_details = this.orders[i].meet_entry.club.clubname + ' (' + this.orders[i].meet_entry.club.code + ')';
            }
          }

          // Clubs
          this.addClubToFilter(this.orders[i].meet_entry.club);

          let items = '';

          for (let j = 0; j < res.orders[i].items.length; j++) {
            if (res.orders[i].items[j].qty > 0) {
              items += res.orders[i].items[j].qty + 'x ' +
                res.orders[i].items[j].merchandise.item_name + ' (' +
                res.orders[i].items[j].merchandise.sku + ')<br />';

              const item_row = {
                meet_entries_id: res.orders[i].meet_entries_id,
                updated_at: this.datePipe.transform(res.orders[i].updated_at, 'd/M/yyyy, h:mm a'),
                member_name: res.orders[i].member.surname + ', ' + res.orders[i].member.firstname,
                member_number: res.orders[i].member.number,
                member_details: member_details,
                club_details: club_details,
                club_name: this.orders[i].meet_entry.club.clubname,
                club_code: this.orders[i].meet_entry.club.code,
                qty: res.orders[i].items[j].qty,
                item: res.orders[i].items[j].merchandise.item_name,
                status: res.orders[i].status_text
              }

              this.itemOrderRows.push(item_row);
            }
          }

          const entry_item_row = {
            meet_entries_id: res.orders[i].meet_entries_id,
            updated_at: this.datePipe.transform(res.orders[i].updated_at, 'd/M/yyyy, h:mm a'),
            member_name: res.orders[i].member.surname + ', ' + res.orders[i].member.firstname,
            member_number: res.orders[i].member.number,
            member_details: member_details,
            club_details: club_details,
            club_name: this.orders[i].meet_entry.club.clubname,
            club_code: this.orders[i].meet_entry.club.code,
            items: items,
            status: res.orders[i].status_text,
            ex_gst: this.currencyPipe.transform(res.orders[i].total_exgst),
            inc_gst: this.currencyPipe.transform(res.orders[i].total_gst)
          };

          if (items.length > 0) {
            this.entryOrderRows.push(entry_item_row);
          }
        }

        // console.log(this.orderTable);

      }

      this.sortClubsFilter();

      this.entryOrderRows = [...this.entryOrderRows];
      this.itemOrderRows = [...this.itemOrderRows];
      this.spinner.hide();
    }, (err) => {
      console.error(err);
      this.spinner.hide();
    });

    this.merchandiseService.getMealsFromMeetEntries(this.meetId).subscribe((res: any) => {
      this.mealOrderRows = res;
    }, (err) => {
      console.error(err);
    });
  }

  createForms() {
    this.entryOrderForm = this.fb.group({
      clubSelector: '',
      memberSearch: ''
    });

    this.entryOrderForm.controls['clubSelector'].valueChanges.subscribe((value) => {
      this.filterClubs(value);
    });

  }

  filterClubs(value) {
    console.log(value);
  }

  configureMerchandise() {
    this.router.navigate(['items'], {relativeTo: this.activatedRoute})
  }

  onGridReady($event) {
    this.tableApi = $event.api;
    this.columnApi = $event.columnApi;
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  exportMerchandise() {
    this.tableApi.exportDataAsCsv();
  }

  addClubToFilter(club) {
    if (!this.clubs.find(x => x.id === club.id)) {
      this.clubs.push(club);
    }
  }

  sortClubsFilter() {
    this.clubs.sort((a, b) => (a.clubname > b.clubname) ? 1 : ((b.clubname > a.clubname) ? -1 : 0))
  }

  currencyFormatter(value) {
    return this.currencyPipe.transform(value);
  }

}
