import {Component, Input, OnInit} from '@angular/core';
import {DashboardService} from '../services/dashboard.service';
import {FirstDataRenderedEvent} from 'ag-grid-community';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  @Input() meetId;
  @Input() clubEntries;

  tableApi;
  columnApi;

  summaryFields = [
    { headerName: 'Club Code', field: 'code', resizable: true, width: 100, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Club Name', field: 'clubname', resizable: true, sortable: true,
      filter: true, floatingFilter: true },
    { headerName: 'Entries', field: 'entries', resizable: true, width: 100, sortable: true,
      filter: false, floatingFilter: false },
    { headerName: 'Meals', field: 'meals', resizable: true, width: 100, sortable: true,
      filter: false, floatingFilter: false },
    { headerName: 'Orders', field: 'orders', resizable: true, width: 100, sortable: true,
      filter: false, floatingFilter: false },
  ];

  summaryRows = [];

  ngOnInit(): void {
    this.summaryRows = this.clubEntries;
    console.log(this.clubEntries);
  }

  onGridReady($event) {
    this.tableApi = $event.api;
    this.columnApi = $event.columnApi;
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  exportEntries() {
    this.tableApi.exportDataAsCsv();
  }

}
