import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../user.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AuthService} from 'ngx-auth';
import {AuthenticationService} from '../authentication.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  loading = false;
  model: any = {};
  token: string;
  tokenValid: boolean;
  formValid = false;
  newPassword = '';

  passwordReset: FormGroup;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.passwordReset = this.fb.group({
      password1: '',
      password2: ''
    });

    this.token = this.route.snapshot.paramMap.get('token');

    this.userService.verifyPasswordResetToken(this.token).subscribe((status: any) => {
      console.log(status);
      this.tokenValid = status.valid
    });

    this.passwordReset.valueChanges.subscribe((change: any) => {
      if ((change.password1 === change.password2) && (change.password1.length > 5)) {
        this.formValid = true;
        this.newPassword = change.password1
      } else {
        this.formValid = false;
      }
    });
  }

  clickChangePassword() {

    this.userService.usePasswordResetToken(this.token, this.newPassword).subscribe((status: any) => {
      console.log(status);
      if (status.success) {
        this.router.navigate(['/', 'login']);
      }
    });
  }

  cancel() {
    this.router.navigate(['/', 'login'])
  }

}
