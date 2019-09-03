import {Injectable} from '@angular/core';
import {Entry} from './models/entry';
import {MembershipDetails} from './models/membership-details';
import {MedicalDetails} from './models/medical-details';
import {MemberHistoryService} from './member-history.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {EntryEvent} from './models/entryevent';
import {MeetService} from './meet.service';
import {HttpClient} from '@angular/common/http';
import {PaymentOption} from './models/paymentoption';
import {IncompleteEntry} from './models/incomplete_entry';

import {environment} from '../environments/environment';
import {MeetEntry} from './models/meet-entry';

@Injectable()
export class EntryService {
  entries: Entry[] = [];
  incompleteEntries: IncompleteEntry[] = [];
  submittedEntries: MeetEntry[] = [];
  entriesChanged = new BehaviorSubject<Entry[]>(this.entries);
  incompleteChanged = new BehaviorSubject<IncompleteEntry[]>(this.incompleteEntries);
  submittedChanged = new BehaviorSubject<MeetEntry[]>(this.submittedEntries);
  membershipDetails: MembershipDetails;

  constructor(private memberHistoryService: MemberHistoryService,
              private meetService: MeetService,
              private http: HttpClient) {

    this.loadSavedEntries();
  }

  storeEntries() {
    console.log('Stored entries');
    localStorage.setItem('entries', JSON.stringify(this.entries));
  }

  addEntry(entry: Entry) {
    this.deleteEntry(entry.meetId);
    this.entries.push(entry);
    this.storeEntries();
  }

  getEntry(meetId: number) {
    if (this.entries) {
      return this.entries.find(x => x.meetId === meetId, 10);
    }
    return null;
  }

  getIncompleteEntries(meetId: number) {
    if (this.incompleteEntries) {
      return this.incompleteEntries.find(x => x.meet_id === meetId);
    }
    return null;
  }

  retrieveIncompleteEntries() {
    this.http.get(environment.api + 'entry_incomplete').subscribe((incomplete: IncompleteEntry[]) => {
      this.incompleteEntries = incomplete;
      this.incompleteChanged.next(this.incompleteEntries);
    });
  }

  getSubmittedEntries(meetId: number) {
    if (this.submittedEntries) {
      return this.submittedEntries.find(x => x.meet_id === meetId);
    }
    return null;
  }

  retrieveSubmittedEntries() {
    this.http.get(environment.api + 'meet_entries').subscribe((entries: MeetEntry[]) => {
      this.submittedEntries = entries;
      this.submittedChanged.next(this.submittedEntries);
    });
  }

  loadSavedEntries() {
    // TODO: load entries from local storage
    const storedEntries = localStorage.getItem('entries');
    if (storedEntries !== null) {
      this.entries = JSON.parse(storedEntries);
    }
  }

