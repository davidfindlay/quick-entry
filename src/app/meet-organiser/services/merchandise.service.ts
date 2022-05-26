import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MerchandiseService {

  constructor(private http: HttpClient) { }

  getMerchandiseSummary(meetId) {
    return this.http.get(environment.api + 'merchandise/' + meetId + '/summary', {});
  }

  getMealsFromMeetEntries(meetId) {
    return new Observable(subscriber => {

      const entries = [];

      this.http.get(environment.api + 'meet_entries/' + meetId).subscribe((res: any) => {
        for (const entry of res.meet_entries) {
          if (entry.meals > 0) {
            const entryRow = {
              meet_entries_id: entry.id,
              member_name: entry.member.surname + ', ' + entry.member.firstname,
              member_number: entry.member.number,
              club_code: entry.club.code,
              club_name: entry.club.clubname,
              status: entry.status_text,
              qty: entry.meals,
              comments: entry.meals_comments
            }
            entries.push(entryRow);
          }
        }
        subscriber.next(entries);
        subscriber.complete();
      }, (err) => {
        subscriber.error(err);
        subscriber.complete();
      });
    });
  }
}
