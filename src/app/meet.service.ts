import {Injectable} from '@angular/core';
import {Meet} from './models/meet';
import {HttpClient} from '@angular/common/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import * as moment from 'moment';
import {EnvironmentSpecificService} from "./environment-specific.service";
import {EnvSpecific} from "./models/env-specific";

@Injectable()
export class MeetService {

  api: string;

    meets: Meet[];
    meetsChanged = new Subject<Meet[]>();

    constructor(private http: HttpClient,
                private envSpecificSvc: EnvironmentSpecificService) {

      console.log(this.envSpecificSvc);

      if (this.envSpecificSvc.envSpecific == null) {
        this.envSpecificSvc.loadEnvironment();

        this.envSpecificSvc.subscribe(this, () => {
          this.api = this.envSpecificSvc.envSpecific.api;
          this.init();
        });

      } else {
        this.api = this.envSpecificSvc.envSpecific.api;
        this.init();
      }


    }

    init() {

      this.getMeetsFromLocal();

        const year = (new Date()).getFullYear();

        this.http.get<Meet[]>(this.api + 'meets?year=' + year)
            .subscribe(data => {
                console.log('got meets');
                    this.meets = data;
                    this.meetsChanged.next(this.meets.slice());
                    // Store meet data
                    localStorage.setItem('meets', JSON.stringify({data}));
                },
                err => {
                    console.log('Meet service error:');
                    console.log(err);
                });

    }

    getMeetsFromLocal() {
      let meetsStore;
      if (meetsStore = localStorage.getItem('meets')) {
        const meetData = JSON.parse(meetsStore);
        this.meets = meetData.data;

        this.meetsChanged.next(this.meets.slice());
      }
    }

    getMeets(): Meet[] {
        return this.meets;
    }

    getMeet(meet_id: number): Meet {
        if (this.meets) {
          return this.meets.find(x => x.id === meet_id, 10);
        } else {
          this.getMeetsFromLocal();
          if (this.meets) {
            return this.meets.find(x => x.id === meet_id, 10);
          } else {
            return null;
          }
        }
        return null;
    }

    getOpenMeets() {

        const meetsArray = [];

        if (this.meets) {
            this.meets.forEach((meet) => {
                const closedstart = moment(meet.deadline, 'YYYY-MM-DD', true).add(1, 'days');

                // Is the deadline expired?
                if (moment() < closedstart) {
                    if (meet.status === 1) {
                        meetsArray.push(meet);
                    }
                }
            });
        }

        return meetsArray;
    }

    getFutureMeets() {

        const meetsArray = [];

        if (this.meets) {
            this.meets.forEach((meet) => {
                const startdate = moment(meet.startdate, 'YYYY-MM-DD', true);

                if (moment() <= startdate) {
                    meetsArray.push(meet);
                }
            });
        }

        return meetsArray;
    }

    getPastMeets() {

        const meetsArray = [];

        if (this.meets) {
            this.meets.forEach((meet) => {
                const startdate = moment(meet.startdate, 'YYYY-MM-DD', true);

                if (moment() >= startdate) {
                    meetsArray.push(meet);
                }
            });
        }

        return meetsArray.reverse();

    }
}