  setMemberDetails(meetId: number, membershipDetails: MembershipDetails) {
    if (this.entries) {
      const entry = this.entries.find(x => x.meetId === meetId, 10);
      if (entry) {
        entry.membershipDetails = membershipDetails;

        console.log(membershipDetails);

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

  setPaymentOptions(meetId: number, paymentOptions: PaymentOption) {
    if (this.entries) {
      const entry = this.entries.find(x => x.meetId === meetId, 10);
      if (entry) {
        entry.paymentOptions = paymentOptions;
        this.storeEntries();
      } else {
        console.error('Unable to find entry');
      }
    }
    console.log(this.entries);
  }

  addEventEntry(meetEvent) {

    const entry = this.getEntry(meetEvent.meet_id);
    if (entry) {
      if (entry.entryEvents === undefined) {
        entry.entryEvents = [];
      }
      entry.entryEvents.push(<EntryEvent>{
        id: null,
        entry_id: null,
        program_no: (meetEvent.prognumber + meetEvent.progsuffix),
        event_id: meetEvent.id,
        discipline: meetEvent.event_discipline.discipline,
        distance: meetEvent.event_distance.distance,
        classification: null,
        seedtime: null
      });
      entry.validEvents = this.validateEntryEvents(entry);
      this.entriesChanged.next(this.entries);
    } else {
      console.error('Unable to add event to meet entry')
    }

  }

  removeEventEntry(meetEvent) {
    const entry = this.getEntry(meetEvent.meet_id);
    if (entry) {
      if (entry.entryEvents === undefined) {
        return;
      }

      // Remove the event from the events array
      // TODO: change to keep cancelled event but mark as cancelled
      entry.entryEvents = entry.entryEvents.filter(x => x.event_id !== meetEvent.id);

      // this.entries = this.entries.filter(x => x.meetId !== entry.meetId);
      // this.entries.push(entry);
      entry.validEvents = this.validateEntryEvents(entry);
      this.entriesChanged.next(this.entries);

    }
  }

  updateEventEntry(meetEvent, seedtime) {
    const entry = this.getEntry(meetEvent.meet_id);
    if (entry) {
      if (entry.entryEvents === undefined) {
        return;
      }

      const entryEvent = entry.entryEvents.filter(x => x.event_id === meetEvent.id);

      if (entryEvent.length === 1) {
        entryEvent[0].seedtime = seedtime;
      }

      // Check that entry is now valid with this seed time change
      entry.validEvents = this.validateEntryEvents(entry);
      this.storeEntries();
    }
  }

  /**
   *  Checks the meet entry complies with the rules
   */
  validateEntryEvents(meetEntry): boolean {

    const meetDetails = this.meetService.getMeet(meetEntry.meetId);

    const minIndividualEvents = 1;
    let maxIndividualEvents = 5;

    if (meetDetails !== undefined && meetDetails !== null) {
      maxIndividualEvents = meetDetails.maxevents;
    }

    const entry = this.getEntry(meetEntry.meetId);
    if (entry) {
      if (entry.entryEvents === undefined) {
        return false;
      }

      const eventCount = this.getIndividualEventCount(entry);

      if (eventCount < minIndividualEvents) {
        return false;
      }

      if (eventCount > maxIndividualEvents) {
        return false;
      }

      if (this.checkForNT(meetEntry)) {
        console.log('Disable form because of NT');
        return false;
      }

      return true;
    }

    console.log('Couldn\'t find entry');

    return false;
  }

  checkEvents(meet_id) {
    const meetEntry = this.getEntry(meet_id);
    meetEntry.validEvents = this.validateEntryEvents(meetEntry);
    console.log('Check events: ' + meetEntry.validEvents);
    this.entriesChanged.next(this.entries);
  }

  checkForNT(meetEntry) {
    const meetDetails = this.meetService.getMeet(meetEntry.meetId);

    for (const event of meetDetails.events) {
      if (event.times_required) {
        for (const eventEntry of meetEntry.entryEvents) {
          if (event.id === eventEntry.event_id) {
            if (eventEntry.seedtime === 0) {
              console.log('Event ' + event.prognumber + ' has disallowed 0 seedtime!');
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  getIndividualEventCount(meetEntry) {
    let eventCount = 0;

    // If no entry events yet return 0
    if (meetEntry.entryEvents === undefined || meetEntry.entryEvents === null || meetEntry.entryEvents.length === 0) {
      return 0;
    }

    const meetDetails = this.meetService.getMeet(meetEntry.meetId);

    for (const event of meetDetails.events) {
      if (event.legs === 1) {
        for (const eventEntry of meetEntry.entryEvents) {
          if (eventEntry.event_id === event.id) {
            eventCount++;
          }
        }
      }
    }

    return eventCount;
  }

  getEntryCost(meetEntry) {
    // TODO: Add additional rules
    const meetDetails = this.meetService.getMeet(meetEntry.meetId);
    if (meetDetails !== undefined && meetDetails !== null) {
      return meetDetails.meetfee;
    } else {
      return null;
    }
  }

  deleteEntry(meetId: number) {
    // TODO: if we've got an entry from this meet that is already submitted on the server don't delete it
    console.log('Delete entries to ' + meetId);
    this.entries = this.entries.filter(x => x.meetId !== meetId);
    console.log(this.entries);
    this.storeEntries();
  }

  clear() {
    console.log('Clear unsaved entries');
    this.entries = [];
    this.storeEntries();
  }

  getDisabledEventsSubscription(meetId) {
    return new Observable<number[]>((observer) => {
      this.entriesChanged.subscribe((changed: Entry[]) => {
        const currentEntry = changed.filter(x => x.meetId === meetId)[0];
        const numIndividualEvents = this.getIndividualEventCount(currentEntry);
        let disabledEvents = this.getBlockedEvents(currentEntry);

        if (numIndividualEvents >= this.meetService.getMeet(currentEntry.meetId).maxevents) {
          disabledEvents = disabledEvents.concat(this.meetService.getIndividualEventIds(meetId).filter(n => !this.getEnteredEventIds(currentEntry).includes(n)));
        }

        // console.log('Disable events: ' + disabledEvents);
        observer.next(disabledEvents);

      })
    });
  }

  getBlockedEvents(meetEntry: Entry): number[] {
    const blockedGroups = [];
    const blockedEvents = [];

    const meetDetails = this.meetService.getMeet(meetEntry.meetId);

    for (const group of meetDetails.groups) {
      const groupMax = group.max_choices;
      let groupCount = 0;

      for (const groupEvent of group.events) {
        if (meetEntry.entryEvents !== undefined && meetEntry.entryEvents !== null) {
          for (const entryEvent of meetEntry.entryEvents) {
            if (entryEvent.event_id === groupEvent.event_id) {
              groupCount++;
            }
          }
        }
      }

      if (groupCount >= groupMax) {
        blockedGroups.push(group);
      }
    }

    for (const group of blockedGroups) {
      for (const groupEvent of group.events) {
        blockedEvents.push(groupEvent.event_id);
      }
    }

    return blockedEvents;
  }

  getEnteredEventIds(meetEntry: Entry) {
    const eventIds = [];
    const events: EntryEvent[] = meetEntry.entryEvents;

    if (events !== undefined && events !== null) {
      for (const event of events) {
        eventIds.push(event.event_id);
      }
    }

    return eventIds;
  }

  storeIncompleteEntry(meetEntry) {
    const incompleteEntry = <IncompleteEntry>{
      meet_id: meetEntry.meetId,
      user_id: null,
      status_id: null,
      member_id: null,
      entrydata: meetEntry
    };

    console.log(incompleteEntry);

    return new Observable((observer) => {
      this.http.post(environment.api + 'entry_incomplete', incompleteEntry).subscribe((entry: IncompleteEntry) => {
        const localEntry = this.getEntry(meetEntry.meetId);
        localEntry.incompleteId = entry.id;
        console.log(localEntry);
        this.storeEntries();
        observer.next(localEntry);
      });
    });
  }

  finalise(meetEntry) {
    console.log('finalise');
    return this.http.post(environment.api + 'entry_finalise/' + meetEntry.incompleteId, {});
  }

  setStatus(meetEntry, status_id) {
    console.log('Set status to ' + status_id);
    meetEntry.status = status_id;
    this.storeEntries();
    this.entriesChanged.next(this.entries);
    console.log(this.entries);
  }

}
