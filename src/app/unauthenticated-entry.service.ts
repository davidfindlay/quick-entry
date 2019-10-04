import { Injectable } from '@angular/core';
import {MeetEntry} from './models/meet-entry';
import {BehaviorSubject} from 'rxjs';
import {IncompleteEntry} from './models/incomplete_entry';

@Injectable({
  providedIn: 'root'
})
export class UnauthenticatedEntryService {

  unauthenticatedEntries: MeetEntry[] = [];
  unauthenticatedEntriesChanged = new BehaviorSubject<MeetEntry[]>(this.unauthenticatedEntries);

  unauthenticatedPendingEntries: IncompleteEntry[] = []
  unauthenticatedPendingEntriesChanged = new BehaviorSubject<IncompleteEntry[]>(this.unauthenticatedPendingEntries);

  constructor() {
    this.loadStoredEntries();
  }

  loadStoredEntries() {
    const storedEntries = localStorage.getItem('unauthenticated-entries');
    const storedPending = localStorage.getItem('unauthenticated-pending-entries');
    if (storedEntries !== null) {
      this.unauthenticatedEntries = JSON.parse(storedEntries);
      this.unauthenticatedEntriesChanged.next(this.unauthenticatedEntries);
    }
    if (storedPending !== null) {
      this.unauthenticatedPendingEntries = JSON.parse(storedPending);
      this.unauthenticatedPendingEntriesChanged.next(this.unauthenticatedPendingEntries);
    }
  }

  addMeetEntry(meetEntry) {
    const entryCode = meetEntry.code;
    const updatedEntries = this.unauthenticatedEntries.filter(x => x.code !== entryCode);
    updatedEntries.push(meetEntry);
    this.unauthenticatedEntries = updatedEntries;
    this.storeEntries();
  }

  addPendingEntry(meetEntry) {
    const entryCode = meetEntry.code;
    const updatedPendingEntries = this.unauthenticatedPendingEntries.filter(x => x.code !== entryCode);
    updatedPendingEntries.push(meetEntry);
    this.unauthenticatedPendingEntries = updatedPendingEntries;
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
    localStorage.setItem('unauthenticated-pending-entries', JSON.stringify(this.unauthenticatedPendingEntries));
    this.unauthenticatedEntriesChanged.next(this.unauthenticatedEntries);
    this.unauthenticatedPendingEntriesChanged.next(this.unauthenticatedPendingEntries);
  }

  getEntriesByMeet(meet_id) {
    const entries = this.unauthenticatedEntries.filter(x => x.meet_id === meet_id);
    return entries;
  }

  getPendingByMeet(meet_id) {
    const pending = this.unauthenticatedPendingEntries.filter(x => x.meet_id === meet_id);
    return pending;
  }

}
