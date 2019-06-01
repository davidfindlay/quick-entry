import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {PlatformLocation} from "@angular/common";
import {UserService} from "../user.service";
import {MeetService} from "../meet.service";
import {AuthenticationService} from "../authentication.service";
import {Meet} from "../models/meet";
import {EntrantDetails} from "../models/entrant-details";
import {MembershipDetails} from "../models/membership-details";
import {EntryService} from "../entry.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-membership-club-details',
  templateUrl: './membership-club-details.component.html',
  styleUrls: ['./membership-club-details.component.css']
})
export class MembershipClubDetailsComponent implements OnInit {

  private formValidSubject: Subject<boolean> = new Subject<boolean>();

  meet_id: number;
  meet: Meet;
  meetName: string;
  memberDetailsForm: FormGroup;

  isThirdPartyEntry = false;
  isAnonymousEntry = true;
  isGuestEntry = false;

  showMemberNumberField = true;
  showClubDetailsSection = true;
  showClubCountryField = false;

  currentMemberships;
  previousMemberships;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private location: PlatformLocation,
              private userService: UserService,
              private meetService: MeetService,
              private entryService: EntryService,
              private authenticationService: AuthenticationService) {
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
    console.log('onSubmit received event: ' + $event);
    const memberDetails: MembershipDetails = Object.assign({}, this.memberDetailsForm.value);
    console.log(memberDetails);

    this.entryService.setMemberDetails(this.meet_id, memberDetails);
  }
}
