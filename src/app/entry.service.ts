import {Injectable} from '@angular/core';
import {EntryFormObject} from './models/entry-form-object';
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
import {AuthenticationService} from './authentication';
import {UserService} from './user.service';
import {EntrantDetails} from './models/entrant-details';

@Injectable()
export class EntryService {
  // entries: EntryFormObject[] = [];
  incompleteEntries: IncompleteEntry[] = [];
  pendingEntries: IncompleteEntry[] = [];
  submittedEntries: MeetEntry[] = [];

  pendingChanged = new BehaviorSubject<IncompleteEntry[]>(this.pendingEntries);
  incompleteChanged = new BehaviorSubject<IncompleteEntry[]>(this.incompleteEntries);
  submittedChanged = new BehaviorSubject<MeetEntry[]>(this.submittedEntries);
  membershipDetails: MembershipDetails;

  constructor(private memberHistoryService: MemberHistoryService,
              private meetService: MeetService,
              private http: HttpClient,
              private authService: AuthenticationService,
              private userService: UserService) {

    this.loadSavedEntries();
  }

  storeEntries() {
    if (this.userService.getUsers() === null) {
      console.log('Stored entries locally');
      localStorage.setItem('entries', JSON.stringify(this.incompleteEntries));
    }
  }

  addEntry(entry: EntryFormObject) {
    // this.deleteEntry(entry.meetId);

    return new Observable((observer) => {
      // If logged in store to server
      if (this.userService.getUsers() !== null) {
        console.log('User is logged in, store to server');

        this.storeIncompleteEntry(entry).subscribe((updated: IncompleteEntry) => {
          console.log('store incomplete');
          console.log(this.incompleteEntries);
          this.incompleteEntries.push(updated);
          console.log(this.incompleteEntries);
          observer.next(updated);
        });
      } else {
        const incompleteEntry = <IncompleteEntry>{
          meet_id: entry.meetId,
          entrydata: entry
        };
        this.incompleteEntries.push(incompleteEntry);

        this.storeEntries();
        observer.next(incompleteEntry);
      }

    });

  }

  getIncompleteEntry(meetId: number) {
    // console.log(this.incompleteEntries);
    if (this.incompleteEntries) {
      return this.incompleteEntries.find(x => x.meet_id === meetId, 10);
    }
    return null;
  }

  getIncompleteEntryFO(meetId: number) {
    const incompleteEntry = this.getIncompleteEntry(meetId);
    if (incompleteEntry !== undefined && incompleteEntry !== null) {
      return incompleteEntry.entrydata;
    }
    return null;
  }

  getPendingEntries(meetId: number) {
    if (this.pendingEntries) {
      return this.pendingEntries.filter(x => x.meet_id === meetId);
    }
    return null;
  }

