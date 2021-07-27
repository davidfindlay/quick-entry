import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClubAdministrationService {

  constructor(private http: HttpClient) { }

  addAccess(clubId, memberId) {
    return this.http.post(environment.api + 'club/' + clubId + '/access', { member_id: memberId });
  }

  removeAccess(clubId, memberId) {
    return this.http.delete(environment.api + 'club/' + clubId + '/access/' + memberId);
  }

  updateClub(clubId, clubDetails) {
    return this.http.put(environment.api + 'club/' + clubId, clubDetails);
  }
}
