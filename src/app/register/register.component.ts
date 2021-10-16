import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Alert} from '../models/alert';
import {Router} from '@angular/router';
import {UserService} from '../user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RegisterUser} from '../models/register-user';

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

  passwordNotMeetingRequirements = false;

  constructor(private router: Router,
              private userService: UserService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    //
    // this.submitDisabled = false;

    this.createForm();
    this.userForm.valueChanges.subscribe((userDetails: any) => {

      if (userDetails.memberType === 'msa') {
        this.showEmergencyContactDetails = false;
        this.showMemberNumberField = true;
      } else {
        this.showEmergencyContactDetails = true;
        this.showMemberNumberField = false;
      }

      console.log(this.userForm.errors);

    //   //
    //   // if (this.userForm.invalid) {
    //   //   this.submitDisabled = true;
    //   // } else {
    //   //   this.submitDisabled = false;
    //   //   console.log('submit disabled false');
    //   // }
    //
    });
  }

  save() {
    let dob = null;
    let gender = null;

    if (this.userForm.controls.dob.value !== '') {
      dob = this.userForm.controls.dob.value
    }

    if (this.userForm.controls.gender.value !== '') {
      gender = this.userForm.controls.gender.value
    }

    const userDetails = <RegisterUser>{
      email: this.userForm.controls.email.value,
      password: this.userForm.controls.password1.value,
      confirmPassword: this.userForm.controls.password2.value,
      firstname: this.userForm.controls.firstName.value,
      surname: this.userForm.controls.surname.value,
      dob: dob,
      gender: gender,
      phone: this.userForm.controls.phone.value,
      emergency_firstname: this.userForm.controls.emergencyFirstName.value,
      emergency_surname: this.userForm.controls.emergencySurname.value,
      emergency_phone: this.userForm.controls.emergencyPhone.value,
      emergency_email: this.userForm.controls.emergencyEmail.value,
      memberType: this.userForm.controls.memberType.value,
      memberNumber: this.userForm.controls.memberNumber.value
    };

    console.log(userDetails);

    this.userService.register(userDetails).subscribe((registered: any) => {
      if (registered.success) {
        this.router.navigate(['/']);
      }
    }, (error) => {
      console.log(error);
      const alert = new Alert();
      alert.message = error.message;
      alert.type = 'warning';
      this.alerts.push(alert);
    });
  }

  cancel() {
    this.router.navigate(['/', 'login']);
  }

  createForm() {
    this.userForm = this.fb.group({
      email: ['', Validators.required],
      password1: ['', [Validators.required, Validators.pattern('^(?=\\D*\\d)\\S{5,}$')]],
      password2: [''],
      firstName: ['', Validators.required],
      surname: ['', Validators.required],
      dob: '',
      gender: '',
      phone: ['', Validators.required],
      memberType: ['msa', Validators.required],
      memberNumber: '',
      emergencyFirstName: '',
      emergencySurname: '',
      emergencyPhone: '',
      emergencyEmail: ''
    }, { validators: this.checkPasswords });
  }

  closeAlert(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  get email() { return this.userForm.get('email') }
  get password1() { return this.userForm.get('password1') }
  get password2() { return this.userForm.get('password2') }
  get firstName() { return this.userForm.get('firstName') }
  get surname() { return this.userForm.get('surname') }
  get phone() { return this.userForm.get('phone') }
  get memberType() { return this.userForm.get('memberType') }

  checkPasswords(group: FormGroup) {
    const password = group.get('password1').value;
    const confirmPassword = group.get('password2').value;

    console.log(password === confirmPassword ? null : { notSame: true });

    return password === confirmPassword ? null : { notSame: true }
  }
}
