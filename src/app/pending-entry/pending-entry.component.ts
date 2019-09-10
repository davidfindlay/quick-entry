import {Component, Input, OnInit} from '@angular/core';
import {IncompleteEntry} from '../models/incomplete_entry';
import {Meet} from '../models/meet';
import {MeetEntryStatusService} from '../meet-entry-status.service';

@Component({
  selector: 'app-pending-entry',
  templateUrl: './pending-entry.component.html',
  styleUrls: ['./pending-entry.component.css']
})
export class PendingEntryComponent implements OnInit {

  @Input() meet: Meet;
  @Input() incompleteEntry: IncompleteEntry;

  constructor(private statuses: MeetEntryStatusService) { }

  ngOnInit() {
    console.log(this.incompleteEntry.entrydata);
    // this.incompleteEntry.entrydata = JSON.parse(<any>this.incompleteEntry.entrydata);
  }

  entriesOpen() {
    const currentTime = new Date();
    const deadline = new Date(this.meet.deadline + ' 23:59:59');
    if (deadline >= currentTime) {
      return true;
    } else {
      return false;
    }
  }

  editIncompleteEntry(incompleteEntry) {

  }

  editSubmittedEntry(incompleteEntry) {

  }

}
