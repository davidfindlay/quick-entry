import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PlatformLocation} from '@angular/common';
import {UserService} from '../user.service';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetService} from '../meet.service';
import {AuthenticationService} from '../authentication/authentication.service';
import {EntryFormObject} from '../models/entry-form-object';
import {EntryService} from '../entry.service';
import {EntrantDetails} from '../models/entrant-details';
import {BehaviorSubject, Subject} from 'rxjs';
import {Behavior} from 'popper.js';
import {RegisterUser} from '../models/register-user';
import {WorkflowNavComponent} from '../workflow-nav/workflow-nav.component';

@Component({
  selector: 'app-entrant-details',
  templateUrl: './entrant-details.component.html',
  styleUrls: ['./entrant-details.component.css']
})
export class EntrantDetailsComponent implements OnInit {

  @ViewChild(WorkflowNavComponent, {static: true}) workflow: WorkflowNavComponent;
  public formValidSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  meet_id: number;
  meet;
  meetSub: Subscription;
  meetName: String = '';

  entry: EntryFormObject;

  entrantDetailsForm: FormGroup;
  inlineLoginForm: FormGroup;
  inlineRegisterForm: FormGroup;

  member;
  memberSub: Subscription;

  usernameRegister;

  displayLoginForm = false;

  isThirdPartyEntry = false;
  isAnonymousEntry = false;
  isMemberEntry = false;

  missingEmergency = false;

  existingSubmittedEntry = false;
  existingSubmittedEntryId;

  unableToRegister = false;
  registeredUsername = null;

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
    this.meetService.loadMeetDetails(this.meet_id);

    this.meet = this.meetService.getMeet(this.meet_id);

    if (this.meet) {

      this.meetName = this.meet.meetname;
    } else {
      // TODO: try to load meet details from web service
      console.log('Unable to load meet details!');
    }

    console.log('Meet: ' + this.meetName);

    this.createForm();

    const existingEntry = this.getExistingEntry();

    if (existingEntry != null) {
      this.entrantDetailsForm.patchValue(existingEntry);

    }

    if (this.entryService.getSubmittedEntries(this.meet_id) !== undefined
      && this.entryService.getSubmittedEntries(this.meet_id) !== null) {
      this.existingSubmittedEntry = true;
      this.existingSubmittedEntryId = this.entryService.getSubmittedEntries(this.meet_id).id;
      this.entrantDetailsForm.patchValue({
        who: 'me-edit'
      });
    }

    if (this.authenticationService.getUser() == null) {
      this.isAnonymousEntry = true;
      this.isMemberEntry = true;
    } else {
      this.isAnonymousEntry = false;
    }

    if (this.userService.isMember()) {
      this.isMemberEntry = true;

      this.member = this.userService.getMember();
    }

