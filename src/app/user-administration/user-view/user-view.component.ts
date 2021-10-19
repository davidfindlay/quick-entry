import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from '../../models/user';
import {ActivatedRoute, Router} from '@angular/router';
import {Member} from '../../models/member';
import {UserService} from '../../user.service';
import {MemberService} from '../../member.service';
import {Alert} from '../../models/alert';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {

  @ViewChild('confirmPasswordReset', {static: false}) confirmPasswordReset;
  @ViewChild('generateNewPassword', {static: false}) generateNewPassword;

  userId: number;
  user: User;
  member: Member;
  noUser = false;

  alerts: Alert[];

  generatePasswordForm: FormGroup;
  generatedPassword: string;

  constructor(private userService: UserService,
              private memberService: MemberService,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              private fb: FormBuilder,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.userId = parseInt(this.route.snapshot.paramMap.get('userId'), 10);
    this.loadUser(this.userId);
    this.createGenerateForm();
    this.resetAlerts();

    this.generatePasswordForm.valueChanges.subscribe((pass: any) => {
      this.generatedPassword = pass.newPassword;
    });
  }

  createGenerateForm() {
    this.generatePasswordForm = this.fb.group({
      newPassword: {value: '', disabled: true}
    });
  }

  resetAlerts() {
    this.alerts = [];
  }

  closeAlert(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  edit() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  cancel() {
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  loadUser(userId) {
    this.userService.getUser(userId).subscribe((userData: any) => {
      this.user = userData.user;

      if (this.user.member) {
        const memberId = parseInt(this.user.member, 10);
        this.memberService.getMember(memberId).subscribe((memberData: any) => {
          this.member = memberData.member;
          console.log(this.member);
        });
      }

    }, error => {
      console.log(error);
      this.noUser = true;
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

  // Check if the member is linked
  memberLinked()  {
    if (this.user) {
      if (this.user.member) {
        return true;
      }
    }
    return false;
  }

}
