import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MeetService} from '../../meet.service';
import {forkJoin, Observable} from 'rxjs';
import {EntryListService} from './entry-list.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient,
              private entryListService: EntryListService,
              private meetService: MeetService) { }

  getDashboardData(meetId) {
    return this.http.get(environment.api + 'meet/' + meetId + '/summary');
  }
}
