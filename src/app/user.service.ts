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

import {environment} from '../environments/environment';
import {Member} from './models/member';

@Injectable()
export class UserService {

  authSub: Subscription;
  userChanged = new BehaviorSubject<User>(null);
  memberChanged = new BehaviorSubject<Member>(null);

  user;
  member;

  currentMemberships;
  previousMemberships;
  clubRoles;

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

    if (this.user.member !== undefined && this.user.member !== null) {

      this.http.get(environment.api + 'member/' + this.user.member)
        .subscribe((member: any) => {

          if (member.success) {
            this.member = member.member;
            console.log(this.member);
            this.currentMemberships = this.loadCurrentMemberships();
            this.previousMemberships = this.loadPreviousMemberships();
            this.clubRoles = this.member.club_roles;
            this.memberChanged.next(this.member);
          }

        });
    }
  }

  getUsers(): User {
    return this.user;
  }

  getUser(userId) {
    return this.http.get(environment.api + 'users/' + userId);
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

  register(userDetails) {
    console.log('Register user');
    return new Observable((observer) => {
      this.http.post(environment.api + 'users/register', userDetails).subscribe((registeredUser: any) => {
        if (registeredUser.success) {
          console.log('Successfully registered new user ' + registeredUser.user.username);

          this.authenticationService.login(registeredUser.user.username, userDetails.password).subscribe((loggedIn) => {
            observer.next(registeredUser);
            observer.complete();
          });

        }
      }, (error: any) => {
        console.log(error.error);
        observer.error(error.error);
        observer.complete();
      });

    });
  }

  update(userDetails) {
    console.log('Update user: ' + userDetails.id);
    console.log(userDetails);
    return this.http.put(environment.api + 'users/' + userDetails.id, userDetails);
  }

  linkMember(memberNumber) {
    return this.http.post(environment.api + 'users/link_member/' + memberNumber, {});
  }

  isUserMeetOrganiser() {
    if (this.member !== undefined && this.member !== null) {
      if (this.member.meet_access !== undefined && this.member.meet_access !== null) {
        if (this.member.meet_access.length > 0) {
          console.log('User/member has meet access');
          return true;
        } else {
          console.log('User/member dose not have meet access');
          return false;
        }
      }
    } else {
      console.log('User/member has meet access');
      return false;
    }
  }

  // TODO: move meet access to primarily by user not member
  getMeetsOrganised() {
    console.log('getMeetsOrganised');
    const meetsOrganised = [];
    const member = this.getMember();
    if (member !== undefined && member !== null) {
      if (member.meet_access !== undefined && member.meet_access !== null) {
        for (let x = 0; x < member.meet_access.length; x++) {
          meetsOrganised.push(member.meet_access[x].meet_id);
        }
      }
    }

    return meetsOrganised;
  }

  getCurrentClubAdmins() {
    return this.clubRoles;
  }

  getUserList() {
    return this.http.get(environment.api + 'users');
  }

  public sendPasswordResetRequest(email, user_id = null) {
    return this.http.post(environment.api + 'reset/' + email, { user_id: user_id });
  }

  public verifyPasswordResetToken(token) {
    return this.http.post(environment.api + 'resetToken/' + token, {});
  }

  public usePasswordResetToken(token, newPassword) {
    return this.http.post(environment.api + 'resetPassword/' + token, {newPassword: newPassword});
  }

  public getRandomPassword() {
    return this.http.get(environment.api + 'generateRandomPassword');
  }

  public changePassword(userId, newPassword, adminUserId) {
    return this.http.post(environment.api + 'changePassword/' + userId, {
      userId: userId,
      newPassword: newPassword,
      adminUserId: adminUserId
    });
  }
}
