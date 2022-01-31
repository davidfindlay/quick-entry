import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MembershipImportService} from '../membership-import.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DateTime} from 'luxon';

@Component({
  selector: 'app-membership-import',
  templateUrl: './membership-import.component.html',
  styleUrls: ['./membership-import.component.css']
})
export class MembershipImportComponent implements OnInit {

  @ViewChild('membershipImportHistory', {static: true}) membershipImportHistory: ElementRef;
  @ViewChild('requestConfirm', {static: true}) requestConfirm: ElementRef;
  @ViewChild('importFile', {static: true}) importFile: ElementRef;
  @ViewChild('logView', {static: true}) logView: ElementRef;

  importHistory;

  lastImportSecs = 0;

  constructor(private membershipImportService: MembershipImportService,
              private modal: NgbModal) { }

  ngOnInit(): void {
    this.loadImports();
  }

  loadImports() {
    this.importHistory = [];
    this.membershipImportService.getAllImports().subscribe((imports: any) => {
      console.log(imports);
      this.importHistory = imports.membershipImports;

      let lastTime;
      let lastRequest;
      for (const hist of this.importHistory) {
        const histRequested = DateTime.fromSQL(hist.requested_at);

        if (lastTime) {
          if (histRequested > lastTime) {
            lastTime = histRequested;
            lastRequest = hist;
          }
        } else {
          lastTime = histRequested;
          lastRequest = hist;
        }
      }

      console.log(lastTime);

      this.lastImportSecs = DateTime.now().diff(lastTime, 'seconds').as('seconds');
      console.log(this.lastImportSecs);
    });
  }

  isNewerRequestTime() {

  }

  viewLogs() {
    console.log('view logs');
  }

  requestAutoImport() {
    this.modal.open(this.requestConfirm).result.then((approved: any) => {
      if (approved === 'Yes') {
        this.membershipImportService.requestAutoImport().subscribe((results: any) => {
          if (results.success) {
            console.log('Successfully requested');
            console.log(results);
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

}