    // Get details from user account
    if (this.userService.isLoggedIn()) {
      this.prefillFromUser();
    }

  }

  prefillFromUser() {
    const userDetails = this.userService.getUsers();

    let gender = '';
    if (userDetails.gender === 'M') {
      gender = 'male';
    } else {
      gender = 'female';
    }

    if (this.entrantDetailsForm.controls.who.value === 'me' || this.entrantDetailsForm.controls.who.value === 'me-edit') {
      this.entrantDetailsForm.patchValue({
        entrantFirstName: userDetails.firstname,
        entrantSurname: userDetails.surname,
        entrantDob: userDetails.dob,
        entrantGender: gender,
        entrantEmail: userDetails.email,
        entrantPhone: userDetails.phone,
        emergencyFirstName: userDetails.emergency_firstname,
        emergencySurname: userDetails.emergency_surname,
        emergencyPhone: userDetails.emergency_phone,
        emergencyEmail: userDetails.emergency_email
      });
      if (userDetails.emergency_surname === null || userDetails.emergency_surname === '') {
        this.missingEmergency = true;
      }
    } else if (this.entrantDetailsForm.controls.who.value === 'else') {
      this.entrantDetailsForm.patchValue({
        entrantFirstName: '',
        entrantSurname: '',
        entrantDob: '',
        entrantGender: '',
        entrantEmail: '',
        entrantPhone: '',
        emergencyFirstName: '',
        emergencySurname: '',
        emergencyPhone: '',
        emergencyEmail: '',
        userFirstName: userDetails.firstname,
        userSurname: userDetails.surname,
        userEmail: userDetails.email,
        userPhone: userDetails.phone
      });
    }

    console.log(this.entrantDetailsForm);
  }

  getExistingEntry() {
    const entry = this.entryService.getIncompleteEntryFO(this.meet_id);
    if (entry !== undefined && entry !== null) {
      const entrantDetails = entry.entrantDetails;
      if (entrantDetails !== undefined && entrantDetails != null) {
        return entrantDetails;
      }
    }
    return null;
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
      usernameRegister: {value: '', disabled: true},
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
      emergencySurname: [''],
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
      // Get details from user account
      if (this.userService.isLoggedIn()) {
        this.prefillFromUser();
      }

      if (val === 'me') {
        this.inlineRegisterForm.patchValue({
          usernameRegister: this.entrantDetailsForm.value.entrantEmail
        });
        this.isThirdPartyEntry = false;
      }

      if (val === 'me-edit') {
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
      if (val === 'me') {
        this.inlineRegisterForm.patchValue({
          registerUsername: this.entrantDetailsForm.contains['entrantEmail'].value
        });
      }

      if (val === 'else') {
        this.inlineRegisterForm.patchValue({
          registerUsername: this.entrantDetailsForm.contains['userEmail'].value
        });
      }

      if (this.entrantDetailsForm.valid) {
        if (this.inlineRegisterForm.controls['register'].value === 'yes') {
          this.formValidSubject.next(false);
        } else {
          this.formValidSubject.next(true);
        }
      } else {
        this.formValidSubject.next(false);
      }
    });

    this.inlineRegisterForm.valueChanges.subscribe(val => {
      if (val.register === 'yes') {
        this.formValidSubject.next(false);
      } else {
        if (this.entrantDetailsForm.valid) {
          this.formValidSubject.next(true);
        }
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

    switch ($event) {
      case 'cancel':
        console.log('cancel');
        this.entryService.deleteEntry(this.meet_id);
        break;
      case 'saveAndExit':
        this.saveEntry(false);
        break;
      case 'submit':
        console.log('submit');
        this.saveEntry(true);
        break;
    }

  }

  showLogin() {
    this.displayLoginForm = true;
  }

  cancelLogin() {
    this.displayLoginForm = false;
  }

  login() {
    console.log('User log in!');

    this.authenticationService.login(this.inlineLoginForm.value.loginUsername,
      this.inlineLoginForm.value.loginPassword)
      .subscribe(result => {
        console.log(result);
          if (result !== undefined && result !== null) {
            if (result.access_token !== null) {
              // login successful
              console.log('successful login');
              this.isAnonymousEntry = false;

              if (result.user.member !== null) {
                console.log('is member entry');
                this.isMemberEntry = true;

              }
              this.prefillFromUser();
            }
          }
        },
        err => {
          // login failed
          console.log('Login component advised of failed login');
          this.member = null;
        });
  }

  saveEntry(advance) {
    if (this.existingSubmittedEntry) {
      this.entryService.editSubmittedEntry(this.existingSubmittedEntryId).subscribe((edit: any) => {
        this.processSave(advance);
      });
    } else {
      this.processSave(advance);
    }
  }

  processSave(advance) {
    const entrantDetails: EntrantDetails = Object.assign({}, this.entrantDetailsForm.value);

    // Check for existing entry
    const existingEntry = this.entryService.getIncompleteEntryFO(this.meet_id);
    if (existingEntry == null) {
      console.log('Create new EntryFormObject');
      this.entry = new EntryFormObject();
    } else {
      console.log('Get existing EntryFormObject');
      console.log(existingEntry);
      this.entry = existingEntry;
    }

    this.entry.entrantDetails = entrantDetails;
    this.entry.meetId = this.meet_id;
    this.entryService.addEntry(this.entry).subscribe((incompleteEntry) => {
      console.log(incompleteEntry);
      if (advance) {
        this.workflow.navigateNext();
      }
    });
  }

  register() {

    let newUser;

    if (this.inlineRegisterForm.controls.confirmpassword.touched) {
      if (this.inlineRegisterForm.controls.password.value !== this.inlineRegisterForm.controls.confirmpassword.value) {
        console.log('Passwords don\'t match');
        return;
      }
    }

    if (this.entrantDetailsForm.controls.who.value === 'me') {

      let genderLetter;
      if (this.entrantDetailsForm.controls.entrantGender.value === 'male') {
        genderLetter = 'M';
      } else {
        genderLetter = 'F';
      }

      newUser = <RegisterUser>{
        email: this.entrantDetailsForm.controls.entrantEmail.value,
        password: this.inlineRegisterForm.controls.password.value,
        confirmPassword: this.inlineRegisterForm.controls.confirmpassword.value,
        firstname: this.entrantDetailsForm.controls.entrantFirstName.value,
        surname: this.entrantDetailsForm.controls.entrantSurname.value,
        dob: this.entrantDetailsForm.controls.entrantDob.value,
        gender: genderLetter,
        phone: this.entrantDetailsForm.controls.entrantPhone.value,
        emergency_firstname: this.entrantDetailsForm.controls.emergencyFirstName.value,
        emergency_surname: this.entrantDetailsForm.controls.emergencySurname.value,
        emergency_phone: this.entrantDetailsForm.controls.emergencyPhone.value,
        emergency_email: this.entrantDetailsForm.controls.emergencyEmail.value
      };


    } else if (this.entrantDetailsForm.controls.who.value === 'else') {

      let genderLetter;
      if (this.entrantDetailsForm.controls.entrantGender.value === 'male') {
        genderLetter = 'M';
      } else {
        genderLetter = 'F';
      }

      newUser = <RegisterUser>{
        email: this.entrantDetailsForm.controls.userEmail.value,
        password: this.inlineRegisterForm.controls.password.value,
        confirmPassword: this.inlineRegisterForm.controls.confirmpassword.value,
        firstname: this.entrantDetailsForm.controls.userFirstName.value,
        surname: this.entrantDetailsForm.controls.userSurname.value,
        dob: null,
        gender: null,
        phone: this.entrantDetailsForm.controls.userPhone.value,
        emergency_firstname: null,
        emergency_surname: null,
        emergency_phone: null,
        emergency_email: null
      };

      this.userService.register(newUser).subscribe((userRegistration: any) => {
        if (!userRegistration.success) {
          console.log('unable to register');
          this.unableToRegister = true;
        } else {
          console.log('registered');
          this.unableToRegister = false;
          this.isAnonymousEntry = false;
          this.registeredUsername = userRegistration.user.email;
          this.inlineRegisterForm.patchValue({'register': 'no'});
        }
      });
    }

    this.userService.register(newUser).subscribe((userRegistration: any) => {
      if (!userRegistration.success) {
        console.log('unable to register');
        this.unableToRegister = true;
      } else {
        console.log('registered');
        this.unableToRegister = false;
        this.isAnonymousEntry = false;
        this.registeredUsername = userRegistration.user.email;
        this.inlineRegisterForm.patchValue({'register': 'no'});
      }
    });
  }

}
