import { Injectable } from '@angular/core';
import {Entry} from "./models/entry";
import {MembershipDetails} from "./models/membership-details";
import {MedicalDetails} from "./models/medical-details";
import {MemberHistoryService} from "./member-history.service";
import {Subject} from "rxjs";
import {EntryEvent} from "./models/entryevent";

@Injectable()
export class EntryService {

  entries: Entry[] = [];
  entriesChanged = new Subject();
  membershipDetails: MembershipDetails;

  constructor(private memberHistoryService: MemberHistoryService) {
    this.loadSavedEntries();
  }

  storeEntries() {
    localStorage.setItem('entries', JSON.stringify(this.entries));
  }

  addEntry(entry: Entry) {
    this.entries.push(entry);
    this.storeEntries();
  }

  getEntry(meetId: number) {
    if (this.entries) {
      return this.entries.find(x => x.meetId === meetId, 10);
    }
    return null;
  }

  loadSavedEntries() {
    // TODO: load entries from local storage

  }

  setMemberDetails(meetId: number, membershipDetails: MembershipDetails) {
    if (this.entries) {
      const entry = this.entries.find(x => x.meetId === meetId, 10);
      if (entry) {
        entry.membershipDetails = membershipDetails;

        // Get the member history cached
        if (membershipDetails.member_number != null) {
          // TODO: add further screening here including checking the name matches the number
          this.memberHistoryService.downloadHistory(parseInt(membershipDetails.member_number, 10));
        }

        this.storeEntries();

      } else {
        console.error('Unable to find entry');
      }
    }
    console.log(this.entries);
  }

  setMedicalDetails(meetId: number, medicalDetails: MedicalDetails) {
    if (this.entries) {
      const entry = this.entries.find(x => x.meetId === meetId, 10);
      if (entry) {
        entry.medicalDetails = medicalDetails;
        this.storeEntries();
      } else {
        console.error('Unable to find entry');
      }
    }
    console.log(this.entries);
  }

  addEventEntry(meetEvent) {
    if (this.entries) {
      const entry = this.entries.find(x => x.meetId === meetEvent.meet_id, 10);
      if (entry) {
        if (entry.entryEvents === undefined) {
          entry.entryEvents = [];
        }
        entry.entryEvents.push(<EntryEvent>{
          id: null,
          entry_id: null,
          event_id: meetEvent.id,
          discipline: meetEvent.discipline,
          distance: meetEvent.distance,
          classification: null,
          seedtime: null
        });
        this.entriesChanged.next(this.entries);
      } else {
        console.error('Unable to add event to meet entry')
      }
    }
  }

  updateEventEntry(meetEvent, seedtime) {

  }

}
