import {Component, OnInit, Input} from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-meet-list-item',
    templateUrl: './meet-list-item.component.html',
    styleUrls: ['./meet-list-item.component.css']
})

export class MeetListItemComponent implements OnInit {

    @Input() meet;
    @Input() index: number;

    constructor() {
    }

    ngOnInit() {

        console.log(this.meet);

    }

    // Returns pretty formatted date of meet
    getMeetDates(): string {

        let formattedDate = '';
        let day1 = '';
        let lastday = '';

        this.meet.sessions.forEach(session => {
                if (day1 === '') {
                    day1 = session.date;
                }

                if (lastday === '') {
                    lastday = session.date;
                }

                if (session.date < day1) {
                    day1 = session.date;
                }

                if (session.date > lastday) {
                    lastday = session.date;
                }
            }
        );

        if (day1 === lastday) {
            formattedDate = moment(day1).format('dddd') + ' ' + moment(day1).format('LL');
        } else {
            formattedDate = moment(day1).format('dddd') + ' '
                + moment(day1).format('LL') + ' to '
                + moment(lastday).format('dddd') + ' '
                + moment(lastday).format('LL');
        }

        return(formattedDate);

    }

    // Returns pretty formatted deadline of meet
    getMeetDeadline(): string {

        const formattedDeadline = moment(this.meet.close).format('dddd') + ' ' + moment(this.meet.close).format('LL');

        return(formattedDeadline);

    }

}
