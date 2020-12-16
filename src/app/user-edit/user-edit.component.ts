import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../user.service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {User} from '../models/user';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  @ViewChild('confirmPasswordReset', {static: false}) confirmPasswordReset;
  @ViewChild('generateNewPassword', {static: false}) generateNewPassword;

  userForm: FormGroup;
  user: User;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private modalService: NgbModal) { }

  ngOnInit() {

    this.createForm();

    const userId = this.route.snapshot.paramMap.get('userId');

    this.userService.getUser(userId).subscribe((userData: any) => {
      this.user = userData.user;
      this.presetForm(this.user);

      console.log(this.user);
    }, error => {
      console.log(error);
    });
  }

  cancel() {
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  passwordGenerate() {
    this.modalService.open(this.generateNewPassword, { size: 'lg' }).result.then((result) => {
      const closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // const closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  passwordReset() {
    this.modalService.open(this.confirmPasswordReset, { size: 'lg' }).result.then((result) => {
      const closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // const closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

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
  }

}
