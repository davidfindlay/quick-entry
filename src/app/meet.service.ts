import {Injectable} from '@angular/core';
import {Meet} from './models/meet';
import {HttpClient} from '@angular/common/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import * as moment from 'moment';

@Injectable()
export class MeetService {

    meets: Meet[];
    meetsChanged = new Subject<Meet[]>();

    constructor(private http: HttpClient) {
        this.init();
    }

    init() {

        let meetsStore;
        if (meetsStore = localStorage.getItem('meet')) {
            this.meets = JSON.parse(meetsStore);
            this.meetsChanged.next(this.meets.slice());
            console.log('Got initial set of meets from storage');
        }

        this.http.get<Meet[]>('http://localhost:8888/swimman/api/meets.php')
            .subscribe(data => {

                    this.meets = data;
                    this.meetsChanged.next(this.meets.slice());

                    console.log('got meet data, storing');

                    // Store meet data
                    localStorage.setItem('meets', JSON.stringify({data}));

                },
                err => {
                    console.log('Meet service error:' + err);
                });

    }

    getMeets(): Meet[] {
        return this.meets;
    }

    getOpenMeets() {

        const meetsArray = [];

        this.meets.forEach((meet) => {
            const closedstart = moment(meet.deadline, 'YYYY-MM-DD', true).add(1, 'days');

            // Is the deadline expired?
            if (moment() < closedstart) {

                console.log('Meet has ' + meet.events.length + ' events.');
                if (meet.status === 1) {
                    meetsArray.push(meet);
                }
            }
        });

        return meetsArray;
    }

    getFutureMeets() {

        const meetsArray = [];

        this.meets.forEach((meet) => {
            const startdate = moment(meet.startdate, 'YYYY-MM-DD', true);

            if (moment() <= startdate) {
                meetsArray.push(meet);
            }
        });

        return meetsArray;
    }

    getPastMeets() {

        const meetsArray = [];

        this.meets.forEach((meet) => {
            const startdate = moment(meet.startdate, 'YYYY-MM-DD', true);

            if (moment() >= startdate) {
                meetsArray.push(meet);
            }
        });

        return meetsArray.reverse();

    }
}
