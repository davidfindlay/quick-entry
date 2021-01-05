import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../user.service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {User} from '../models/user';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from 'ngx-spinner';

interface Alert {
  type: string;
  message: string;
}

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  @ViewChild('confirmPasswordReset', {static: false}) confirmPasswordReset;
  @ViewChild('generateNewPassword', {static: false}) generateNewPassword;

  userForm: FormGroup;
  generatePasswordForm: FormGroup;
  user: User;
  updatedUser: User;
  generatedPassword: string;

  alerts: Alert[];

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private modalService: NgbModal,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {

    this.createForm();
    this.createGenerateForm();

    const userId = this.route.snapshot.paramMap.get('userId');

    this.userService.getUser(userId).subscribe((userData: any) => {
      this.user = userData.user;
      this.presetForm(this.user);

      console.log(this.user);
    }, error => {
      console.log(error);
    });
    this.resetAlerts();

    this.userForm.valueChanges.subscribe((user: any) => {
      this.updateModel(user);
    });

    this.generatePasswordForm.valueChanges.subscribe((pass: any) => {
      this.generatedPassword = pass.newPassword;
    });

    this.updatedUser = new User();
    this.updatedUser.id = this.user.id;
  }

  cancel() {
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  updateModel(user) {
    this.updatedUser.id = this.user.id;
    this.updatedUser.username = user.username;
    this.updatedUser.firstname = user.firstName;
    this.updatedUser.surname = user.surname;
    this.updatedUser.email = user.email;
    this.updatedUser.phone = user.phone;
    this.updatedUser.gender = user.gender;
    this.updatedUser.dob = user.dob;
    this.updatedUser.emergency_firstname = user.emergencyFirstName;
    this.updatedUser.emergency_surname = user.emergencySurname;
    this.updatedUser.emergency_phone = user.emergencyPhone;
    this.updatedUser.emergency_email = user.emergencyEmail;
  }

  save() {
    console.log('save');

    this.userService.update(this.updatedUser).subscribe((result: any) => {
      console.log(result);

      if (result.success) {
        this.alerts.push({
          type: 'success',
          message: 'Changes saved.'
        });
      }
    }, (error) => {
      console.error(error);
    });
  }

  passwordGenerate() {
    this.modalService.open(this.generateNewPassword, { size: 'lg' }).result.then((result) => {
      if (result === 'save') {
        const currentAdminUser = this.userService.getUsers();
        this.changePassword(this.user, this.generatedPassword, currentAdminUser.id);
      }
    }, (reason) => {
      // const closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  generateRandomPassword() {
    this.userService.getRandomPassword().subscribe((randPass: any)  => {
      console.log(randPass.password);
      this.generatePasswordForm.patchValue({
        newPassword: randPass.password
      });
    });
  }

  passwordReset() {
    this.modalService.open(this.confirmPasswordReset, { size: 'lg' }).result.then((result) => {
      if (result === 'send') {
        const currentAdminUser = this.userService.getUsers();
        this.sendPasswordReset(this.user.email, currentAdminUser.id);
      }
    }, (reason) => {
      // const closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

  changePassword(user, newPassword, adminUserId) {
    console.log('Change password to ' + newPassword);

    this.spinner.show();

    this.userService.changePassword(user.id, newPassword, adminUserId).subscribe((resetRequest: any) => {
      console.log(resetRequest);
      if (resetRequest.success) {
        this.alerts.push({
          type: 'success',
          message: 'Password has been changed and has been sent to ' + user.email + '.'
        });
      } else {
        this.alerts.push({
          type: 'danger',
          message: resetRequest.message
        });
      }
      this.spinner.hide();
    });
  }

  sendPasswordReset(email, userId) {

    this.spinner.show();

    this.userService.sendPasswordResetRequest(email, userId).subscribe((resetRequest: any) => {
      console.log(resetRequest);
      if (resetRequest.success) {
        this.alerts.push({
          type: 'success',
          message: 'Password reset email has been sent to ' + email + '.'
        });
      } else {
        this.alerts.push({
          type: 'danger',
          message: resetRequest.message
        });
      }
      this.spinner.hide();
    });

  }

  createForm() {
    this.userForm = this.fb.group( {
      username: '',
      firstName: '',
      surname: '',
      email: '',
      phone: '',
      gender: '',
      dob: '',
      emergencyFirstName: '',
      emergencySurname: '',
      emergencyPhone: '',
      emergencyEmail: '',
    });
  }

  createGenerateForm() {
    this.generatePasswordForm = this.fb.group({
      newPassword: {value: '', disabled: true}
    });
  }

  presetForm(user) {
    this.userForm.patchValue({
      username: user.username,
      firstName: user.firstname,
      surname: user.surname,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      dob: user.dob,
      emergencyFirstName: user.emergency_firstname,
      emergencySurname: user.emergency_surname,
      emergencyPhone: user.emergency_phone,
      emergencyEmail: user.emergency_email
    });
  }

  resetAlerts() {
    this.alerts = [];
  }

  closeAlert(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

}
