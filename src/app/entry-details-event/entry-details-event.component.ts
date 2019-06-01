import {Component, Input, OnInit} from '@angular/core';
import {MeetEvent} from '../models/meet-event';
import {FormBuilder, FormGroup} from '@angular/forms';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-entry-details-event',
  templateUrl: './entry-details-event.component.html',
  styleUrls: ['./entry-details-event.component.css']
})
export class EntryDetailsEventComponent implements OnInit {

  @Input() meetEvent: MeetEvent;
  @Input() index: number;

  eventEntryForm: FormGroup;

  enterClass = 'btn btn-outline-primary';
  enterText = 'Enter';
  btnIconClass = null;

  enteredButtonIcon = faCheck;
  enterButtonCaption = 'Enter';
  enteredButtonCaption = 'Entered';
  cancelButtonIcon = faTimes;
  cancelButtonCaption = 'Cancel';

  entered = false;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.eventEntryForm = this.fb.group({
      enter: false,
      seedTime: ''
    });

  }

  eventSelected() {
    return this.eventEntryForm.controls['enter'].value;
  }

  clickEnter() {
    if (this.entered === false) {
      this.entered = true;
      this.enterClass = 'btn btn-success';
      this.enterText = this.enteredButtonCaption;
      this.btnIconClass = this.enteredButtonIcon;
    } else if (this.entered === true) {
      this.entered = false;
      this.enterClass = 'btn btn-outline-primary';
      this.enterText = this.enterButtonCaption;
      this.btnIconClass = '';
    }
    console.log(this.entered);
  }

  mouseEnter() {
    console.log(this.entered);
    if (this.entered === true) {
      this.enterClass = 'btn btn-danger';
      this.enterText = this.cancelButtonCaption;
      this.btnIconClass = this.cancelButtonIcon;
    }
  }

  mouseLeave() {
    console.log(this.entered);
    if (this.entered === false) {
      this.enterClass = 'btn btn-outline-primary';
      this.enterText = this.enterButtonCaption;
      this.btnIconClass = '';
    } else if (this.entered === true) {
      this.enterClass = 'btn btn-success';
      this.enterText = this.enteredButtonCaption;
      this.btnIconClass = this.enteredButtonIcon;
    }
  }

}
