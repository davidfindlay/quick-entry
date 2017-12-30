import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PlatformLocation} from '@angular/common';

@Component({
  selector: 'app-entrant-details',
  templateUrl: './entrant-details.component.html',
  styleUrls: ['./entrant-details.component.css']
})
export class EntrantDetailsComponent implements OnInit {

  entrantDetailsForm: FormGroup;

  constructor(private fb: FormBuilder,
              private location: PlatformLocation) {
    location.onPopState(() => {

      console.log('back pressed');

    });
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.entrantDetailsForm = this.fb.group({
      who: 'who-me',
      user_firstname: '',
      user_surname: '',
      user_email: '',
      user_phone: '',
      entrant_firstname: ['', Validators.required],
      entrant_surname: ['', Validators.required],
      entrant_email: '',
      entrant_phone: '',
      entrant_dob: ['', Validators.required],
      entrant_gender: '',
      emergency_firstname: '',
      emergency_surname: '',
      emergency_email: '',
      emergency_phone: '',
      entrant_classification: '',
      member_type: '',
      member_number: '',
      not_affiliated: false,
      club_name: '',
      club_code: '',
      club_country: ''
    });

    // Supply initial values
    this.entrantDetailsForm.patchValue({
      who: 'who-me'
    });

    this.entrantDetailsForm.valueChanges.subscribe(val => {
      console.log(val);
    });
  }

}
