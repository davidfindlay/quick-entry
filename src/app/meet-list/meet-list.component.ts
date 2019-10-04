import {Component, Input, OnInit} from '@angular/core';
import {MeetService} from '../meet.service';
import {Meet} from '../models/meet';
import {EntryService} from '../entry.service';
import {UserService} from '../user.service';

@Component({
    selector: 'app-meet-list',
    templateUrl: './meet-list.component.html',
    styleUrls: ['./meet-list.component.css']
})
export class MeetListComponent implements OnInit {

    openMeets: Meet[];
    meetSub;

    constructor(private meetService: MeetService,
                private entryService: EntryService,
                private userService: UserService) {
    }

    ngOnInit() {

        let openMeets: Meet[];

        if (openMeets = this.meetService.getOpenMeets()) {
            this.openMeets = openMeets;
            this.sortMeets();
        }

        this.meetSub = this.meetService.meetsChanged
            .subscribe((meets: Meet[]) => {
                this.openMeets = this.meetService.getOpenMeets();
              this.sortMeets();
        });


        if (this.userService.isLoggedIn()) {
          this.entryService.retrieveIncompleteEntries();
          this.entryService.retrieveSubmittedEntries();
        }
    }

  sortMeets() {
    this.openMeets.sort(this.dateCompare);
  }

  dateCompare(a, b) {
    if (a.deadline < b.deadline) {
      return -1;
    }
    if (a.deadline > b.deadline) {
      return 1;
    }
    return 0;
  }

}
