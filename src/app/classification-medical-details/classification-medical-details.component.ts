import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {PlatformLocation} from "@angular/common";
import {UserService} from "../user.service";
import {MeetService} from "../meet.service";
import {AuthenticationService} from "../authentication.service";
import {Meet} from "../models/meet";
import {ReplaySubject, Subject} from "rxjs";
import {MembershipDetails} from "../models/membership-details";
import {EntryService} from "../entry.service";
import {MedicalDetails} from "../models/medical-details";

@Component({
  selector: 'app-classification-medical-details',
  templateUrl: './classification-medical-details.component.html',
  styleUrls: ['./classification-medical-details.component.css']
})
export class ClassificationMedicalDetailsComponent implements OnInit {

  private formValidSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>();

  meet_id: number;
  meet: Meet;
  meetName: string;

  medicalDetailsForm: FormGroup;

  noMedicalCert = false;
  hasMedicalCert = false;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private location: PlatformLocation,
              private userService: UserService,
              private meetService: MeetService,
              private entryService: EntryService,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.meet_id = +this.route.snapshot.paramMap.get('meet');
    this.meet = this.meetService.getMeet(this.meet_id);
    if (this.meet) {

      this.meetName = this.meet.meetname;
    }

    this.createForm();
  }

  createForm() {
    this.medicalDetailsForm = this.fb.group({
      classification: ['no', Validators.required],
      classFreestyle: '',
      classBreaststroke: '',
      classMedley: '',
      dispensation: ['false', Validators.required],
      medicalCondition: ['false', Validators.required],
      medicalCertificate: '',
      medicalDetails: ''
    });

    this.medicalDetailsForm.valueChanges.subscribe(val => {
      if (this.medicalDetailsForm.valid) {
        this.formValidSubject.next(true);
      } else {
        this.formValidSubject.next(false);
      }
    });

    // Set initial value
    console.log(this.medicalDetailsForm.valid);


    if (this.medicalDetailsForm.valid) {
      this.formValidSubject.next(true);
    } else {
      this.formValidSubject.next(false);
    }

  }

  onSubmit($event) {
    console.log('onSubmit received event: ' + $event);

    const medicalDetails: MedicalDetails = Object.assign({}, this.medicalDetailsForm.value);
    console.log(medicalDetails);

    this.entryService.setMedicalDetails(this.meet_id, medicalDetails);

  }

}
