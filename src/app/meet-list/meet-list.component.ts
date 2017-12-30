import {Component, OnInit} from '@angular/core';
import {MeetService} from '../meet.service';
import {Meet} from '../models/meet';

@Component({
    selector: 'app-meet-list',
    templateUrl: './meet-list.component.html',
    styleUrls: ['./meet-list.component.css']
})
export class MeetListComponent implements OnInit {

    meets: Meet[];
    meetSub;

    constructor(private meetService: MeetService) {
    }

    ngOnInit() {

        this.meets = this.meetService.getMeets();

        this.meetSub = this.meetService.meetsChanged
            .subscribe((meets: Meet[]) => {
            this.meets = meets;
        });

        console.log('Meet List Component has: ' + this.meets);

    }

}
