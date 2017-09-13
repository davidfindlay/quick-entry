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

    constructor(private meetService: MeetService) {
    }

    ngOnInit() {

        this.meetService.getMeets().subscribe(
            meets => {
                this.meets = meets;
                console.log(this.meets);
            });
    }

}