  retrieveIncompleteEntries() {
    this.http.get(environment.api + 'entry_incomplete').subscribe((incomplete: IncompleteEntry[]) => {
      this.incompleteEntries = incomplete;
      this.incompleteChanged.next(this.incompleteEntries);
      this.incompleteEntries = [];
      this.pendingEntries = [];

      for (const incompleteEntry of incomplete) {
        if (incompleteEntry.status_id === 12) {
          this.incompleteEntries.push(incompleteEntry);
        } else {
          this.pendingEntries.push(incompleteEntry)
        }
      }

      console.log('Update incomplete entries');
      this.incompleteChanged.next(this.incompleteEntries);
      this.pendingChanged.next(this.pendingEntries);
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
    if (this.userService.getUsers() === null) {
      const storedEntries = localStorage.getItem('entries');
      if (storedEntries !== null) {
        this.incompleteEntries = JSON.parse(storedEntries);
      }
    } else {
      this.http.get(environment.api + '')
    }
  }

  setMemberDetails(meetId: number, membershipDetails: MembershipDetails) {
    return new Observable((observer) => {
      const entry = this.getIncompleteEntryFO(meetId);

      if (entry !== null) {
        entry.membershipDetails = membershipDetails;

        console.log(membershipDetails);

        // Get the member history cached
        if (membershipDetails.member_number != null) {
          // TODO: add further screening here including checking the name matches the number
          this.memberHistoryService.downloadHistory(parseInt(membershipDetails.member_number, 10));
        }

        // If logged in store to server
        if (this.userService.getUsers() !== null) {
          console.log('User is logged in, store to server');

          this.storeIncompleteEntry(entry).subscribe((result) => {
            console.log('Stored member details to server');
            observer.next(result);
          });
        } else {
          this.storeEntries();
          observer.next(entry);
        }

      } else {
        console.error('Unable to find entry');
      }
    });
  }

  setMedicalDetails(meetId: number, medicalDetails: MedicalDetails) {
    return new Observable((observer) => {
      const entry = this.getIncompleteEntryFO(meetId);

      if (entry !== null) {
        entry.medicalDetails = medicalDetails;

        // If logged in store to server
        if (this.userService.getUsers() !== null) {
          console.log('User is logged in, store to server');

          this.storeIncompleteEntry(entry).subscribe((result) => {
            console.log('Stored medical details to server');
            console.log(result);
            observer.next(result);
          });
        } else {
          this.storeEntries();
          observer.next(entry);
        }

      } else {
        console.error('Unable to find entry');
      }

    });

  }

  setPaymentOptions(meetId: number, paymentOptions: PaymentOption) {
    const entry = this.getIncompleteEntryFO(meetId);

    if (entry !== null) {
      entry.paymentOptions = paymentOptions;

      // If logged in store to server
      if (this.userService.getUsers() !== null) {
        console.log('User is logged in, store to server');

        this.storeIncompleteEntry(entry).subscribe((result) => {
          console.log('Stored payment option to server');
          console.log(result);
        });
      } else {
        this.storeEntries();
      }

    } else {
      console.error('Unable to find entry');
    }


  }

  addEventEntry(meetEvent) {

    const entry = this.getIncompleteEntryFO(meetEvent.meet_id);
    if (entry !== null) {
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
      this.incompleteChanged.next(this.incompleteEntries);

    } else {
      console.error('Unable to add event to meet entry')
    }

  }

  removeEventEntry(meetEvent) {
    const entry = this.getIncompleteEntryFO(meetEvent.meet_id);
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
      this.incompleteChanged.next(this.incompleteEntries);

      // If logged in store to server
      if (this.authService.isAuthorized()) {
        console.log('User is logged in, store to server');

        this.storeIncompleteEntry(entry).subscribe((result) => {
          console.log('Stored payment option to server');
          console.log(result);
        });
      } else {
        this.storeEntries();
      }

    }
  }

  updateEventEntry(meetEvent, seedtime) {
    const entry = this.getIncompleteEntryFO(meetEvent.meet_id);
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

      // If logged in store to server
      if (this.userService.getUsers() !== null) {
        console.log('User is logged in, store to server');

        this.storeIncompleteEntry(entry).subscribe((result) => {
          console.log(result);
        });
      }
    }
  }

  /**
   *  Checks the meet entry complies with the rules
   */
  validateEntryEvents(entryFO: EntryFormObject): boolean {

    const meetDetails = this.meetService.getMeet(entryFO.meetId);

    const minIndividualEvents = 1;
    let maxIndividualEvents = 5;

    if (meetDetails !== undefined && meetDetails !== null) {
      maxIndividualEvents = meetDetails.maxevents;
    }

    if (entryFO.entryEvents === undefined) {
      return false;
    }

    const eventCount = this.getIndividualEventCount(entryFO);

    if (eventCount < minIndividualEvents) {
      return false;
    }

    if (eventCount > maxIndividualEvents) {
      return false;
    }

    if (this.checkForNT(entryFO)) {
      console.log('Disable form because of NT');
      return false;
    }

    return true;
  }

  checkEvents(meet_id) {
    const entryFO = this.getIncompleteEntryFO(meet_id);
    entryFO.validEvents = this.validateEntryEvents(entryFO);
    console.log('Check events: ' + entryFO.validEvents);
    this.incompleteChanged.next(this.incompleteEntries);
  }

