import { Injectable } from '@angular/core';
import {MeetEntryStatusCode} from './models/meet-entry-status-code';
import {of} from 'rxjs/internal/observable/of';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetEntryStatusService {

  statusCodes: MeetEntryStatusCode[];

  constructor(private http: HttpClient) { }

  getStatus(statusCode: number) {
    if (this.statusCodes !== undefined && this.statusCodes !== null && this.statusCodes.length > 0) {
      return of(this.findStatusByCode(statusCode));
    } else {
      return new Observable<MeetEntryStatusCode>((observer) => {
        this.http.get(environment.api + 'meet_entry_status_list').subscribe((statuses: MeetEntryStatusCode[]) => {
          this.statusCodes = statuses;
          observer.next(this.findStatusByCode(statusCode));
        })
      });
    }
  }

  findStatusByCode(statusCode) {
    const code = this.statusCodes.filter(x => x.id === statusCode);
    if (code !== null && code.length === 1) {
      return code[0];
    } else {
      return null;
    }
  }
}
