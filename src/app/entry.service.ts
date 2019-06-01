import { Injectable } from '@angular/core';
import {Entry} from "./models/entry";
import {MembershipDetails} from "./models/membership-details";
import {MedicalDetails} from "./models/medical-details";

@Injectable()
export class EntryService {

  entries: Entry[] = [];
  memberershipDetails: MembershipDetails;

  constructor() {
    this.loadSavedEntries();
  }

  addEntry(entry: Entry) {
    this.entries.push(entry);
  }

  getEntry(meetId: number) {
    if (this.entries) {
      return this.entries.find(x => x.id === meetId, 10);
    }
    return null;
  }

  loadSavedEntries() {
    // TODO: load entries from local storage

  }

  setMemberDetails(meetId: number, memberershipDetails: MembershipDetails) {
    if (this.entries) {
      const entry = this.entries.find(x => x.meetId === meetId, 10);
      if (entry) {
        entry.membershipDetails = memberershipDetails;
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
      } else {
        console.error('Unable to find entry');
      }
    }
    console.log(this.entries);
  }
  

}
