import {Component, OnInit} from '@angular/core';
import {Alert} from '../models/alert';
import {Router} from '@angular/router';
import {UserService} from '../user.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  alerts: Alert[] = [];
  userForm: FormGroup;
  showMemberNumberField = true;
  showEmergencyContactDetails = false;

  constructor(private router: Router,
              private userService: UserService,
              private fb: FormBuilder) {
  }

  ngOnInit() {

    this.createForm();
    this.userForm.valueChanges.subscribe((userDetails: any) => {
      if (userDetails.memberType === 'msa') {
        this.showEmergencyContactDetails = false;
        this.showMemberNumberField = true;
      } else {
        this.showEmergencyContactDetails = true;
        this.showMemberNumberField = false;
      }
    });
  }

  save() {

  }

  cancel() {
    this.router.navigate(['/', 'login']);
  }

  createForm() {
    this.userForm = this.fb.group({
      email: '',
      password1: '',
      password2: '',
      firstName: '',
      surname: '',
      dob: '',
      gender: '',
      phone: '',
      memberType: 'msa',
      memberNumber: '',
      emergencyFirstName: '',
      emergencySurname: '',
      emergencyPhone: '',
      emergencyEmail: ''
    });
  }

}
