import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlatformLocation} from '@angular/common';
import {Router} from '@angular/router';
import {ConfirmCancelComponent} from '../confirm-cancel/confirm-cancel.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-workflow-nav',
  templateUrl: './workflow-nav.component.html',
  styleUrls: ['./workflow-nav.component.css']
})
export class WorkflowNavComponent implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('previous') previous: string;
  // tslint:disable-next-line:no-input-rename
  @Input('next') next: string;
  // tslint:disable-next-line:no-input-rename
  @Input('nextActivated') nextActivated: Observable<boolean>;
  // tslint:disable-next-line:no-input-rename
  @Input('nextText') nextText = 'Next';

  btnNextDisable = true;
  btnSaveDisable = false;
  btnCancelDisable = false;
  btnBackDisable = false;

  showNextButton = true;
  showFinishButton = false;

  @Output() submitEvent = new EventEmitter<string>();

  constructor(private modalService: NgbModal,
              private router: Router,
              private location: PlatformLocation) { }

  ngOnInit() {
    this.nextActivated.subscribe((nextActivate) => {
      this.btnNextDisable = !nextActivate;
    });
  }

  clickBack() {
    // If there is no previous route specified then use cancel functionality
    if (!this.previous) {
      this.clickCancel();
    } else {
      this.router.navigate([this.previous]);
      this.submitEvent.emit('submit');
    }
  }

  clickCancel() {
    const modalRef = this.modalService.open(ConfirmCancelComponent);
    modalRef.componentInstance.name = 'meet';
    modalRef.result.then((result) => {
        console.log(result);
        if (result === 'yes') {
          this.router.navigate(['/']);
          this.submitEvent.emit('cancel');
        }
      },
      (reason) => {
        console.log(reason);
      });
  }

  clickNext() {
    // this.router.navigate([this.next]);
    this.submitEvent.emit('submit');
  }

  navigateNext() {
    this.router.navigate([this.next]);
  }

  clickSaveAndExit() {
    this.router.navigate(['/']);
    this.submitEvent.emit('saveAndExit');
  }

  clickFinish() {
    this.router.navigate(['/']);
  }

  disableBack() {
    this.btnBackDisable = true;
  }

  disableCancel() {
    this.btnCancelDisable = true;
  }

  enableFinishButton() {
    this.btnBackDisable = true;
    this.btnCancelDisable = true;
    this.btnSaveDisable = true;
    this.showNextButton = false;
    this.showFinishButton = true;
  }

}
