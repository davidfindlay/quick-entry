import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {DateTime} from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class EmergencyContactsService {

  constructor(private http: HttpClient) { }

  getEmergencyContactsFromMeetEntries(meetId) {
    return new Observable(subscriber => {

      const entries = [];

      this.http.get(environment.api + 'meet_entries/' + meetId).subscribe((res: any) => {
        for (const entry of res.meet_entries) {

          let phoneNumber = '';
          let emailAddress = '';
          let contactName = '';
          let updatedAt;

          if (entry.member && entry.member.emergency) {
            contactName = entry.member.emergency.surname + ', ' + entry.member.emergency.firstname;
            updatedAt = DateTime.fromISO(entry.member.emergency.updated_at);
            if (entry.member.emergency.phone) {
              phoneNumber = entry.member.emergency.phone.phonenumber;
            }
            if (entry.member.emergency.email) {
              emailAddress = entry.member.emergency.email.address;
            }
          }

          const entryRow = {
            meet_entries_id: entry.id,
            member_name: entry.member.surname + ', ' + entry.member.firstname,
            member_number: entry.member.number,
            club_code: entry.club.code,
            club_name: entry.club.clubname,
            contact_name: contactName,
            contact_phone: phoneNumber,
            contact_email: emailAddress,
            last_updated: updatedAt
          }
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
