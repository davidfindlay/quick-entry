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

  @Input('previous') previous: string;
  @Input('next') next: string;
  @Input('nextActivated') nextActivated: Observable<boolean>;
  btnNextDisable = true;

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
    this.router.navigate([this.next]);
    this.submitEvent.emit('submit');
  }

  clickSaveAndExit() {
    this.router.navigate(['/']);
    this.submitEvent.emit('submit');
  }

}
