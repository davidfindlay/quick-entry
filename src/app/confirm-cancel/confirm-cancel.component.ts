import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-cancel',
  templateUrl: './confirm-cancel.component.html',
  styleUrls: ['./confirm-cancel.component.css']
})
export class ConfirmCancelComponent implements OnInit {

  @Input() name;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  close() {
    console.log("close click");
    this.activeModal.dismiss();
  }

  yes() {
    console.log("yes click");
    this.activeModal.close('yes');
  }

  no() {
    console.log("no click");
    this.activeModal.dismiss();
  }
}
