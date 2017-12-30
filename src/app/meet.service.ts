import {Injectable} from '@angular/core';
import {Meet} from './models/meet';
import {HttpClient} from '@angular/common/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Subject} from "rxjs/Subject";

@Injectable()
export class MeetService {

    meets: Meet[];
    meetsChanged = new Subject<Meet[]>();

    constructor(private http: HttpClient) {
        this.init();
    }

    init() {

        console.log('Initialising meet service');

        this.http.get<Meet[]>('http://localhost:8888/swimman/api/meets.php')
            .subscribe(data => {
                    this.meets = data;
                    this.meetsChanged.next(this.meets.slice());
                    console.log(this.meets);
                },
                err => {
                    console.log('Meet service error:' + err);
                });

    }

    getMeets(): Meet[] {
        return this.meets;

    }
}
