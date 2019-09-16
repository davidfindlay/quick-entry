import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PlatformLocation} from '@angular/common';
import {UserService} from '../user.service';
import {MeetService} from '../meet.service';
import {AuthenticationService} from '../authentication/authentication.service';
import {Meet} from '../models/meet';
import {MembershipDetails} from '../models/membership-details';
import {EntryService} from '../entry.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {debounceTime, map, pluck} from 'rxjs/operators';
import {distinctUntilChanged} from 'rxjs/operators';
import {ClubsService} from '../clubs.service';
import {WorkflowNavComponent} from '../workflow-nav/workflow-nav.component';

@Component({
  selector: 'app-membership-club-details',
  templateUrl: './membership-club-details.component.html',
  styleUrls: ['./membership-club-details.component.css']
})
export class MembershipClubDetailsComponent implements OnInit {

  @ViewChild(WorkflowNavComponent, {static: true}) workflow: WorkflowNavComponent;
  public formValidSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  meet_id: number;
  meet: Meet;
  meetName: string;
  memberDetailsForm: FormGroup;

  clubs: string[];

  isThirdPartyEntry = false;
  isAnonymousEntry = true;
  isGuestEntry = false;
  isMemberEntry = false;

  showMemberNumberField = true;
  showClubDetailsSection = true;
  showClubCountryField = false;

  member;
  currentMemberships;
  previousMemberships;

  currentEntry;

  clubSearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? [] : this.clubsService.findClubName(term)),
    );

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private location: PlatformLocation,
              private userService: UserService,
              private meetService: MeetService,
              private entryService: EntryService,
              private authenticationService: AuthenticationService,
              private clubsService: ClubsService) {
    location.onPopState(() => {

      console.log('back pressed');

    });
  }


  ngOnInit() {
    this.createForm();

    this.meet_id = +this.route.snapshot.paramMap.get('meet');
    this.meet = this.meetService.getMeet(this.meet_id);
    if (this.meet) {

      this.meetName = this.meet.meetname;
    }

    this.currentEntry = this.entryService.getIncompleteEntryFO(this.meet_id);

    if (this.currentEntry === undefined || this.currentEntry == null) {
      console.log('No entry in progress');
      // TODO redirect
    }

    if (this.currentEntry.entrantDetails.who === 'else') {
      this.isThirdPartyEntry = true;
    }

    if (this.userService.isMember()) {
      // Got member entry
      console.log('Got member entry');
      this.isMemberEntry = true;

      this.member = this.userService.getMember();
      this.currentMemberships = this.userService.getCurrentMemberships();
      this.previousMemberships = this.userService.getPreviousMemberships();

      if (this.currentMemberships.length > 0) {
        const firstValue = this.currentMemberships[0].club.id;
        console.log('first club id: ' + firstValue);
        this.memberDetailsForm.patchValue({
          club_selector: firstValue
        });
      }
    }

    // this.clubsService.loadClubs();

    const existingEntry = this.getExistingEntry();
    // console.log(existingEntry);

    if (existingEntry !== null) {
      console.log('Got existing entry');
      console.log(existingEntry);
      this.memberDetailsForm.patchValue(existingEntry);
    }

  }

  getExistingEntry() {
    const entry = this.entryService.getIncompleteEntryFO(this.meet_id);
    console.log(entry);
    if (entry !== undefined && entry !== null) {
      const membershipDetails = entry.membershipDetails;
      if (membershipDetails !== undefined && membershipDetails != null) {
        return membershipDetails;
      }
    }
    return null;
  }

  createForm() {
    this.memberDetailsForm = this.fb.group({
      member_type: '',
      member_number: '',
      not_affiliated: false,
      club_name: '',
      club_code: '',
      club_country: 'AUS',
      club_selector: ''
    });

    // If filling out form for someone else the username should be email of the person filling the form out
    this.memberDetailsForm.controls['member_type'].valueChanges.subscribe(val => {
      if (val === 'non_member') {
        this.showClubDetailsSection = false;
      } else {
        this.showClubDetailsSection = true;
      }
      if (val === 'guest') {
        this.showMemberNumberField = false;
        this.isGuestEntry = true;
      } else {
        this.isGuestEntry = false;
      }
      if (val !== 'guest' && val !== 'non_member') {
        this.showMemberNumberField = true;
      }
      if (val === 'international') {
        this.showClubCountryField = true;
      } else {
        this.showClubCountryField = false;
      }
    });

    this.memberDetailsForm.controls['club_selector'].valueChanges.subscribe(val => {
      const clubId = parseInt(val, 10);
      const clubDetails = this.clubsService.getClubById(clubId);
      if (clubDetails !== null) {
        this.memberDetailsForm.patchValue({
          club_code: clubDetails.code,
          club_name: clubDetails.clubname
        });
      }
    });

    // Supply initial values
    this.memberDetailsForm.patchValue({
      member_type: 'msa',
    });

    this.memberDetailsForm.valueChanges.subscribe(val => {
      if (this.memberDetailsForm.valid) {
        this.formValidSubject.next(true);
      } else {
        this.formValidSubject.next(false);
      }
    });

  }

  onSubmit($event) {
    console.log($event);
    switch ($event) {
      case 'cancel':
        this.entryService.deleteEntry(this.meet_id);
        break;
      case 'saveAndExit':
        this.saveEntry();
        break;
      case 'submit':
        this.saveEntry();
        break;
    }
  }

  saveEntry() {
    console.log('Save EntryFormObject');
    const memberDetails: MembershipDetails = Object.assign({}, this.memberDetailsForm.value);

    if (this.userService.isLoggedIn() && !this.isThirdPartyEntry) {
      const member = this.userService.getMember();
      memberDetails.member_number = member.number;
    }

    if (memberDetails.club_selector !== null) {

    }

    this.entryService.setMemberDetails(this.meet_id, memberDetails).subscribe((updated) => {
      console.log(updated);
      this.workflow.navigateNext();
    });
  }

  clubSelected($event) {
    let clubcode = '';
    const clubs = this.clubsService.findClub($event.item);

    if (clubs != null) {
      if (clubs.length > 0) {
        clubcode = clubs[0].code;
      }
    }

    this.memberDetailsForm.controls['club_code'].patchValue(clubcode, {});
  }
}
