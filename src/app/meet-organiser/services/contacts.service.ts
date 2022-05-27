import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {DateTime} from 'luxon';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private http: HttpClient) { }

  getContactsFromMeetEntries(meetId) {
    return new Observable(subscriber => {

      const entries = [];

      this.http.get(environment.api + 'meet_entries/' + meetId).subscribe((res: any) => {
        for (const entry of res.meet_entries) {

          let phoneNumber = '';
          let emailAddress = '';
          let updatedAt;

          if (entry.member) {
            console.log(entry.member);
            updatedAt = DateTime.fromISO(entry.member.updated_at);
            if (entry.member.phones && entry.member.phones.length > 0) {

              entry.member.phones.sort((a, b) => (a.id < b.id) ? 1 : ((b.id < a.id) ? -1 : 0))
              console.log(entry.member.phones)

              phoneNumber = entry.member.phones[0].phonenumber;
            }
            if (entry.member.emails && entry.member.emails.length > 0) {
              entry.member.emails.sort((a, b) => (a.id < b.id) ? 1 : ((b.id < a.id) ? -1 : 0))
              console.log(entry.member.emails);
              emailAddress = entry.member.emails[0].address;
            }
          }

          const entryRow = {
            meet_entries_id: entry.id,
            member_name: entry.member.surname + ', ' + entry.member.firstname,
            member_number: entry.member.number,
            club_code: entry.club.code,
            club_name: entry.club.clubname,
            contact_phone: phoneNumber,
            contact_email: emailAddress,
            last_updated: updatedAt
          }
          console.log(entryRow);
          entries.push(entryRow);
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
