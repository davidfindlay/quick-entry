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
import {of} from 'rxjs/internal/observable/of';
import {map} from 'rxjs/operators';
import {angularInnerClassDecoratorKeys} from 'codelyzer/util/utils';
import {EntryPaymentComponent} from './entry-payment/entry-payment.component';
import {EntryPayment} from './models/entry-payment';
import {MealMerchandiseDetails} from './models/meal-merchandise-details';
import {MerchandiseDetails} from './models/merchandise';

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
        // Delete existing entries to prevent duplicates
        if (this.incompleteEntries === null) {
          this.incompleteEntries = [];
        } else {
          this.incompleteEntries = this.incompleteEntries.filter(x => x.meet_id !== entry.meetId);
        }

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
    return new Observable((observer) => {

      if (this.userService.isLoggedIn()) {
        if (this.incompleteEntries !== undefined && this.incompleteEntries !== null && this.incompleteEntries.length === 0) {
          this.http.get(environment.api + 'entry_incomplete').subscribe((incompleteEntries: any) => {

            if (incompleteEntries !== null) {
              this.incompleteEntries = incompleteEntries;
              observer.next(this.incompleteEntries.find(x => x.meet_id === meetId, 10));
            } else {
              console.error('Unable to retrieve incomplete entries from server');
            }
          }, (error: any) => {
            console.error('Unable to retrieve incomplete enries from server');
            console.error(error);
          });
        } else {
          if (this.incompleteEntries) {
            observer.next(this.incompleteEntries.find(x => x.meet_id === meetId, 10));
          } else {
            observer.next(of(null));
          }
        }
      } else {
        if (this.incompleteEntries) {
          observer.next(this.incompleteEntries.find(x => x.meet_id === meetId, 10));
        } else {
          observer.next(of(null));
        }
      }
    });
  }

  getIncompleteEntryFO(meetId: number) {
    return new Observable((observer) => {
      this.getIncompleteEntry(meetId).subscribe((incompleteEntry: any) => {
        if (incompleteEntry !== undefined && incompleteEntry !== null) {
          observer.next(incompleteEntry.entrydata);
        } else {
          observer.next(null);
        }
      });
    });
  }

  getPendingEntries(meetId: number) {
    if (this.pendingEntries) {
      return this.pendingEntries.filter(x => x.meet_id === meetId);
    }
    return null;
  }

  retrieveIncompleteEntries() {
    if (this.userService.isLoggedIn()) {

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
    } else {
      const incompleteEntries = JSON.parse(localStorage.getItem('entries'));
      if (incompleteEntries !== undefined && incompleteEntries !== null) {
        this.incompleteEntries = incompleteEntries;
      } else {
        this.incompleteEntries = [];
      }
      this.incompleteChanged.next(this.incompleteEntries);
      console.log('loaded incomplete entries');
      console.log(this.incompleteEntries);
    }
  }

  getSubmittedEntries(meetId: number) {
    if (this.submittedEntries) {
      return this.submittedEntries.find(x => x.meet_id === meetId);
    }
    return null;
  }

  retrieveSubmittedEntries() {
    // TODO: retrieve submitted entries for unauthenticated?
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
      this.getIncompleteEntryFO(meetId).subscribe((entry: EntryFormObject) => {

        if (entry !== null) {
          entry.membershipDetails = membershipDetails;

          console.log(membershipDetails);

          // Get the member history cached
          if (membershipDetails.member_type === 'msa' && membershipDetails.member_number !== null &&
            membershipDetails.member_number !== '') {
            // TODO: add further screening here including checking the name matches the number
            this.memberHistoryService.downloadHistory(parseInt(membershipDetails.member_number, 10));
          }

          // If logged in store to server
          if (this.userService.getUsers() !== null) {
            console.log('User is logged in, store to server');

            this.storeIncompleteEntry(entry).subscribe((result: any) => {
              console.log('Stored member details to server');
              observer.next(result.entrydata);
            });
          } else {
            this.storeEntries();
            observer.next(entry);
          }

        } else {
          console.error('Unable to find entry');
        }
      });
    });
  }

  setMealMerchandiseDetails(meetId: number, mealsQuantity: number, mealsComments: string) {
    return new Observable((observer) => {
      this.getIncompleteEntryFO(meetId).subscribe((entry: EntryFormObject) => {
        if (entry !== null) {

          if (entry.mealMerchandiseDetails === undefined || entry.mealMerchandiseDetails === null) {
            entry.mealMerchandiseDetails = new MealMerchandiseDetails();
          }

          entry.mealMerchandiseDetails.meals = mealsQuantity;
          entry.mealMerchandiseDetails.mealComments = mealsComments;

          // If logged in store to server
          if (this.userService.getUsers() !== null) {
            console.log('User is logged in, store to server');

            this.storeIncompleteEntry(entry).subscribe((result: any) => {
              console.log('Stored medical details to server');
              console.log(result);
              observer.next(result.entrydata);
            });
          } else {
            this.storeEntries();
            observer.next(entry);
          }

          console.log(entry);

        } else {
          console.error('Unable to find entry');
        }

      });
    });
  }

  setMedicalDetails(meetId: number, medicalDetails: MedicalDetails) {
    return new Observable((observer) => {
      this.getIncompleteEntryFO(meetId).subscribe((entry: EntryFormObject) => {

        if (entry !== null) {
          entry.medicalDetails = medicalDetails;

          // If logged in store to server
          if (this.userService.getUsers() !== null) {
            console.log('User is logged in, store to server');

            this.storeIncompleteEntry(entry).subscribe((result: any) => {
              console.log('Stored medical details to server');
              console.log(result);
              observer.next(result.entrydata);
            });
          } else {
            this.storeEntries();
            observer.next(entry);
          }

        } else {
          console.error('Unable to find entry');
        }

      });

    });

  }

  setPaymentOptions(meetId: number, paymentOptions: PaymentOption) {
    return new Observable((observer) => {
      this.getIncompleteEntryFO(meetId).subscribe((entry: EntryFormObject) => {

        console.log('got entry');

        if (entry !== null) {
          entry.paymentOptions = paymentOptions;

          // If logged in store to server
          if (this.userService.getUsers() !== null) {
            console.log('User is logged in, store to server');

            this.storeIncompleteEntry(entry).subscribe((result: any) => {
              console.log('Stored payment option to server');
              console.log(result);
              observer.next(result.entrydata);
            });
          } else {
            this.storeEntries();
            observer.next(entry);
          }

        } else {
          console.error('Unable to find entry');
        }
      });
    });

  }

  addEventEntry(meetEvent) {

    this.getIncompleteEntryFO(meetEvent.meet_id).subscribe((entry: EntryFormObject) => {


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

        // If logged in store to server
        if (this.userService.getUsers() !== null) {
          console.log('User is logged in, store to server');

          this.storeIncompleteEntry(entry).subscribe((result) => {
            console.log(result);
          });
        } else {
          this.storeEntries();
        }

        entry.validEvents = this.validateEntryEvents(entry);
        this.incompleteChanged.next(this.incompleteEntries);

      } else {
        console.error('Unable to add event to meet entry')
      }
    });

  }

  removeEventEntry(meetEvent) {
    this.getIncompleteEntryFO(meetEvent.meet_id).subscribe((entry: EntryFormObject) => {


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
        if (this.userService.isLoggedIn()) {
          console.log('User is logged in, store to server');

          this.storeIncompleteEntry(entry).subscribe((result) => {
            console.log('Stored payment option to server');
            console.log(result);
          });
        } else {
          this.storeEntries();
        }

      }
    });
  }

  updateEventEntry(meetEvent, seedtime) {
    this.getIncompleteEntryFO(meetEvent.meet_id).subscribe((entry: EntryFormObject) => {


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
        this.incompleteChanged.next(this.incompleteEntries);

        // If logged in store to server
        if (this.userService.getUsers() !== null) {
          console.log('User is logged in, store to server');

          this.storeIncompleteEntry(entry).subscribe((result) => {
            console.log(result);
          });
        } else {
          this.storeEntries();
        }
      }
    });
  }

  updateMerchandiseOrder(merchandise, qty) {
    this.getIncompleteEntryFO(merchandise.meet_id).subscribe((entry: EntryFormObject) => {
      if (entry) {
        if (entry.mealMerchandiseDetails === undefined || entry.mealMerchandiseDetails === null) {
          entry.mealMerchandiseDetails = new MealMerchandiseDetails();
        }

        if (entry.mealMerchandiseDetails.merchandiseItems === undefined || entry.mealMerchandiseDetails.merchandiseItems === null) {
          entry.mealMerchandiseDetails.merchandiseItems = [];
        }

        // Check if this item is already listed
        const existingItem = entry.mealMerchandiseDetails.merchandiseItems.filter(x => x.merchandiseId === merchandise.id);
        console.log(existingItem);

        if (existingItem.length === 0) {
          const entryItem = new MerchandiseDetails();
          entryItem.qty = qty;
          entryItem.merchandiseId = merchandise.id;
          entry.mealMerchandiseDetails.merchandiseItems.push(entryItem);
        } else {
          existingItem[0].qty = qty;
        }

        // If logged in store to server
        if (this.userService.getUsers() !== null) {
          console.log('User is logged in, store to server');

          this.storeIncompleteEntry(entry).subscribe((result) => {
            console.log(result);
          });
        } else {
          this.storeEntries();
        }
      }
    });
  }

  /**
   *  Checks the meet entry complies with the rules
   */
  validateEntryEvents(entryFO: EntryFormObject): boolean {

    if (entryFO === undefined || entryFO === null) {
      console.log('validateEntryEvents: entryFO is undefined or null');

      return false;
    }

    const meetDetails = this.meetService.getMeet(entryFO.meetId);

    const minIndividualEvents = meetDetails.minevents;
    let maxIndividualEvents = meetDetails.maxevents;

    if (meetDetails !== undefined && meetDetails !== null) {
      maxIndividualEvents = meetDetails.maxevents;
    }

    if (entryFO.entryEvents === undefined) {
      console.log('validateEntryEvents: invalid - entryEvents undefined');
      return false;
    }

    const eventCount = this.getIndividualEventCount(entryFO);

    if (eventCount < minIndividualEvents) {
      console.log('validateEntryEvents: less than minimum individual events selected');
      return false;
    }

    if (eventCount > maxIndividualEvents) {
      console.log('validateEntryEvents: more than maximum individual events selected');
      return false;
    }

    if (this.checkForNT(entryFO)) {
      console.log('validateEntryEvents: Disable form because of NT');
      return false;
    }

    console.log('validateEntryEvents: valid');
    return true;
  }

  checkEvents(meet_id) {
    this.getIncompleteEntryFO(meet_id).subscribe((entryFO: EntryFormObject) => {
      entryFO.validEvents = this.validateEntryEvents(entryFO);
      console.log('Check events: ' + entryFO.validEvents);
      this.incompleteChanged.next(this.incompleteEntries);
    });
  }

  checkForNT(entryFO: EntryFormObject) {
    const meetDetails = this.meetService.getMeet(entryFO.meetId);

    for (const eventEntry of entryFO.entryEvents) {
      const meetEvent = meetDetails.events.find(x => x.id === eventEntry.event_id);
      if (meetEvent.times_required) {
        if (eventEntry.seedtime === null || eventEntry.seedtime === 0) {
          console.log('Event ' + meetEvent.prognumber + ' has disallowed 0 seedtime!');
          return true;
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

  getMeetFee(entryFO: EntryFormObject) {
    const meetDetails = this.meetService.getMeet(entryFO.meetId);
    if (meetDetails !== undefined && meetDetails !== null) {
      if (entryFO.membershipDetails.member_type === 'msa' || entryFO.membershipDetails.member_number === 'international') {
        return meetDetails.meetfee;
      } else {
        if (meetDetails.meetfee_non_member !== undefined && meetDetails.meetfee_non_member !== null) {
          return meetDetails.meetfee_non_member;
        } else {
          return meetDetails.meetfee;
        }
      }
    }
    return null;
  }

  getEventFees(entryFO: EntryFormObject) {
    let entryFee = 0;
    let individualEvents = 0;
    const meetDetails = this.meetService.getMeet(entryFO.meetId);
    if (meetDetails !== undefined && meetDetails !== null) {
      if (entryFO.entryEvents !== undefined && entryFO.entryEvents !== null) {

        // Handle fees for specific events
        for (const eventEntry of entryFO.entryEvents) {
          const eventDetails = meetDetails.events.find(x => x.id === eventEntry.event_id);

          // Only add cost of individual events
          if (eventDetails.legs === 1) {

            if (entryFO.membershipDetails.member_type === 'msa' || entryFO.membershipDetails.member_number === 'international') {
              entryFee += eventDetails.eventfee;
            } else {
              if (eventDetails.eventfee_non_member !== undefined && eventDetails.eventfee_non_member !== null) {
                entryFee += eventDetails.eventfee_non_member;
              } else {
                entryFee += eventDetails.eventfee;
              }
            }
          }
        }

        // Handle included events and extra event fee
        if (meetDetails.included_events !== null) {
          console.log('included events is ' + meetDetails.included_events);
          for (const eventEntry of entryFO.entryEvents) {
            const eventDetails = meetDetails.events.find(x => x.id === eventEntry.event_id);

            // Only charge for individual events, and if there isn't a specific fee for this event
            if (eventDetails.legs === 1 && (eventDetails.eventfee === null || eventDetails.eventfee === 0)) {
              individualEvents++;
              if (individualEvents > meetDetails.included_events) {
                entryFee += meetDetails.extra_event_fee;
                console.log('add ' + entryFee);
              }
            }
          }
        }

      }
    }

    console.log('entry fee: ' + entryFee);

    return entryFee;
  }

  getMealFees(entryFO: EntryFormObject) {
    let mealFees = 0;
    const meetDetails = this.meetService.getMeet(entryFO.meetId);
    if (meetDetails !== undefined && meetDetails !== null) {
      if (entryFO.mealMerchandiseDetails !== undefined && entryFO.mealMerchandiseDetails !== null) {
        if (meetDetails.mealfee !== null) {
          mealFees = entryFO.mealMerchandiseDetails.meals * meetDetails.mealfee;
        } else {
          mealFees = 0;
        }
      }
    }

    return mealFees;
  }

  getEntryCost(entryFO: EntryFormObject) {
    if (entryFO !== undefined && entryFO !== null) {
      return this.getMeetFee(entryFO) + this.getEventFees(entryFO);
    } else {
      console.error('entryFO is undefined or null');
    }
  }

  deleteEntry(meetId: number) {
    // TODO: if we've got an entry from this meet that is already submitted on the server don't delete it
    console.log('Delete entries for meet ' + meetId);

    // If logged in store to server
    if (this.userService.getUsers() !== null) {
      console.log('User is logged in, store to server');

      this.getIncompleteEntry(meetId).subscribe((meetEntry: any) => {
        this.incompleteEntries = this.incompleteEntries.filter(x => x.meet_id !== meetId);
        this.deleteIncompleteEntry(meetEntry);
      });

    } else {
      this.incompleteEntries = this.incompleteEntries.filter(x => x.meet_id !== meetId);
      // console.log(this.incompleteEntries);
      this.storeEntries();
      this.incompleteChanged.next(this.incompleteEntries);
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

    return new Observable((observer) => {

      console.log(meetEntryFO);

      this.getIncompleteEntry(meetEntryFO.meetId).subscribe((incompleteEntry: IncompleteEntry) => {

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

          console.log(incompleteEntry);


          this.http.post(environment.api + 'entry_incomplete', incompleteEntry).subscribe((entry: IncompleteEntry) => {
            // this.deleteEntry(entry.meet_id);
            //
            // this.incompleteEntries.push(entry);
            // this.incompleteChanged.next(this.incompleteEntries);

            this.storeEntries();
            observer.next(entry);
          });

        } else {
          // console.log('Incomplete entry ' + incompleteEntry.id + ' update');

          this.http.put(environment.api + 'entry_incomplete/' + incompleteEntry.code, incompleteEntry)
            .subscribe((entry: IncompleteEntry) => {
              // console.log('updated entry');
              // console.log(entry);
              observer.next(entry);
            });
        }
      });
    });
  }

  deleteIncompleteEntry(meetEntry) {
    console.log(meetEntry);
    this.http.delete(environment.api + 'entry_incomplete/' + meetEntry.code)
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
      return this.http.put(environment.api + 'entry_finalise/' + meetEntry.code, {});
    } else {
      return this.http.post(environment.api + 'entry_finalise/' + meetEntry.code, {});
    }

  }

  getPendingEntry(pendingEntryId) {
    return this.http.get(environment.api + 'entry_incomplete/' + pendingEntryId);
  }

  getMeetEntryByCodeFO(meetEntryCode) {
    console.log('getMeetEntryByCodeFO');
    return new Observable((observer) => {
      this.http.get(environment.api + 'meet_entry_by_code/' + meetEntryCode).subscribe((entry: any) => {

          console.log(entry);

          const incompleteEntry = this.convertMeetEntryToEntryFO(entry);
          observer.next(incompleteEntry);

        },
        (err) => {
          console.log(err);
          observer.next(null);
        });
    })
  }

  getMeetEntryFO(meetEntryId) {
    return new Observable((observer) => {
      this.http.get(environment.api + 'meet_entry/' + meetEntryId).subscribe((entry: any) => {

          const incompleteEntry = this.convertMeetEntryToEntryFO(entry);
          observer.next(incompleteEntry);

        },
        (err) => {
          console.log(err);
          observer.next(null);
        });
    })
  }

  convertMeetEntryToEntryFO(entry) {
    console.log('convertMeetEntryToEntryFO');
    if (entry === undefined || entry === null) {
      console.error('entry is undefined');
      return null;
    }

    if (entry.meet_entry === undefined) {
      console.error('meet_entry is undefined');
      return null;
    }

    const meetEntry = entry.meet_entry;

    // Convert meet entry to entry form object
    const entryFO = new EntryFormObject();
    const entrantDetailsFO = new EntrantDetails();
    const membershipDetailsFO = new MembershipDetails();
    const medicalDetailsFO = new MedicalDetails();
    const mealMerchandiseDetailsFO = new MealMerchandiseDetails();

    if (meetEntry.member === undefined || meetEntry.member === null) {
      console.log('convertMeetEntryToEntryFO: member is undefined or null');
      console.log(meetEntry);
      return null;
    }

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

    if (meetEntry.member.emergency !== undefined && meetEntry.member.emergency !== null) {
      entrantDetailsFO.emergencyFirstName = meetEntry.member.emergency.firstname;
      entrantDetailsFO.emergencySurname = meetEntry.member.emergency.surname;
      entrantDetailsFO.emergencyPhone = meetEntry.member.emergency.phone.phonenumber;
      entrantDetailsFO.emergencyEmail = ''; // TODO: Fix
    }

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

    if (meetEntry.disability_status !== null && meetEntry.disability_status !== 0) {
      if (meetEntry.disability_s.classification !== undefined && meetEntry.disability_s.classification !== null) {
        medicalDetailsFO.classFreestyle = meetEntry.disability_s.classification;
      }
      if (meetEntry.disability_sb.classification !== undefined && meetEntry.disability_sb.classification !== null) {
        medicalDetailsFO.classBreaststroke = meetEntry.disability_sb.classification;
      }
      if (meetEntry.disability_sm.classification !== undefined && meetEntry.disability_sm.classification !== null) {
        medicalDetailsFO.classMedley = meetEntry.disability_sm.classification;
      }
    }

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

    mealMerchandiseDetailsFO.meals = meetEntry.meals;
    mealMerchandiseDetailsFO.mealComments = meetEntry.mealComments;
    entryFO.mealMerchandiseDetails = mealMerchandiseDetailsFO;

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

    console.log(incompleteEntry);

    return incompleteEntry;
  }

  setStatus(meetEntry, status_id) {
    console.log('Set status to ' + status_id);
    meetEntry.status = status_id;
    this.storeEntries();
    this.incompleteChanged.next(this.incompleteEntries);
    console.log(this.incompleteEntries);
  }

  editSubmittedEntry(entryCode) {
    return new Observable((observer) => {
      this.getMeetEntryByCodeFO(entryCode).subscribe((incompleteEntry: IncompleteEntry) => {
        incompleteEntry.entrydata.edit_mode = true;
        incompleteEntry.entrydata.edit_entry_id = incompleteEntry.id;
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

  processedPending(pendingId) {
    console.log('Processed Pending: ' + pendingId);
    if (pendingId !== undefined && pendingId !== null) {
      return this.http.post(environment.api + 'entry_incomplete_processed/' + pendingId, {});
    } else {
      return null;
    }
  }

  updatePending(pendingCode, pendingEntry) {
    console.log('Update Pending: ' + pendingCode);
    console.log(pendingEntry);

    return this.http.put(environment.api + 'entry_incomplete/' + pendingCode, pendingEntry);
  }

}
