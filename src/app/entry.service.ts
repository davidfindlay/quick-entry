import {Injectable} from '@angular/core';
import {Entry} from './models/entry';
import {MembershipDetails} from './models/membership-details';
import {MedicalDetails} from './models/medical-details';
import {MemberHistoryService} from './member-history.service';
import {Observable, Subject} from 'rxjs';
import {EntryEvent} from './models/entryevent';
import {MeetService} from './meet.service';
import {HttpClient} from '@angular/common/http';
import {PaymentOption} from './models/paymentoption';
import {IncompleteEntry} from './models/incomplete_entry';

import { environment } from '../environments/environment';

@Injectable()
export class EntryService {
  entries: Entry[] = [];
  entriesChanged = new Subject();
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
        discipline: meetEvent.discipline,
        distance: meetEvent.distance,
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


      return true;
    }

    console.log('Couldn\'t find entry');

    return false;
  }

  getIndividualEventCount(meetEntry) {
    let eventCount = 0;
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

        if (numIndividualEvents >= this.meetService.getMeet(currentEntry.meetId).maxevents) {
          const disabledEvents = this.meetService.getEventIds(meetId).filter(n => !this.getEnteredEventIds(currentEntry).includes(n));
          console.log(disabledEvents);
          // const disabledEvents = this.meetService.getEventIds(meetId);
          observer.next(disabledEvents);
        } else {
          observer.next([]);
        }

      })
    });
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

    return this.http.post(environment.api + 'entry_incomplete', incompleteEntry).subscribe((entry: IncompleteEntry) => {
      const localEntry = this.getEntry(meetEntry.meetId);
      localEntry.incompleteId = entry.id;
      console.log(localEntry);
      this.storeEntries();
    });
  }

  finalise(meetEntry) {
    console.log('finalise');
    return this.http.post(environment.api + 'entry_finalise/' + meetEntry.incompleteId, {}).subscribe((entry: any) => {
      console.log(entry);
    });
  }

}
