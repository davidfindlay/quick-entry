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
    futureMeets: Meet[];
    pastMeets: Meet[];
    meetSub;

    constructor(private meetService: MeetService) {
    }

    ngOnInit() {

        this.meetSub = this.meetService.meetsChanged
            .subscribe((meets: Meet[]) => {
                this.openMeets = this.meetService.getOpenMeets();
                this.futureMeets = this.meetService.getFutureMeets();
                this.pastMeets = this.meetService.getPastMeets();

                console.log('Length: ' + this.openMeets.length);
        });

    }

}
