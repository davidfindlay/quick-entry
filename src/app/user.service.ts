import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {AuthenticationService} from './authentication/authentication.service';
import {User} from './models/user';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';
import {BehaviorSubject} from 'rxjs';

import { environment } from '../environments/environment';

@Injectable()
export class UserService {

    authSub: Subscription;
    userChanged = new BehaviorSubject<User>(null);
    memberChanged = new BehaviorSubject<User>(null);

    user;
    member;

    currentMemberships;
    previousMemberships;

    constructor(private http: HttpClient,
                private authenticationService: AuthenticationService) {
        this.init();
    }

    init() {
        this.user = this.authenticationService.getUser();
        this.userChanged.next(this.user);
        if (this.user) {
            this.loadMember();
        }

        this.authSub = this.authenticationService.authenticationChanged
            .subscribe((user: User) => {
                console.log('authentication changed');
                this.user = user;
                this.userChanged.next(this.user);
                if (this.user !== null) {
                    this.loadMember();
                } else {
                  this.member = null;
              }
            });

    }

    loadMember() {

        console.log('Attempt to load member');

        this.http.get(environment.api + 'member/' + this.user.member)
            .subscribe(member => {
                this.member = member;
                console.log(this.member);
                this.currentMemberships = this.loadCurrentMemberships();
                this.previousMemberships = this.loadPreviousMemberships();
                this.memberChanged.next(this.member);
        });
    }

    getUsers(): User {
        return this.user;
    }

    // Returns the member if the user has one
    getMember() {
        if (this.user) {
            if (this.member) {
                return this.member;
            } else {
                return null;
            }
        }
    }

    isMember() {
        if (this.member !== undefined && this.member !== null) {
            return true;
        } else {
            return false;
        }
    }

    // Returns current memberships
    loadCurrentMemberships() {
        const currentMemberships = [];

        if (this.member) {
            this.member.memberships.forEach(ms => {
                const start = moment(ms.startdate, 'YYYY-MM-DD');
                const end = moment(ms.enddate, 'YYYY-MM-DD');
                if (start <= moment() && end >= moment()) {
                    let alreadyIn = false;
                    currentMemberships.forEach(pm => {
                        if (ms.club_id === pm.club_id) {
                            alreadyIn = true;
                        }
                    });
                    if (alreadyIn === false) {
                        currentMemberships.push(ms);
                    }
                }
            });
        }

        console.log(currentMemberships);
        return currentMemberships;
    }

    // Returns previous memberships
    loadPreviousMemberships() {
        const previousMemberships = [];

        if (this.member) {
            this.member.memberships.forEach(ms => {
                const end = moment(ms.enddate);
                if (end < moment()) {

                    let alreadyIn = false;
                    this.currentMemberships.forEach(pm => {
                        if (ms.club_id === pm.club_id) {
                            alreadyIn = true;
                        }
                    });
                    previousMemberships.forEach(pm => {
                        if (ms.club_id === pm.club_id) {
                            alreadyIn = true;
                        }
                    });
                    if (alreadyIn === false) {
                        previousMemberships.push(ms);
                    }
                }
            });
        }
        return previousMemberships;
    }

    getCurrentMemberships() {
        return this.currentMemberships;
    }

    getPreviousMemberships() {
        return this.previousMemberships;
    }

    isLoggedIn() {
      if (this.user !== undefined && this.user !== null) {
        return true;
      } else {
        return false;
      }
    }
}
