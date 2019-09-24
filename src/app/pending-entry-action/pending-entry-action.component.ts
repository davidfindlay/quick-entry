import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Meet} from '../models/meet';
import {EntryEvent} from '../models/entryevent';
import {EntryService} from '../entry.service';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {MeetService} from '../meet.service';
import {MemberService} from '../member.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {ClubsService} from '../clubs.service';

@Component({
  selector: 'app-pending-entry-action',
  templateUrl: './pending-entry-action.component.html',
  styleUrls: ['./pending-entry-action.component.css']
})
export class PendingEntryActionComponent implements OnInit {

  @ViewChild('deleteConfirm', {static: true}) deleteConfirm: ElementRef;

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
  pendingReason = '';

  memberSearchResult;
  existingEntries;

  created_at;
  updated_at;

  canBeActioned = false;
  existingEntryShow = false;

  clubName = '';
  clubCode = '';

  editing = false;
  pendingActionForm;

  constructor(private entryService: EntryService,
              private meetService: MeetService,
              private clubService: ClubsService,
              private memberService: MemberService,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              private fb: FormBuilder) { }

  ngOnInit() {

    this.pendingActionForm = this.fb.group({
      entrantSurname: '',
      entrantFirstName: '',
      entrantDob: '',
      entrantGender: '',
      entrantNumber: '',
      entrantClub: ''
    });

    this.pendingEntryId = this.route.snapshot.paramMap.get('pendingId');
    this.entryService.getPendingEntry(this.pendingEntryId).subscribe((entry: any) => {
      this.loadEntry(entry);
    });
  }

  loadEntry(entry) {
    this.incompleteEntry = entry;
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

  toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
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
      entrantNumber: this.entry.membershipDetails.member_number
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
    this.entryService.updatePending(this.pendingEntryId, this.incompleteEntry).subscribe((entry) => {
      this.loadEntry(entry);
    });
  }

  cancel() {
    this.editing = false;
  }
}
