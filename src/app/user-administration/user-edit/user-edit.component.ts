import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../user.service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {User} from '../../models/user';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from 'ngx-spinner';
import {MemberService} from '../../member.service';
import {Member} from '../../models/member';
import {constructExclusionsMap} from 'tslint/lib/rules/completed-docs/exclusions';

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

  @ViewChild('linkMember', {static: true}) linkMember: ElementRef;
  @ViewChild('unlinkMember', {static: true}) unlinkMember: ElementRef;

  userForm: FormGroup;
  user: User;
  member: Member;
  updatedUser: User;

  prefillUser = '';
  linkMemberDetails = '';
  linkMemberDisabled = true;
  linkMemberNumber;

  showClose = false;

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

    const userId = this.route.snapshot.paramMap.get('userId');
    this.loadUser(userId);

    this.resetAlerts();

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
          this.loadUser(this.user.id);
          this.showClose = true;
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
          this.showClose = true;
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
