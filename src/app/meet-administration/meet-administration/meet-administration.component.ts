import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddMeetDateComponent} from '../add-meet-date/add-meet-date.component';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-meet-administration',
  templateUrl: './meet-administration.component.html',
  styleUrls: ['./meet-administration.component.css']
})
export class MeetAdministrationComponent implements OnInit {

  refreshCalendar: Subject<boolean>;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.refreshCalendar = new Subject<any>();
  }

  addMeetDateClick() {
    const modalRef = this.modalService.open(AddMeetDateComponent);
    modalRef.componentInstance.meetDateCreated.subscribe((receivedEntry) => {
      console.log('receivedEntry');
      this.refreshCalendar.next(true);
      console.log('sent refresh request');
    });

/*    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
      }
    });*/
  }
}
