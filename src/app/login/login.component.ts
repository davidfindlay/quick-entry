import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication/authentication.service';
import 'rxjs/add/operator/catch';
import {NgxSpinnerService} from 'ngx-spinner';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('confirmPasswordReset', {static: false}) confirmPasswordReset;

  model: any = {};
  loading = false;
  error = '';

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private spinner: NgxSpinnerService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
    this.spinner.hide();
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
    this.modalService.open(this.confirmPasswordReset, { size: 'lg' }).result.then((result) => {
      const closeResult = `Closed with: ${result}`;
    }, (reason) => {
      console.log(this.getDismissReason(reason));
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

}
