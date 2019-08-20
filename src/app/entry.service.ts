import {Injectable} from '@angular/core';
import {Entry} from './models/entry';
import {MembershipDetails} from './models/membership-details';
import {MedicalDetails} from './models/medical-details';
import {MemberHistoryService} from './member-history.service';
import {Subject} from 'rxjs';
import {EntryEvent} from './models/entryevent';
import {MeetService} from './meet.service';

@Injectable()
export class EntryService {

  entries: Entry[] = [];
  entriesChanged = new Subject();
  membershipDetails: MembershipDetails;

  constructor(private memberHistoryService: MemberHistoryService,
              private meetService: MeetService) {
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
      console.log(entry);
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
      console.log('Remove ');
      console.log(meetEvent);
      entry.entryEvents = entry.entryEvents.filter(x => x.event_id !== meetEvent.id);
      console.log(entry.entryEvents);

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
      console.log(entry.entryEvents);

      if (entryEvent.length === 1) {
        entryEvent[0].seedtime = seedtime;
      }
    }
  }

  /**
   *  Checks the meet entry complies with the rules
   */
  validateEntryEvents(meetEntry): boolean {

    const meetDetails = this.meetService.getMeet(meetEntry.meet_id);

    const minIndividualEvents = 1;
    let maxIndividualEvents = null;

    if (meetDetails !== undefined && meetDetails !== null) {
      maxIndividualEvents = meetDetails.maxevents;
    }

    const entry = this.getEntry(meetEntry.meetId);
    if (entry) {
      if (entry.entryEvents === undefined) {
        console.log('No entry events found');
        return false;
      }

      // TODO: actually separate individual events
      if (entry.entryEvents.length < minIndividualEvents) {
        console.log('Less than minimum individual events');
        return false;
      }

      // TODO: actually separate individual events
      if (maxIndividualEvents !== null) {
        if (entry.entryEvents.length > maxIndividualEvents) {
          console.log('More than maximum individual events');
          return false;
        }
      }

      return true;
    }


    console.log('Couldn\'t find entry');

    return false;
  }

  deleteEntry(meetId: number) {
    // TODO: if we've got an entry from this meet that is already submitted on the server don't delete it
    console.log('Delete entries to ' + meetId);
    this.entries = this.entries.filter(x => x.meetId !== meetId);
    console.log(this.entries);
    this.storeEntries();
  }

}
