import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PlatformLocation} from '@angular/common';
import {UserService} from '../user.service';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetService} from '../meet.service';
import {AuthenticationService} from '../authentication.service';
import {Entry} from '../models/entry';
import {EntryService} from '../entry.service';
import {EntrantDetails} from '../models/entrant-details';
import {Subject} from "rxjs";

@Component({
  selector: 'app-entrant-details',
  templateUrl: './entrant-details.component.html',
  styleUrls: ['./entrant-details.component.css']
})
export class EntrantDetailsComponent implements OnInit {

  private formValidSubject: Subject<boolean> = new Subject<boolean>();

  meet_id: number;
  meet;
  meetSub: Subscription;
  meetName: String = '';

  entry: Entry;

  entrantDetailsForm: FormGroup;
  inlineLoginForm: FormGroup;
  inlineRegisterForm: FormGroup;

  member;
  memberSub: Subscription;

  currentMemberships;
  previousMemberships;

  usernameRegister;

  displayLoginForm = false;

  isThirdPartyEntry = false;
  isAnonymousEntry = false;
  isMemberEntry = false;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private location: PlatformLocation,
              private userService: UserService,
              private meetService: MeetService,
              private authenticationService: AuthenticationService,
              private entryService: EntryService) {
    location.onPopState(() => {

      console.log('back pressed');

    });
  }

  ngOnInit() {

    this.formValidSubject.next(false);

    this.meet_id = +this.route.snapshot.paramMap.get('meet');
    this.meet = this.meetService.getMeet(this.meet_id);

    if (this.meet) {

      this.meetName = this.meet.meetname;
    } else {
      // TODO: try to load meet details from web service
      console.log('Unable to load meet details!');
    }

    console.log('Meet: ' + this.meetName);

    this.createForm();

    if (this.authenticationService.getUser() == null) {
      this.isAnonymousEntry = true;
      this.isMemberEntry = true;
    } else {
      this.isAnonymousEntry = false;
    }

    if (this.userService.isMember()) {
      this.isMemberEntry = true;

      this.member = this.userService.getMember();
      this.currentMemberships = this.userService.getCurrentMemberships();
      this.previousMemberships = this.userService.getPreviousMemberships();
    }

    this.memberSub = this.userService.memberChanged.subscribe(member => {

      if (this.userService.isMember()) {

        this.member = member;
        this.currentMemberships = this.userService.getCurrentMemberships();
        this.previousMemberships = this.userService.getPreviousMemberships();

        let firstMembership = 0;

        if (this.currentMemberships.length > 0) {
          firstMembership = this.currentMemberships[0].club_id;
        } else if (this.previousMemberships.length > 0) {
          firstMembership = this.previousMemberships[0].club_id;
        }

        // Supply initial values
        this.entrantDetailsForm.patchValue({
          club_selector: firstMembership
        });

      }

    });

  }

  loadMembershipData() {
    if (this.userService.isMember()) {
      this.member = this.userService.getMember();
      this.isMemberEntry = true;
      this.isAnonymousEntry = false;
    } else {
      this.isMemberEntry = false;
    }
  }

  createForm() {
    this.inlineLoginForm = this.fb.group({
      loginUsername: '',
      loginPassword: ''
    });

    this.inlineRegisterForm = this.fb.group({
      register: ['no'],
      usernameRegister: '',
      password: '',
      confirmpassword: ''
    });

    this.entrantDetailsForm = this.fb.group({
      who: ['me'],
      userFirstName: '',
      userSurname: '',
      userEmail: '',
      userPhone: '',
      entrantFirstName: ['', Validators.required],
      entrantSurname: ['', Validators.required],
      entrantEmail: '',
      entrantPhone: ['', Validators.required],
      entrantDob: ['', Validators.required],
      entrantGender: ['', Validators.required],
      emergencyFirstName: ['', Validators.required],
      emergencySurname: ['', Validators.required],
      emergencyEmail: '',
      emergencyPhone: ['', Validators.required]
    });

    // If filling out form for someone else the username should be email of the person filling the form out
    this.entrantDetailsForm.controls['userEmail'].valueChanges.subscribe(val => {
      // Maintain value for new registration usernames
      if (this.entrantDetailsForm.value.who === 'else') {
        this.inlineRegisterForm.patchValue({
          usernameRegister: val
        });
      }
    });

    // If filling out form for self the username should be entrant's email
    this.entrantDetailsForm.controls['entrantEmail'].valueChanges.subscribe(val => {
      if (this.entrantDetailsForm.value.who === 'me') {
        this.inlineRegisterForm.patchValue({
          usernameRegister: val
        });
      }
    });

    // Handle change from who from me to else
    this.entrantDetailsForm.controls['who'].valueChanges.subscribe(val => {
      if (val === 'me') {
        this.inlineRegisterForm.patchValue({
          usernameRegister: this.entrantDetailsForm.value.entrantEmail
        });
        this.isThirdPartyEntry = false;
      }
      // Maintain value for new registration usernames
      if (val === 'else') {
        this.inlineRegisterForm.patchValue({
          usernameRegister: this.entrantDetailsForm.value.userEmail
        });
        this.isThirdPartyEntry = true;
      }
    });

    this.entrantDetailsForm.valueChanges.subscribe(val => {
      if (this.entrantDetailsForm.valid) {
        this.formValidSubject.next(true);
      } else {
        this.formValidSubject.next(false);
      }
    });

    // Supply initial values
    this.entrantDetailsForm.patchValue({
      who: 'me',
    });

    this.inlineRegisterForm.patchValue({
      register: 'no'
    });

  }

  isUserKnown() {
    if (this.member === null) {
      // console.log("Member is null");
      return false;
    }
    if (typeof this.member === 'undefined') {
      // console.log("Member is undefined");
      return false;
    }
    // console.log("Member is known");
    return true;
  }

  isEntrantKnown() {

    if (this.isUserKnown() && this.entrantDetailsForm.value.who === 'me') {
      return true;
    } else {
      return false;
    }

  }

  isInvalid(controlName) {
    return this.entrantDetailsForm.controls[controlName].touched &&
      this.entrantDetailsForm.controls[controlName].invalid;
  }

  onSubmit($event) {
    console.log('onSubmit received event: ' + $event);
    this.saveEntry();
  }

  showLogin() {
    this.displayLoginForm = true;
  }

  cancelLogin() {
    this.displayLoginForm = false;
  }

  login() {
    console.log('User log in!');

    this.authenticationService.login(this.entrantDetailsForm.value.login_username,
      this.entrantDetailsForm.value.login_password)
      .subscribe(result => {
          if (result === true) {
            // login successful
            console.log('successful login');
            this.isAnonymousEntry = false;

            if (this.userService.isMember()) {
              this.isMemberEntry = true;
            }
          }
        },
        err => {
          // login failed
          console.log('Login component advised of failed login');
          this.member = null;
        });
  }

  saveEntry() {
    const entrantDetails: EntrantDetails = Object.assign({}, this.entrantDetailsForm.value);
    this.entry = new Entry();
    this.entry.entrantDetails = entrantDetails;
    this.entry.meetId = this.meet_id;
    this.entryService.addEntry(this.entry);
  }

}
