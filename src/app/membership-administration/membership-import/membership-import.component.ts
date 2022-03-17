import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MembershipImportService} from '../membership-import.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DateTime} from 'luxon';
import {DataTableDirective} from 'angular-datatables';

interface Alert {
  type: string;
  message: string;
}

@Component({
  selector: 'app-membership-import',
  templateUrl: './membership-import.component.html',
  styleUrls: ['./membership-import.component.css']
})
export class MembershipImportComponent implements OnInit {

  // @ViewChild(DataTableDirective, {static: true}) membershipImportHistory: ElementRef;
  @ViewChild('requestConfirm', {static: true}) requestConfirm: ElementRef;
  @ViewChild('importFile', {static: true}) importFile: ElementRef;
  @ViewChild('logView', {static: true}) logView: ElementRef;

  importHistory;
  alerts: Alert[];

  lastTime;
  lastImportSecs = 0;

  constructor(private membershipImportService: MembershipImportService,
              private modal: NgbModal) { }

  ngOnInit(): void {
    this.loadImports();
    this.resetAlerts();
  }

  loadImports() {
    this.importHistory = [];
    this.membershipImportService.getAllImports().subscribe((imports: any) => {
      console.log(imports);
      this.importHistory = imports.membershipImports;

      for (const hist of this.importHistory) {
        const histRequested = DateTime.fromSQL(hist.requested_at, {zone: 'UTC'} );

        if (this.lastTime) {
          if (histRequested > this.lastTime) {
            this.lastTime = histRequested;
          }
        } else {
          this.lastTime = histRequested;
        }
      }
      //
      // this.membershipImportHistory.nativeElement.dtInstance.then((dtInstance: DataTables.Api) => {
      //   dtInstance.order([1, 'asc']);
      //   dtInstance.draw();
      // });

      console.log(this.lastTime);
    });
  }

  isNewerRequestTime() {

  }

  viewLogs() {
    console.log('view logs');
  }

  requestAutoImport() {
    this.lastImportSecs = DateTime.utc().diff(this.lastTime, 'seconds').as('seconds');
    console.log(this.lastImportSecs);
    this.modal.open(this.requestConfirm).result.then((approved: any) => {
      if (approved === 'Yes') {
        this.membershipImportService.requestAutoImport().subscribe((results: any) => {
          if (results.success) {
            console.log('Successfully requested');
            console.log(results);
            this.alerts.push({
              type: 'success',
              message: 'Membership data import successfully requested. Please be aware this may take up to 5 minutes to be completed.'
            });
            this.loadImports();
          } else {
            console.log('Not successful');
          }
        }, (error) => {
          console.log('unable to request: ' + error.statusText);
        });
      }
    });
  }

  uploadImport() {

  }

  getLocal(tsString) {
    const tsDt = DateTime.fromSQL(tsString, { zone: 'UTC' });
    return tsDt.setZone('Australia/Brisbane').toFormat('d/L/yyyy h:m a');
  }

  resetAlerts() {
    this.alerts = [];
  }

  closeAlert(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

}
