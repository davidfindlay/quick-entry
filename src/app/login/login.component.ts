import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication/authentication.service';
import 'rxjs/add/operator/catch';
import {NgxSpinnerService} from 'ngx-spinner';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../user.service';

interface Alert {
  type: string;
  message: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('confirmPasswordReset', {static: false}) confirmPasswordReset;

  model: any = {};
  modelReset: any = {};
  loading = false;
  error = '';

  alerts: Alert[];

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private spinner: NgxSpinnerService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
    this.spinner.hide();
    this.resetAlerts();
  }

  login() {
    this.loading = true;
    this.spinner.show();
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(result => {
          this.spinner.hide();
          console.log('Logged in');
          this.router.navigate(['/']);
        },
        err => {
          this.spinner.hide();
          // login failed
          console.log('Login component advised of failed login');
          this.error = 'Username or password is incorrect';
          this.loading = false;
        });
  }

  clickPasswordReset() {
    if (this.model.username) {
      this.modelReset.resetEmail = this.model.username;
    }
    this.modalService.open(this.confirmPasswordReset, { size: 'lg' }).result.then((result) => {
      if (result === 'send') {
        this.sendPasswordReset(this.modelReset.resetEmail);
      }
    }, (reason) => {
      console.log(this.getDismissReason(reason));
    });
  }

  sendPasswordReset(email) {

    this.spinner.show();

    this.userService.sendPasswordResetRequest(email).subscribe((resetRequest: any) => {
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  resetAlerts() {
    this.alerts = [];
  }

  closeAlert(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

}
