import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {DateTime} from 'luxon';
import {HttpClient} from '@angular/common/http';
import {CurrencyPipe} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EntryListService {

  constructor(private http: HttpClient,
              private currencyPipe: CurrencyPipe) {
  }

  getMeetEntriesList(meetId) {
    return new Observable(subscriber => {

      const entries = [];

      this.http.get(environment.api + 'meet_entries/' + meetId).subscribe((res: any) => {
        for (const entry of res.meet_entries) {

          let phoneNumber = '';
          let emailAddress = '';
          let updatedAt;

          if (entry.member) {
            updatedAt = DateTime.fromISO(entry.member.updated_at);
            if (entry.member.phones && entry.member.phones.length > 0) {

              entry.member.phones.sort((a, b) => (a.id < b.id) ? 1 : ((b.id < a.id) ? -1 : 0))

              phoneNumber = entry.member.phones[0].phonenumber;
            }
            if (entry.member.emails && entry.member.emails.length > 0) {
              entry.member.emails.sort((a, b) => (a.id < b.id) ? 1 : ((b.id < a.id) ? -1 : 0))
              emailAddress = entry.member.emails[0].address;
            }
          }

          const classifications = [];
          if (entry.disability_s !== undefined && entry.disability_s !== null) {
            classifications.push(entry.disability_s.classification);
          }
          if (entry.disability_sb !== undefined && entry.disability_sb !== null) {
            classifications.push(entry.disability_sb.classification);
          }
          if (entry.disability_sm !== undefined && entry.disability_sm !== null) {
            classifications.push(entry.disability_sm.classification);
          }
          const classifications_text = classifications.join(' - ');

          const ex_gst = entry.cost - (entry.cost / 11);
          const inc_gst = entry.cost;

          let numEvents = 0;
          if (entry.events !== undefined && entry.payments !== null) {
            for (let x = 0; x < entry.events.length; x++) {
              if (entry.events[x].cancelled !== undefined && entry.events[x].cancelled !== null && entry.events[x].cancelled === 0) {
                numEvents++;
              }
            }
          }

          let status = 'n/a';
          if (entry.status !== undefined && entry.status !== null && entry.status.length > 0) {

            // Sort statuses
            const statusRows = entry.status;
            statusRows.sort((a, b) => (a.id < b.id) ? 1 : ((b.id < a.id) ? -1 : 0));

            const finalStatus = statusRows[0];

            if (finalStatus.status !== undefined && finalStatus.status !== null) {
              status = finalStatus.status.label;
            }
          }

          let paid = 0;
          if (entry.payments !== undefined && entry.payments !== null) {
            for (let x = 0; x < entry.payments.length; x++) {
              if (entry.payments[x].amount !== undefined && entry.payments[x].amount !== null) {
                paid += entry.payments[x].amount;
              }
            }
          }

          const entryRow = {
            meet_entries_id: entry.id,
            member_name: entry.member.surname + ', ' + entry.member.firstname,
            member_number: entry.member.number,
            club_code: entry.club.code,
            club_name: entry.club.clubname,
            classification: classifications_text,
            entry_status: status,
            ex_gst: this.currencyFormatter(ex_gst),
            inc_gst: this.currencyFormatter(inc_gst),
            paid: this.currencyFormatter(paid),
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

  getPendingEntries(meetId) {

    return new Observable(subscriber => {

      const pendingEntries = [];

      this.http.get(environment.api + 'pending_entries/' + meetId).subscribe((entries: any) => {
        if (entries.success !== undefined && entries.success !== null && entries.success !== false) {
          for (const pendingEntry of entries.pending_entries) {
            if (!pendingEntry.finalised_at && pendingEntry.status_id !== 12 && pendingEntry.status_id !== 11) {

              const entryData = pendingEntry.entrydata;

              const entryDetails = {
                pending_id: pendingEntry.id,
                entrant_name: null,
                club_code: null,
                club_name: null,
                entry_status: 'n/a',
                pending_reason: pendingEntry.pending_reason,
                inc_gst: null,
                paid: null
              };

              if (pendingEntry.status) {
                entryDetails.entry_status = pendingEntry.status.label;
              }

              if (entryData.entrantDetails) {
                entryDetails.entrant_name = entryData.entrantDetails.entrantSurname + ', ' + entryData.entrantDetails.entrantFirstName;
              }

              if (entryData.membershipDetails) {
                entryDetails.club_code = entryData.membershipDetails.club_code;
                entryDetails.club_name = entryData.membershipDetails.club_name;
              }

              pendingEntries.push(entryDetails);
            }
          }
        }

        subscriber.next(pendingEntries);
        subscriber.complete();
      }, (err) => {
        subscriber.error(err);
        subscriber.complete();
      });
    });

  }

  currencyFormatter(value) {
    return this.currencyPipe.transform(value);
  }
}
