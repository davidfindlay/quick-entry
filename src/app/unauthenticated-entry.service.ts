import { Injectable } from '@angular/core';
import {MeetEntry} from './models/meet-entry';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnauthenticatedEntryService {

  unauthenticatedEntries: MeetEntry[] = [];
  unauthenticatedEntriesChanged = new BehaviorSubject<MeetEntry[]>(this.unauthenticatedEntries);

  constructor() {
    this.loadStoredEntries();
  }

  loadStoredEntries() {
    const storedEntries = localStorage.getItem('unauthenticated-entries');
    if (storedEntries !== null) {
      this.unauthenticatedEntries = JSON.parse(storedEntries);
      this.unauthenticatedEntriesChanged.next(this.unauthenticatedEntries);
    }
  }

  addMeetEntry(meetEntry) {
    const entryCode = meetEntry.code;
    const updatedEntries = this.unauthenticatedEntries.filter(x => x.code !== entryCode);
    updatedEntries.push(meetEntry);
    this.unauthenticatedEntries = updatedEntries;
    this.storeEntries();
  }

  delete(entryCode) {
    const updatedEntries = this.unauthenticatedEntries.filter(x => x.code !== entryCode);
    this.unauthenticatedEntries = updatedEntries;
    this.storeEntries();
  }

  clear() {
    this.unauthenticatedEntries = [];
    this.storeEntries();
  }

  storeEntries() {
    localStorage.setItem('unauthenticated-entries', JSON.stringify(this.unauthenticatedEntries));
    this.unauthenticatedEntriesChanged.next(this.unauthenticatedEntries);
  }

  getEntriesByMeet(meet_id) {
    const entries = this.unauthenticatedEntries.filter(x => x.meet_id === meet_id);
    return entries;
  }

}