  checkForNT(entryFO: EntryFormObject) {
    const meetDetails = this.meetService.getMeet(entryFO.meetId);

    for (const event of meetDetails.events) {
      if (event.times_required) {
        for (const eventEntry of entryFO.entryEvents) {
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

  getIndividualEventCount(entryFO: EntryFormObject) {
    let eventCount = 0;

    // If no entry events yet return 0
    if (entryFO.entryEvents === undefined || entryFO.entryEvents === null || entryFO.entryEvents.length === 0) {
      return 0;
    }

    const meetDetails = this.meetService.getMeet(entryFO.meetId);

    for (const event of meetDetails.events) {
      if (event.legs === 1) {
        for (const eventEntry of entryFO.entryEvents) {
          if (eventEntry.event_id === event.id) {
            eventCount++;
          }
        }
      }
    }

    return eventCount;
  }

  getEntryCost(entryFO: EntryFormObject) {
    // TODO: Add additional rules
    const meetDetails = this.meetService.getMeet(entryFO.meetId);
    if (meetDetails !== undefined && meetDetails !== null) {
      return meetDetails.meetfee;
    } else {
      return null;
    }
  }

  deleteEntry(meetId: number) {
    // TODO: if we've got an entry from this meet that is already submitted on the server don't delete it
    console.log('Delete entries for meet ' + meetId);

    // If logged in store to server
    if (this.userService.getUsers() !== null) {
      console.log('User is logged in, store to server');

      const meetEntry = this.getIncompleteEntry(meetId);
      this.incompleteEntries = this.incompleteEntries.filter(x => x.meet_id !== meetId);
      this.deleteIncompleteEntry(meetEntry);

    } else {
      this.incompleteEntries = this.incompleteEntries.filter(x => x.meet_id !== meetId);
      // console.log(this.incompleteEntries);
      this.storeEntries();
    }
  }

  clear() {
    console.log('Clear unsaved entries');
    this.incompleteEntries = [];
    this.pendingEntries = [];
    this.submittedEntries = [];
    this.incompleteChanged.next([]);
    this.pendingChanged.next([]);
    this.submittedChanged.next([]);
    this.storeEntries();
  }

  getDisabledEventsSubscription(meetId) {
    return new Observable<number[]>((observer) => {
      this.incompleteChanged.subscribe((changed: IncompleteEntry[]) => {
        const currentEntry = changed.filter(x => x.meet_id === meetId)[0];
        if (currentEntry === undefined || currentEntry === null) {
          observer.next([]);
          return;
        }

        const entryFO = currentEntry.entrydata;
        const numIndividualEvents = this.getIndividualEventCount(entryFO);
        let disabledEvents = this.getBlockedEvents(entryFO);

        if (numIndividualEvents >= this.meetService.getMeet(entryFO.meetId).maxevents) {
          disabledEvents = disabledEvents.concat(this.meetService.getIndividualEventIds(meetId)
            .filter(n => !this.getEnteredEventIds(entryFO).includes(n)));
        }

        // console.log('Disable events: ' + disabledEvents);
        observer.next(disabledEvents);

      })
    });
  }

  getBlockedEvents(meetEntry: EntryFormObject): number[] {
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

  getEnteredEventIds(meetEntry: EntryFormObject) {
    const eventIds = [];
    const events: EntryEvent[] = meetEntry.entryEvents;

    if (events !== undefined && events !== null) {
      for (const event of events) {
        eventIds.push(event.event_id);
      }
    }

    return eventIds;
  }

  storeIncompleteEntry(meetEntryFO) {

    let incompleteEntry = this.getIncompleteEntry(meetEntryFO.meetId);

    if (incompleteEntry === undefined || incompleteEntry === null || incompleteEntry.id === undefined
      || incompleteEntry.id === null) {
      console.log('Incomplete entry not yet saved.');

      incompleteEntry = <IncompleteEntry>{
        meet_id: meetEntryFO.meetId,
        user_id: null,
        status_id: null,
        member_id: null,
        entrydata: meetEntryFO
      };

      return new Observable((observer) => {
        this.http.post(environment.api + 'entry_incomplete', incompleteEntry).subscribe((entry: IncompleteEntry) => {
          // this.deleteEntry(entry.meet_id);
          //
          // this.incompleteEntries.push(entry);
          // this.incompleteChanged.next(this.incompleteEntries);

          this.storeEntries();
          observer.next(entry);
        });
      });
    } else {
      // console.log('Incomplete entry ' + incompleteEntry.id + ' update');

      return new Observable((observer) => {
        this.http.put(environment.api + 'entry_incomplete/' + incompleteEntry.id, incompleteEntry)
          .subscribe((entry: IncompleteEntry) => {
            // console.log('updated entry');
            // console.log(entry);
            observer.next(entry);
          });
      });
    }
  }

  deleteIncompleteEntry(meetEntry) {
    this.http.delete(environment.api + 'entry_incomplete/' + meetEntry.id)
      .subscribe((response: any) => {
        console.log(response);
      }, (error: any) => {
        console.log(error);
      });
  }

  finalise(meetEntry) {
    console.log('finalise');

    if (meetEntry.id === undefined || meetEntry.id === null) {
      return null;
    }

    if (meetEntry.edit_entry_id !== undefined && meetEntry.edit_entry_id !== null) {
      return this.http.put(environment.api + 'entry_finalise/' + meetEntry.id, {});
    } else {
      return this.http.post(environment.api + 'entry_finalise/' + meetEntry.id, {});
    }

  }

  getPendingEntry(pendingEntryId) {
    return this.http.get(environment.api + 'entry_incomplete/' + pendingEntryId);
  }

  getMeetEntryFO(meetEntryId) {
    return new Observable((observer) => {
      this.http.get(environment.api + 'meet_entry/' + meetEntryId).subscribe((entry: any) => {
        const meetEntry = entry.meet_entry;
        console.log(meetEntry);

        // Convert meet entry to entry form object
        const entryFO = new EntryFormObject();
        const entrantDetailsFO = new EntrantDetails();
        const membershipDetailsFO = new MembershipDetails();
        const medicalDetailsFO = new MedicalDetails();

        entrantDetailsFO.entrantFirstName = meetEntry.member.firstname;
        entrantDetailsFO.entrantSurname = meetEntry.member.surname;
        entrantDetailsFO.entrantDob = meetEntry.member.dob;

        if (meetEntry.member.gender === 1) {
          entrantDetailsFO.entrantGender = 'Male';
        } else if (meetEntry.member.gender === 2) {
          entrantDetailsFO.entrantGender = 'Female';
        } else {
          entrantDetailsFO.entrantGender = '';
        }

        if (meetEntry.member.phones !== undefined && meetEntry.member.phones !== null) {
          if (meetEntry.member.phones.length > 0) {
            entrantDetailsFO.entrantPhone = meetEntry.member.phones[meetEntry.member.phones.length - 1].phonenumber;
          }
        }

        if (meetEntry.member.emails !== undefined && meetEntry.member.emails !== null) {
          if (meetEntry.member.emails.length > 0) {
            entrantDetailsFO.entrantEmail = meetEntry.member.emails[meetEntry.member.emails.length - 1].address;
          }
        }

        entrantDetailsFO.emergencyFirstName = meetEntry.member.emergency.firstname;
          entrantDetailsFO.emergencySurname = meetEntry.member.emergency.surname;
          entrantDetailsFO.emergencyPhone = meetEntry.member.emergency.phone.phonenumber;
          entrantDetailsFO.emergencyEmail = ''; // TODO: Fix

          entrantDetailsFO.who = 'me'; // TODO: Temporary
        entryFO.entrantDetails = entrantDetailsFO;

        // Handle Membership Details
        membershipDetailsFO.member_type = 'msa'; // TODO: better handling
        membershipDetailsFO.member_number = meetEntry.member.number;
        membershipDetailsFO.club_code = meetEntry.club.code;
        membershipDetailsFO.club_name = meetEntry.club.clubname;
        entryFO.membershipDetails = membershipDetailsFO;

        // Medical and Classification Details
        if (meetEntry.disability_status === 0) {
          medicalDetailsFO.classification = 'no';
        } else if (meetEntry.disability_status === 2) {
          medicalDetailsFO.classification = 'provisional';
        } else if (meetEntry.distability_status === 1) {
          medicalDetailsFO.classification = 'classified';
        }
        medicalDetailsFO.classFreestyle = meetEntry.disability_s.classification;
        medicalDetailsFO.classBreaststroke = meetEntry.disability_sb.classification;
        medicalDetailsFO.classMedley = meetEntry.disability_sm.classification;

        if (meetEntry.medical_condition) {
          medicalDetailsFO.dispensation = 'true';
        } else {
          medicalDetailsFO.dispensation = 'false';
        }

        if (meetEntry.medical) {
          medicalDetailsFO.medicalCertificate = 'true';
        } else {
          medicalDetailsFO.medicalCertificate = 'false';
        }

        if (meetEntry.medical_safety) {
          medicalDetailsFO.medicalCondition = 'true';
        } else {
          medicalDetailsFO.medicalCondition = 'false';
        }

        medicalDetailsFO.medicalDetails = meetEntry.medical_details;
        entryFO.medicalDetails = medicalDetailsFO;

        // Handle events
        entryFO.entryEvents = [];
        for (const eventEntry of meetEntry.events) {
          const eventEntryFO = new EntryEvent();
          eventEntryFO.id = eventEntry.id;
          eventEntryFO.entry_id = eventEntry.entry_id;
          eventEntryFO.event_id = eventEntry.event_id;
          eventEntryFO.program_no = eventEntry.event.prognumber + eventEntry.event.progsuffix;
          eventEntryFO.discipline = eventEntry.event.event_discipline.discipline;
          eventEntryFO.distance = eventEntry.event.event_distance.distance;
          eventEntryFO.classification = null;
          eventEntryFO.seedtime = eventEntry.seedtime;
          entryFO.entryEvents.push(eventEntryFO);

        }

        entryFO.meetId = meetEntry.meet_id;
        entryFO.validEvents = true;

        // console.log(entryFO);
        const incompleteEntry = new IncompleteEntry();
        if (meetEntry.status !== undefined && meetEntry.status !== null) {
          const currentStatus = meetEntry.status;
          entryFO.status = currentStatus.code;
          incompleteEntry.status_id = currentStatus.code;
          incompleteEntry.status_label = currentStatus.status.label;
          incompleteEntry.status_description = currentStatus.status.description;

        }
        incompleteEntry.entrydata = entryFO;
        incompleteEntry.meet_id = meetEntry.meet_id;

        let paidAmount = 0;

        if (meetEntry.payments !== undefined && meetEntry.payments !== null) {
          for (const payment of meetEntry.payments) {
            paidAmount += payment.amount;
          }
        }
        incompleteEntry.paid_amount = paidAmount;


        observer.next(incompleteEntry);

        },
        (err) => {
          console.log(err);
          observer.next(null);
        });
    })
  }

  setStatus(meetEntry, status_id) {
    console.log('Set status to ' + status_id);
    meetEntry.status = status_id;
    this.storeEntries();
    this.incompleteChanged.next(this.incompleteEntries);
    console.log(this.incompleteEntries);
  }

  editSubmittedEntry(entryId) {
    return new Observable((observer) => {
      this.getMeetEntryFO(entryId).subscribe((incompleteEntry: IncompleteEntry) => {
        incompleteEntry.entrydata.edit_mode = true;
        incompleteEntry.entrydata.edit_entry_id = entryId;
        incompleteEntry.entrydata.edit_paid = incompleteEntry.paid_amount;
        console.log(incompleteEntry.entrydata);
        this.addEntry(incompleteEntry.entrydata).subscribe((updatedEntry) => {
          observer.next(updatedEntry);
        });
        // this.incompleteEntries.push(incompleteEntry);
        // this.incompleteChanged.next(this.incompleteEntries);

      });
    });
  }

  getSubmittedEntriesByMemberNumber(memberNumber, meetId) {
    return new Observable((observer) => {
      this.http.get(environment.api + 'meet_entries_by_member_number/' + memberNumber).subscribe((entriesResp: any) => {
        const entries = entriesResp.meet_entries;
        observer.next(entries.filter(x => x.meet_id === meetId));
      });
    });
  }

  approvePending(pendingId) {
    console.log('Approve Pending: ' + pendingId);
    if (pendingId !== undefined && pendingId !== null) {
      return this.http.post(environment.api + 'approve_pending/' + pendingId, {});
    } else {
      return null;
    }

  }

  deletePending(pendingId) {
    console.log('Delete Pending: ' + pendingId);
    if (pendingId !== undefined && pendingId !== null) {
      return this.http.delete(environment.api + 'entry_incomplete/' + pendingId, {});
    } else {
      return null;
    }

  }

}
