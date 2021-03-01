import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddMeetDateComponent} from '../add-meet-date/add-meet-date.component';

@Component({
  selector: 'app-meet-administration',
  templateUrl: './meet-administration.component.html',
  styleUrls: ['./meet-administration.component.css']
})
export class MeetAdministrationComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  addMeetDateClick() {
    const modalRef = this.modalService.open(AddMeetDateComponent);
    modalRef.componentInstance.meetDateCreated.subscribe((receivedEntry) => {
      console.log(receivedEntry);
    });

    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
      }
    });
  }
}
