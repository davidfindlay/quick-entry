import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../user.service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {User} from '../models/user';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from 'ngx-spinner';
import {MemberService} from '../member.service';
import {Member} from '../models/member';

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
  @ViewChild('linkMember', {static: true}) linkMember: ElementRef;
  @ViewChild('unlinkMember', {static: true}) unlinkMember: ElementRef;

  userForm: FormGroup;
  generatePasswordForm: FormGroup;
  user: User;
  member: Member;
  updatedUser: User;
  generatedPassword: string;

  prefillUser = '';
  linkMemberDetails = '';
  linkMemberDisabled = true;
  linkMemberNumber;

  alerts: Alert[];

  constructor(private userService: UserService,
              private memberService: MemberService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private modalService: NgbModal,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {

    this.createForm();
    this.createGenerateForm();

    const userId = this.route.snapshot.paramMap.get('userId');
    this.loadUser(userId);

    this.resetAlerts();

    this.userForm.valueChanges.subscribe((user: any) => {
      this.updateModel(user);
    });

    this.generatePasswordForm.valueChanges.subscribe((pass: any) => {
      this.generatedPassword = pass.newPassword;
    });

  }

  loadUser(userId) {
    this.userService.getUser(userId).subscribe((userData: any) => {
      this.user = userData.user;
      this.presetForm(this.user);

      if (this.user.member) {
        const memberId = parseInt(this.user.member, 10);
        this.memberService.getMember(memberId).subscribe((memberData: any) => {
          this.member = memberData.member;
        });
      }

      this.updatedUser = new User();
      this.updatedUser.id = this.user.id;

    }, error => {
      console.log(error);
    });
  }

  cancel() {
    this.router.navigate(['..'], {relativeTo: this.route});
  }



  save() {
    console.log('save');

    this.updatedUser.id = this.user.id;
    this.updatedUser.username = this.userForm.get('username').value;
    this.updatedUser.firstname = this.userForm.get('firstName').value;
    this.updatedUser.surname = this.userForm.get('surname').value;
    this.updatedUser.email = this.userForm.get('email').value;
    this.updatedUser.phone = this.userForm.get('phone').value;
    this.updatedUser.gender = this.userForm.get('gender').value;
    this.updatedUser.dob = this.userForm.get('dob').value;
    this.updatedUser.emergency_firstname = this.userForm.get('emergencyFirstName').value;
    this.updatedUser.emergency_surname = this.userForm.get('emergencySurname').value;
    this.updatedUser.emergency_phone = this.userForm.get('emergencyPhone').value;
    this.updatedUser.emergency_email = this.userForm.get('emergencyEmail').value;

    console.log(this.updatedUser);

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

    this.prefillUser = user.firstname + ' ' + user.surname;
  }

  resetAlerts() {
    this.alerts = [];
  }

  closeAlert(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  memberSearch() {
    this.linkMemberDisabled = true;

    this.modalService.open(this.linkMember, {size: 'lg'}).result.then((result: any) => {
      if (result === 'Link Member') {
        console.log('Link ' + this.linkMemberNumber);
        this.userService.linkMember(this.linkMemberNumber, this.user.id).subscribe((linkResult: any) => {
          console.log(linkResult);
          this.loadUser(this.user.id)
        });
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  unlinkMemberClick() {
    this.modalService.open(this.unlinkMember, {size: 'lg'}).result.then((result: any) => {
      if (result === 'Yes') {
        console.log('unlink member click');
        this.userService.unlinkMember(this.user.id).subscribe((unlinkResult: any) => {
          console.log(unlinkResult);
          this.member = null;
          this.loadUser(this.user.id);
        })
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  linkMemberPicked(memberPicked) {
    this.linkMemberDetails = memberPicked.surname +  ', ' + memberPicked.firstname + '(' + memberPicked.number + ')';
    this.linkMemberNumber = memberPicked.number;
    this.linkMemberDisabled = false;
  }

}
