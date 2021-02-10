import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeetAdministrationService {

  constructor(private http: HttpClient) { }

  addMeetDate(meetDetails: any) {
    return this.http.post(environment.api + 'meets', meetDetails);
  }

}
