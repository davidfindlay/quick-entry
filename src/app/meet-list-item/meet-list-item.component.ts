import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import * as moment from 'moment';
import {EntryService} from '../entry.service';
import {Router} from '@angular/router';
import {IncompleteEntry} from '../models/incomplete_entry';
import {MeetEntryStatusService} from '../meet-entry-status.service';
import {MeetEntry} from '../models/meet-entry';
import {UserService} from '../user.service';
import {AuthenticationService} from '../authentication';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmCancelComponent} from '../confirm-cancel/confirm-cancel.component';
import {UnauthenticatedEntryService} from '../unauthenticated-entry.service';
import {Observable} from 'rxjs';
import {EntryFormObject} from '../models/entry-form-object';

@Component({
  selector: 'app-meet-list-item',
  templateUrl: './meet-list-item.component.html',
  styleUrls: ['./meet-list-item.component.css']
})

export class MeetListItemComponent implements OnInit {

  @Input() meet;
  @Input() index: number;

  incompleteSubscription;
  incompleteEntries: IncompleteEntry[] = [];

  pendingSubscription;
  pendingEntries: IncompleteEntry[] = [];

  submittedSubscription;
  submittedEntries: MeetEntry[] = [];

  mealName = 'Meal';

  userDetails;

  loggedIn = false;
  hasEntry = false;

  constructor(private entryService: EntryService,
              private unauthenticatedEntryService: UnauthenticatedEntryService,
              private router: Router,
              private statuses: MeetEntryStatusService,
              private userService: UserService,
              private authService: AuthenticationService,
              private modalService: NgbModal) {
  }

  ngOnInit() {

    if (this.meet.mealname !== null && this.meet.mealname !== '') {
      this.mealName = this.meet.mealname;
    }

    this.incompleteSubscription = this.entryService.incompleteChanged.subscribe((incomplete: IncompleteEntry[]) => {
      console.log(incomplete);

      if (incomplete !== undefined && incomplete !== null) {

        this.incompleteEntries = incomplete.filter(x => x.meet_id === this.meet.id
          && (x.status_id === undefined || x.status_id === 1 || x.status_id === 14));

        console.log(this.incompleteEntries);

        if (this.incompleteEntries.length > 0) {
          this.hasEntry = true;
        } else {
          this.hasEntry = false;
        }
      }
    });

    // console.log(this.meet);
    if (this.userService.isLoggedIn()) {
      this.loggedIn = true;
      // console.log('user is logged in');

      this.submittedSubscription = this.entryService.submittedChanged.subscribe((submitted: MeetEntry[]) => {
        // console.log(submitted);
        if (submitted !== undefined && submitted !== null) {
          this.submittedEntries = submitted.filter(x => x.meet_id === this.meet.id);
          // console.log(this.submittedEntries);
        }
      });

      this.userDetails = this.userService.getUsers();
      // console.log(this.userDetails);
    } else {
      this.submittedSubscription = this.unauthenticatedEntryService.unauthenticatedEntriesChanged
        .subscribe((submitted: MeetEntry[]) => {
        // console.log(submitted);
        if (submitted !== undefined && submitted !== null) {
          this.submittedEntries = submitted.filter(x => x.meet_id === this.meet.id);
          // console.log(this.submittedEntries);
        }
      });

      this.pendingSubscription = this.unauthenticatedEntryService.unauthenticatedPendingEntriesChanged
        .subscribe((submitted: IncompleteEntry[]) => {
          // console.log(submitted);
          if (submitted !== undefined && submitted !== null) {
            this.pendingEntries = submitted.filter(x => x.meet_id === this.meet.id);
            // console.log(this.submittedEntries);
          }
        });

      this.submittedEntries = this.unauthenticatedEntryService.getEntriesByMeet(this.meet.id);
      this.pendingEntries = this.unauthenticatedEntryService.getPendingByMeet(this.meet.id);
      console.log(this.submittedEntries);
      console.log(this.pendingEntries);
    }
  }

  // Returns pretty formatted date of meet
  getMeetDates(): string {

    let formattedDate = '';
    const startdate = '';
    const enddate = '';

    if (startdate === enddate) {
      formattedDate = moment(this.meet.startdate).format('dddd') + ' ' + moment(this.meet.startdate).format('LL');
    } else {
      formattedDate = moment(this.meet.startdate).format('dddd') + ' '
        + moment(this.meet.startdate).format('LL') + ' to '
        + moment(this.meet.enddate).format('dddd') + ' '
        + moment(this.meet.enddate).format('LL');
    }

    return (formattedDate);

  }

  // Returns pretty formatted deadline of meet
  getMeetDeadline(): string {

    const formattedDeadline = moment(this.meet.deadline).format('dddd') + ' ' + moment(this.meet.deadline).format('LL');

    return (formattedDeadline);

  }

  // Determines whether meet is open or not
  isOpen(): boolean {

    const closedstart = moment(this.meet.deadline, 'YYYY-MM-DD', true).add(1, 'days');

    if (moment() >= closedstart) {
      return false;
    } else {
      if (this.meet.status === 1 || this.meet.status === 2) {
        return true;
      }
    }
  }

  /**
   * Determine how far along existing entry is before opening it
   */
  openExistingEntry() {
    const meetId = this.meet.id;
    this.entryService.getIncompleteEntryFO(meetId).subscribe((entry: EntryFormObject) => {
      if (entry !== undefined && entry !== null) {
        if (entry.entrantDetails === undefined) {
          this.router.navigate(['enter', meetId, 'step1']);
        } else if (entry.membershipDetails === undefined) {
          this.router.navigate(['enter', meetId, 'step2']);
        } else if (entry.medicalDetails === undefined) {
          this.router.navigate(['enter', meetId, 'step3']);
        } else {
          this.router.navigate(['enter', meetId, 'step4']);
        }
      } else {
        this.router.navigate(['enter', meetId, 'step1']);
      }
    });
  }

  cancelExistingEntry() {
    const meetId = this.meet.id;

    const modalRef = this.modalService.open(ConfirmCancelComponent);
    modalRef.componentInstance.name = 'meet';
    modalRef.result.then((result) => {
        console.log(result);
        if (result === 'yes') {
          this.entryService.deleteEntry(meetId);
        }
      },
      (reason) => {
        console.log(reason);
      });
  }


}
