import {Component, Input, OnInit} from '@angular/core';
import {MeetService} from '../meet.service';
import {Meet} from '../models/meet';

@Component({
    selector: 'app-meet-list',
    templateUrl: './meet-list.component.html',
    styleUrls: ['./meet-list.component.css']
})
export class MeetListComponent implements OnInit {

    openMeets: Meet[];
    meetSub;

    constructor(private meetService: MeetService) {
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

    }

  sortMeets() {
    this.openMeets.sort(this.dateCompare);
  }

  dateCompare(a, b) {
    if (a.deadline < b.deadline) {
      return 1;
    }
    if (a.deadline > b.deadline) {
      return -1;
    }
    return 0;
  }

}
