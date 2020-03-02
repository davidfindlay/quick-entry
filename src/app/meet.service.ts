import {Injectable} from '@angular/core';
import {Meet} from './models/meet';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import * as moment from 'moment';
import {MeetEvent} from './models/meet-event';
import {EntryEvent} from './models/entryevent';

import { environment } from '../environments/environment';
import {Subscription} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable()
export class MeetService {

  meets: Meet[];
  meetsChanged = new Subject<Meet[]>();

  constructor(private http: HttpClient) {
    this.init();
  }

  init() {

    this.getMeetsFromLocal();

    const year = (new Date()).getFullYear();

    this.http.get<Meet[]>(environment.api + 'meets?year=' + year)
      .subscribe(data => {
          console.log('got meets');
          this.meets = data;
          this.meetsChanged.next(this.meets.slice());
          // Store meet data
          localStorage.setItem('meets', JSON.stringify(data));
        },
        err => {
          console.log('Meet service error:');
          console.log(err);
        });

  }

  getMeetsFromLocal() {
    const meetsStore = localStorage.getItem('meets');
    if (meetsStore !== undefined && meetsStore !== null) {
      const meetData = JSON.parse(meetsStore);
      this.meets = meetData;

      console.log(this.meets);

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

  loadMeetDetails(meet_id: number) {
    this.http.get(environment.api + 'meets/' + meet_id).subscribe((result: Meet) => {

      if (this.meets === undefined || this.meets === null) {
        // If meets is for some reason undefined or null, just put this one in
        this.meets = [];
        this.meets.push(result);
      } else {
        const index = this.meets.indexOf(this.getMeet(meet_id));

        if (index !== -1) {
          this.meets[index] = result;
        }
      }
      localStorage.setItem('meets', JSON.stringify(this.meets));
      this.meetsChanged.next(this.meets);
    });
  }

  getMeetDetails(meet_id) {
    return new Observable<Meet>((observer) => {
      this.loadMeetDetails(meet_id);
      this.meetsChanged.subscribe(changed => {
        observer.next(this.getMeet(meet_id));
      });
    });
  }

  getOpenMeets() {

    const meetsArray = [];

    if (this.meets) {
      this.meets.forEach((meet) => {
        const closedstart = moment(meet.deadline, 'YYYY-MM-DD', true).add(1, 'days');

        // Is the deadline expired?
        if (moment() < closedstart) {
          if (meet.status === 1 || meet.status === 2) {
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

  getEventIds(meetId): number[] {
    const meet = this.getMeet(meetId);
    const eventIds = [];

    for (const meetEvent of meet.events) {
      eventIds.push(meetEvent.id);
    }

    return eventIds;
  }

  getIndividualEventIds(meetId): number[] {
    const meet = this.getMeet(meetId);
    const eventIds = [];

    for (const meetEvent of meet.events) {
      if (meetEvent.legs === 1) {
        eventIds.push(meetEvent.id);
      }
    }

    return eventIds;
  }

  getAllMeets():  Observable<Meet[]> {
    return this.http.get<Meet[]>(environment.api + 'meets/all');
  }

  createMerchandise(merchandiseItem): Observable<any> {
    console.log('createMerchandise');
    console.log(merchandiseItem);
    return this.http.post(environment.api + 'merchandise/create', merchandiseItem);
  }

  updateMerchandise(merchandiseItem): Observable<any> {
    console.log('updateMerchandise');
    console.log(merchandiseItem);
    return this.http.put(environment.api + 'merchandise/' + merchandiseItem.id, merchandiseItem);
  }

  deleteMerchandise(merchandiseItemId): Observable<any> {
    console.log('deleteMerchandise: ' + merchandiseItemId);
    return this.http.delete(environment.api + 'merchandise/' + merchandiseItemId);
  }

  addMerchandiseImage(image: File, imageData): Observable<any> {
    console.log('addMerchandiseImage');
    const formData: FormData = new FormData();
    formData.append('image', image, image.name);
    formData.append('imageData', JSON.stringify(imageData))
    return this.http.post(environment.api + 'merchandise/' + imageData.meet_merchandise_id + '/addImage', formData);
  }

  deleteMerchandiseImage(merchandiseImageId) {
    console.log('deleteMerchandiseImage: ' + merchandiseImageId);
    return this.http.delete(environment.api + 'merchandise/images/' + merchandiseImageId);
  }

  getMerchandiseOrders(meetId) {
    return this.http.get(environment.api + 'meet_entry_orders/' + meetId);
  }
}
