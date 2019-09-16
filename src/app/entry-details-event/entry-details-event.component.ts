import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MeetEvent} from '../models/meet-event';
import {FormBuilder, FormGroup} from '@angular/forms';
import {faCheck, faTimes} from '@fortawesome/free-solid-svg-icons';
import {MemberHistoryService} from '../member-history.service';
import {TimePipe} from '../time.pipe';
import {NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {TimeService} from '../time.service';
import {SeedtimeHelperComponent} from '../seedtime-helper/seedtime-helper.component';
import {of} from 'rxjs/internal/observable/of';
import {EntryService} from '../entry.service';

@Component({
  selector: 'app-entry-details-event',
  templateUrl: './entry-details-event.component.html',
  styleUrls: ['./entry-details-event.component.css']
})
export class EntryDetailsEventComponent implements OnInit {

  @Input() meetEvent: MeetEvent;
  @Input() index: number;

  @ViewChild('seedTimeTip', {static: false}) seedTimeTip: NgbTooltip;

  eventEntryForm: FormGroup;

  // Subscription to EntryFormObject Service not allowed events
  eventsDisabledSubscription;

  enterClass = 'btn btn-outline-primary';
  enterText = 'Enter';
  btnIconClass = null;
  eventAriaLabel = '';

  enteredButtonIcon = faCheck;
  enterButtonCaption = 'Enter';
  enteredButtonCaption = 'Entered';
  cancelButtonIcon = faTimes;
  cancelButtonCaption = 'Cancel';

  entered = false;
  fixCount = 0;
  enterButtonDisabled = false;
  disabledClass = 'btn btn-secondary';
  undisableClass = '';

  entry;
  memberNo = 0;
  historyAvailable = false;

  seedTimeRequired = true;
  seedTimeMandatory = false;
  seedTimeTooShort = false;
  seedTimeTooLong = false;
  seedTimeNT = false;

  constructor(private fb: FormBuilder,
              private memberHistoryService: MemberHistoryService,
              private timePipe: TimePipe,
              private modalService: NgbModal,
              private entryService: EntryService,
              private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.entry = this.entryService.getIncompleteEntryFO(this.meetEvent.meet_id);

    this.eventEntryForm = this.fb.group({
      enter: false,
      seedTime: ''
    });

    if (this.entry !== undefined && this.entry !== null) {
      const membershipDetails = this.entry.membershipDetails;
      if (membershipDetails !== undefined && membershipDetails !== null) {
        this.memberNo = parseInt(membershipDetails.member_number, 10);
      }

    }

    // Download member history if it's not already available
    if (this.memberNo !== undefined && this.memberNo !== null && this.memberNo !== 0) {
      this.memberHistoryService.downloadHistory(this.memberNo);
      this.memberHistoryService.resultsAvailable.subscribe((resultsAvailable) => {
        // Once results are available, check if there's a previous result for this event
        if (resultsAvailable) {
          this.isMemberHistoryAvailable();

          // Freetime not available
          if (this.historyAvailable && this.meetEvent.freetime) {
            // console.log('Disable free time entry on event ' + this.meetEvent.prognumber);
            this.eventEntryForm.controls.seedTime.disable();
          }
        }
      });
    }

    this.eventEntryForm.valueChanges.subscribe((entryDetails) => {
      const rawValues = this.eventEntryForm.getRawValue();
      const newSeedTime = TimeService.timeStringToSeconds(rawValues.seedTime);
      this.isTimeReasonable(newSeedTime);
      this.entryService.updateEventEntry(this.meetEvent, newSeedTime);
    });

    this.eventsDisabledSubscription = this.entryService.getDisabledEventsSubscription(this.meetEvent.meet_id).subscribe((disabledEvents) => {
      if (disabledEvents.includes(this.meetEvent.id)) {

        if (!this.entered) {
          this.enterButtonDisabled = true;
          this.undisableClass = this.enterClass;
          this.enterClass = this.disabledClass;
        }
      } else {
        this.enterButtonDisabled = false;
        if (this.enterClass === this.disabledClass) {
          this.enterClass = this.undisableClass;
        }
      }
    });

    if (this.isRelay()) {
      this.seedTimeRequired = false;
    }

    if (this.isPostal()) {
      this.seedTimeRequired = false;
    }

    if (this.meetEvent.times_required) {
      this.seedTimeMandatory = true;
      // console.log('Seedtime mandatory for event ' + this.meetEvent.prognumber);
    }

    if (this.entry !== undefined && this.entry !== null) {
      if (this.entry.entryEvents !== undefined && this.entry.entryEvents !== null) {
        const currentEvents = this.entry.entryEvents.filter(x => x.event_id === this.meetEvent.id)
        if (currentEvents !== undefined && currentEvents !== null) {
          if (currentEvents.length > 0) {
            const currentEventEntry = currentEvents[0];
            this.showEntered();

            const seedtime = TimeService.formatTime(currentEventEntry.seedtime);

            this.eventEntryForm.patchValue({
              enter: true,
              seedTime: seedtime
            });

            if (currentEventEntry.seedtime === 0) {
              this.seedTimeNT = true;
            }

          }
        }
      }
    }

  }

  isMemberHistoryAvailable() {
    if (this.memberNo !== undefined && this.memberNo !== null && this.memberNo !== 0) {
      // console.log('Look for member history for ' + this.meetEvent.event_discipline.discipline);
      this.historyAvailable = this.memberHistoryService.isHistoryAvailable(this.memberNo, this.meetEvent.event_distance.metres,
        this.meetEvent.event_discipline.discipline, this.meetEvent.event_distance.course);
      if (this.historyAvailable) {
        // console.log('History available for event ' + this.meetEvent.prognumber);
      } else {
        // console.log('No member history for event ' + this.meetEvent.prognumber);
      }
    } else {
      // console.log('No member history for event ' + this.meetEvent.prognumber);
      this.historyAvailable = false;
    }
  }

  eventSelected() {
    return this.entered;
  }

  clickMore() {
    const modalRef = this.modalService.open(SeedtimeHelperComponent, {size: 'lg'});

    // console.log(this.meetEvent);

    modalRef.componentInstance.memberNo = this.memberNo;
    modalRef.componentInstance.inDistance = of(this.meetEvent.event_distance.metres);
    modalRef.componentInstance.inDiscipline = of(this.meetEvent.event_discipline.discipline);
    modalRef.componentInstance.inCourse = of(this.meetEvent.event_distance.course);
    modalRef.componentInstance.inFreetime = of(this.meetEvent.freetime);

    if (this.eventEntryForm.controls['seedTime'].value !== '') {
      modalRef.componentInstance.timeIn = TimeService.timeStringToSeconds(this.eventEntryForm.controls['seedTime'].value);
    } else {
      modalRef.componentInstance.timeIn = null
    }

    modalRef.componentInstance.timeEntered.subscribe(timeEntered => {
      this.eventEntryForm.controls['seedTime'].setValue(timeEntered);
    })
  }

  clickEnter() {
    if (this.entered === false) {
      this.showEntered();
      this.cdRef.detectChanges();
      this.entryService.addEventEntry(this.meetEvent);
      if (this.meetEvent.freetime && this.historyAvailable) {
        this.clickPersonalBest();
      }
    } else if (this.entered === true) {
      this.entered = false;
      this.enterClass = 'btn btn-outline-primary';
      this.enterText = this.enterButtonCaption;
      this.btnIconClass = null;
      this.eventAriaLabel = 'Enter event ' + this.meetEvent.prognumber + this.meetEvent.progsuffix + ' '
        + this.meetEvent.distance + ' ' + this.meetEvent.event_discipline.discipline;

      this.entryService.removeEventEntry(this.meetEvent);
    }
  }

  showEntered() {
    this.entered = true;
    this.enterButtonDisabled = false;
    this.enterClass = 'btn btn-success';
    this.enterText = this.enteredButtonCaption;
    this.btnIconClass = this.enteredButtonIcon;
    this.eventAriaLabel = 'Cancel entry for event ' + this.meetEvent.prognumber + this.meetEvent.progsuffix + ' '
      + this.meetEvent.distance + ' ' + this.meetEvent.event_discipline.discipline;
  }

  clickLastTime() {
    this.memberHistoryService.getLastTime(this.memberNo, this.meetEvent.event_distance.metres,
      this.meetEvent.event_discipline.discipline,
      this.meetEvent.event_distance.course).subscribe((lastTime) => {

      if (lastTime != null) {
        this.eventEntryForm.controls['seedTime'].patchValue(
          this.timePipe.transform(lastTime.seconds), {});

        if (this.seedTimeTip !== undefined) {
          this.seedTimeTip.close();
        }
        this.seedTimeTip.ngbTooltip = 'Your time from ' + moment(lastTime.event_date).format('DD/MM/YYYY') + ' at '
          + lastTime.location;
        this.seedTimeTip.open();
      } else {
        if (this.seedTimeTip !== undefined) {
          this.seedTimeTip.close();
        }
        this.seedTimeTip.ngbTooltip = 'No previous times in the event available!';
        this.seedTimeTip.open();
      }
    });
  }

  clickPersonalBest() {
    this.memberHistoryService.getPersonalBest(this.memberNo, this.meetEvent.event_distance.metres,
      this.meetEvent.event_discipline.discipline,
      this.meetEvent.event_distance.course).subscribe((personalBests) => {

      if (personalBests !== null && personalBests.length > 0) {

        this.eventEntryForm.controls['seedTime'].patchValue(
          this.timePipe.transform(personalBests[0].seconds), {});

        // TODO: fix
        if (this.seedTimeTip !== undefined) {
          this.seedTimeTip.close();
        }
        this.seedTimeTip.ngbTooltip = 'Your time from ' + moment(personalBests[0].event_date).format('DD/MM/YYYY') + ' at '
          + personalBests[0].location;
        this.seedTimeTip.open();
      } else {
        if (this.seedTimeTip !== undefined) {
          this.seedTimeTip.close();
        }
        this.seedTimeTip.ngbTooltip = 'No previous times in the event available!';
        this.seedTimeTip.open();
      }

    });
  }

  hasEventName() {
    if (this.meetEvent.eventname !== undefined && this.meetEvent.eventname !== null) {
      if (this.meetEvent.eventname.trim() !== '') {
        return true;
      }
    }
    return false;
  }

  isExhibition() {
    console.log(this.meetEvent.exhibition);
  }

  mouseEnter() {
    if (this.entered === true) {
      this.enterClass = 'btn btn-danger';
      this.enterText = this.cancelButtonCaption;
      this.btnIconClass = this.cancelButtonIcon;
    }
  }

  mouseLeave() {
    if (this.entered === false) {
      this.enterClass = 'btn btn-outline-primary';
      this.enterText = this.enterButtonCaption;
      this.btnIconClass = null;
    } else if (this.entered === true) {
      this.enterClass = 'btn btn-success';
      this.enterText = this.enteredButtonCaption;
      this.btnIconClass = this.enteredButtonIcon;
    }
  }

  fixSeedTime() {
    const initialSeedTime = this.eventEntryForm.controls['seedTime'].value;
    const correctedSeedTime = TimeService.rewriteTimeEM(initialSeedTime);
    this.eventEntryForm.patchValue({
      seedTime: correctedSeedTime
    });

    if (initialSeedTime !== correctedSeedTime) {
      this.seedTimeTip.close();
      if (this.fixCount > 0) {
        this.seedTimeTip.ngbTooltip = 'Need help entering a time? Click More';
      } else {
        this.seedTimeTip.ngbTooltip = 'Your entered seed time has been reformatted!';
      }
      this.seedTimeTip.open();
    }

    this.fixCount++;
  }

  isRelay() {
    if (this.meetEvent.legs > 1) {
      return true;
    } else {
      return false;
    }
  }

  isPostal() {
    if (this.meetEvent.event_type.typename.includes('Postal')) {
      return true;
    } else {
      return false;
    }
  }

  isTimeReasonable(newSeedTime) {
    // console.log('isTimeResaonable: ' + newSeedTime);
    const minTime = (this.meetEvent.event_distance.metres / 25) * 7;
    const maxTime = (this.meetEvent.event_distance.metres / 25) * 80;

    if (newSeedTime !== 0) {
      if (newSeedTime < minTime) {
        this.seedTimeTooShort = true;
        this.seedTimeTooLong = false;
        this.seedTimeNT = false;
        return false;
      } else if (newSeedTime > maxTime) {
        this.seedTimeTooLong = true;
        this.seedTimeTooShort = false;
        this.seedTimeNT = false;
        return false;
      } else {
        this.seedTimeTooLong = false;
        this.seedTimeTooShort = false;
        this.seedTimeNT = false;
      }
      // console.log('Seed time not 0');
    } else {
      console.log('seed time NT')
      this.seedTimeNT = true;
      this.seedTimeTooLong = false;
      this.seedTimeTooShort = false;
    }
    return true;
  }

  enterPressed($event) {
    const target = $event.target;
    target.blur();
  }

}
