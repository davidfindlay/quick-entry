import {ApplicationRef, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Meet} from '../models/meet';
import {EntryEvent} from '../models/entryevent';
import {EntryService} from '../entry.service';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {MeetService} from '../meet.service';
import {MemberService} from '../member.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {ClubsService} from '../clubs.service';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {Alert} from '../models/alert';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-pending-entry-action',
  templateUrl: './pending-entry-action.component.html',
  styleUrls: ['./pending-entry-action.component.css']
})
export class PendingEntryActionComponent implements OnInit {

  @ViewChild('deleteConfirm', {static: true}) deleteConfirm: ElementRef;
  @ViewChild('emailConfirm', {static: true}) emailConfirm: ElementRef;

  meet_id;
  meet: Meet;
  meetName;
  meetFee = 0;

  entry;
  incompleteEntry;
  eventEntries: EntryEvent[];

  statusLabel = '';
  statusText = '';

  membershipType = '';
  disabilityClassificationRequired = 'No';
  strokeDispensationRequired = 'No';
  medicalCertificate = 'No';
  medicalCondition = 'No';

  paidAmount = 0;
  pendingEntryId;
  pendingEntryCode;
  pendingReason = '';

  memberSearchResult;
  existingEntries;

  created_at;
  updated_at;
  finalised_at;

  canBeActioned = false;
  existingEntryShow = false;

  clubName = '';
  clubCode = '';

  mealName = '';

  editing = false;
  pendingActionForm;

  alerts: Alert[];

  clubSearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? [] : this.clubService.findClubName(term))
    );

  constructor(private entryService: EntryService,
              private meetService: MeetService,
              private clubService: ClubsService,
              private memberService: MemberService,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              private fb: FormBuilder,
              private cdref: ChangeDetectorRef,
              private appref: ApplicationRef,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit() {

    this.pendingActionForm = this.fb.group({
      entrantSurname: '',
      entrantFirstName: '',
      entrantDob: '',
      entrantGender: '',
      entrantNumber: '',
      entrantClub: '',
      entrantClubCode: ''
    });

    this.pendingEntryCode = this.route.snapshot.paramMap.get('pendingId');
    this.entryService.getPendingEntry(this.pendingEntryCode).subscribe((entry: any) => {
      this.loadEntry(entry);
    });

    this.resetAlerts();
  }

  loadEntry(entry) {
    this.incompleteEntry = entry;
    this.pendingEntryId = entry.id;
    this.entry = this.incompleteEntry.entrydata;
    console.log(entry);
    this.meet_id = entry.meet_id;
    this.meet = this.meetService.getMeet(this.meet_id);
    this.meetName = this.meet.meetname;
    this.meetFee = this.meet.meetfee;
    this.eventEntries = entry.entrydata.entryEvents;
    this.statusLabel = entry.status_label;
    this.statusText = entry.status_description;
    if (this.entry.paymentDetails !== undefined && this.entry.paymentDetails !== null) {
      this.paidAmount = this.entry.paymentDetails.amount;
    }
    this.pendingReason = entry.pending_reason;
    this.created_at = entry.created_at;
    this.updated_at = entry.updated_at;
    this.finalised_at = entry.finalised_at;

    if (this.meet.mealname !== null && this.meet.mealname !== '') {
      this.mealName = this.meet.mealname;
    }

    if (this.entry.membershipDetails.club_selector !== '') {
      const club = this.clubService.getClubById(parseInt(this.entry.membershipDetails.club_selector, 10));
      if (club !== null) {
        this.clubName = club.clubname;
        this.clubCode = club.code;
      }
    } else {
      this.clubCode = this.entry.membershipDetails.club_code;
      this.clubName = this.entry.membershipDetails.club_name;
    }

    // Update the Membership Type field
    this.updateMembershipType();

    if (this.entry.membershipDetails.member_number !== null && this.entry.membershipDetails.member_number !== '') {
      this.memberService.getMemberByNumber(this.entry.membershipDetails.member_number).subscribe((member: any) => {
        console.log(member);
        this.memberSearchResult = member.member;

        this.entryService.getSubmittedEntriesByMemberNumber(this.entry.membershipDetails.member_number, this.meet_id)
          .subscribe((entries: any) => {
            this.existingEntries = entries;
            console.log(this.existingEntries);
            if (this.existingEntries !== undefined && this.existingEntries !== null) {
              if (this.existingEntries.length > 0) {
                this.existingEntryShow = true;
                this.canBeActioned = false;
              } else {
                if (this.memberSearchResult.number === this.entry.membershipDetails.member_number) {
                  this.canBeActioned = true;
                } else {
                  this.canBeActioned = false;
                  console.log('Membership number does not match');
                }
              }
            } else {
              if (this.memberSearchResult.number === this.entry.membershipDetails.member_number) {
                this.canBeActioned = true;
              } else {
                this.canBeActioned = false;
                console.log('Membership number does not match');
              }
            }
          });
      }, (error: any) => {
        console.log('unable to find member');
        this.memberSearchResult = null;
      });
    }
  }

  toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  getLegs(event_id) {
    const events = this.meet.events.filter(x => x.id === event_id);

    if (events.length > 0) {
      return events[0].legs;
    }

    return 1;
  }

  getEventName(event_id) {
    const events = this.meet.events.filter(x => x.id === event_id);

    if (events.length > 0) {
      if (events[0].eventname === null) {
        return '';
      } else {
        return events[0].eventname;
      }
    }

    return '';
  }

  updateMembershipType() {
    if (this.entry.membershipDetails.member_type !== undefined && this.entry.membershipDetails.member_type !== null) {
      switch (this.entry.membershipDetails.member_type) {
        case 'msa': {
          this.membershipType = 'Masters Swimming Australia Member';
          break;
        }
        case 'international': {
          this.membershipType = 'International Masters Swimming Member';
          break;
        }
        case 'guest': {
          this.membershipType = 'Guest Member';
          break;
        }
        case 'non_member': {
          this.membershipType = 'Non-Member';
          break;
        }
        default : {
          this.membershipType = 'Unknown membership type';
        }
      }
    }
  }

  approve() {
    this.entryService.approvePending(this.pendingEntryId).subscribe((approved: any) => {
      console.log(approved);
      this.router.navigate(['/', 'pending-entries', this.meet_id]);
    }, (error: any) => {
      console.log(error);
    });
  }

  delete() {
    this.modalService.open(this.deleteConfirm, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(result);
      if (result === 'Yes') {
        this.entryService.deletePending(this.pendingEntryId).subscribe((deleted: any) => {
          console.log(deleted);
          this.router.navigate(['/', 'pending-entries', this.meet_id]);
        }, (error: any) => {
          console.log(error);
        });
      }
    }, (reason) => {
      console.log(reason)
    });
  }

  markProcessed() {
    this.entryService.processedPending(this.pendingEntryId).subscribe((processed: any) => {
      console.log(processed);
      this.router.navigate(['/', 'pending-entries', this.meet_id]);
    }, (error: any) => {
      console.log(error);
    });
  }

  edit() {
    this.pendingActionForm.patchValue({
      entrantSurname: this.entry.entrantDetails.entrantSurname,
      entrantFirstName: this.entry.entrantDetails.entrantFirstName,
      entrantGender: this.entry.entrantDetails.entrantGender,
      entrantDob: this.entry.entrantDetails.entrantDob,
      entrantNumber: this.entry.membershipDetails.member_number,
      entrantClub: this.entry.membershipDetails.club_name,
      entrantClubCode: this.entry.membershipDetails.club_code
    });

    this.editing = true;
  }

  update() {
    console.log(this.entry);
    this.editing = false;

    this.entry.entrantDetails.entrantSurname = this.pendingActionForm.controls['entrantSurname'].value;
    this.entry.entrantDetails.entrantFirstName = this.pendingActionForm.controls['entrantFirstName'].value;
    this.entry.entrantDetails.entrantGender = this.pendingActionForm.controls['entrantGender'].value;
    this.entry.entrantDetails.entrantDob = this.pendingActionForm.controls['entrantDob'].value;
    this.entry.membershipDetails.member_number = this.pendingActionForm.controls['entrantNumber'].value;
    this.entry.membershipDetails.club_name = this.pendingActionForm.controls['entrantClub'].value;
    this.entry.membershipDetails.club_code = this.pendingActionForm.controls['entrantClubCode'].value;
    this.entryService.updatePending(this.pendingEntryCode, this.incompleteEntry).subscribe((entry) => {
      this.loadEntry(entry);
    });
  }

  cancel() {
    this.editing = false;
  }

  clubSelected($event) {
    let clubcode = '';
    const clubs = this.clubService.findClub($event.item);

    if (clubs != null) {
      if (clubs.length > 0) {
        clubcode = clubs[0].code;
      }
    }

    this.pendingActionForm.controls['entrantClubCode'].patchValue(clubcode, {});
  }

  createEventMembership() {
    console.log('Create Event Membership');
    this.memberService.createMember({
      surname: this.entry.entrantDetails.entrantSurname,
      firstname: this.entry.entrantDetails.entrantFirstName,
      dob: this.entry.entrantDetails.entrantDob,
      gender: this.entry.entrantDetails.entrantGender,
      number: this.entry.membershipDetails.member_number,
      email: this.entry.entrantDetails.entrantEmail,
      phone: this.entry.entrantDetails.entrantPhone,
      club: this.entry.membershipDetails.club_code,
      membershipType: 'Event Membership',
      membershipStatus: 'Guest',
      startdate: this.meet.startdate,
      enddate: this.meet.enddate
    }).subscribe((updates: any) => {
      console.log(updates);
      const memberNumber = updates.member.number;
      this.pendingActionForm.patchValue({
        entrantNumber: memberNumber
      });
      this.entry.membershipDetails.member_number = memberNumber;

      this.entryService.updatePending(this.pendingEntryCode, this.incompleteEntry).subscribe((entry) => {
        this.loadEntry(entry);
      });
    })
  }

  resendEmail() {
    this.modalService.open(this.emailConfirm).result.then((approved: any) => {
      if (approved === 'Yes') {
        this.spinner.show();
        console.log('resendEmail: Yes');
        this.entryService.sendPendingEmailConfirmation(this.pendingEntryId).subscribe((response: any) => {
          if (response.success) {
            this.alerts.push({
              type: 'success',
              message: response.message
            });
          } else {
            this.alerts.push({
              type: 'danger',
              message: response.message
            });
          }
          this.spinner.hide();

        }, (error) => {
          this.alerts.push({
            type: 'danger',
            message: 'Unable to send confirmation email for unknown reason. Please contact the system administrator. '
          });
          this.spinner.hide();
        });
      }

    }, (error: any) => {
      console.log(error);
    });
    this.appref.tick();
  }

  resetAlerts() {
    this.alerts = [];
  }

  closeAlert(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }
}
