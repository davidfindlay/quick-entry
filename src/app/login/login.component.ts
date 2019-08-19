import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication/authentication.service';
import 'rxjs/add/operator/catch';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    model: any = {};
    loading = false;
    error = '';

    constructor(private router: Router,
                private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();

    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {
                console.log('Logged in');
                this.router.navigate(['/']);
            },
            err => {
                // login failed
                console.log('Login component advised of failed login');
                this.error = 'Username or password is incorrect';
                this.loading = false;
            });
    }

}
