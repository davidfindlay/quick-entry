import {Component, OnInit, PipeTransform, QueryList, ViewChildren} from '@angular/core';
import {UserService} from '../../user.service';
import {User} from '../../models/user';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {FormControl} from '@angular/forms';
import {startWith} from 'rxjs-compat/operator/startWith';
import {debounceTime, map, delay, switchMap, tap} from 'rxjs/operators';
import {UserSearch} from '../../user-search.service';
import {NgbdSortableHeader, SortEvent} from '../../sortable.directive';
import {ActivatedRoute, Router} from '@angular/router';
import { DateTime } from 'luxon';

interface SearchResult {
  users: User[];
  total: number;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  usersList: User[];
  newUsersList: User[];
  linkedUsersList: User[];
  unlinkedUsersList: User[];

  users$: Observable<User[]>;
  total$: Observable<number>;

  newUsers: number;
  totalUsers: number;
  linkedUsers: number;
  unlinkedUsers: number;

  // searchTerm: string;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  page = 0;
  pageSize = 10;

  constructor(private userService: UserService,
              public userSearchService: UserSearch,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {

    this.userService.getUserList().subscribe((users: User[]) => {
      console.log('Got user list: ' + users.length);

      for (const user of users) {
        if (user.created_at) { user.created_at = new Date(user.created_at); }
        if (user.updated_at) { user.updated_at = new Date(user.updated_at); }
        if (user.last_active) { user.last_active = new Date(user.last_active); }
        if (user.last_login) { user.last_login = new Date(user.last_login); }
      }

      this.usersList = users;
      this.userSearchService.userList = this.usersList;

      this.totalUsers = this.usersList.length;

      const days30 = DateTime.local().minus({days: 30});
      this.newUsersList = this.usersList.filter(x => DateTime.fromJSDate(x.created_at) > days30);
      this.newUsers = this.newUsersList.length;

      this.linkedUsersList = this.usersList.filter(x => x.member);
      this.linkedUsers = this.linkedUsersList.length;
      this.unlinkedUsersList = this.usersList.filter(x => !x.member);
      this.unlinkedUsers = this.unlinkedUsersList.length;

    });

    this.users$ = this.userSearchService.users$;
    this.total$ = this.userSearchService.total$;
  }

  userManagement(userId) {
    console.log('user management pressed ' + userId);
    this.router.navigate([userId], {relativeTo: this.route});
  }

  onSort({column, direction}: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.userSearchService.sortColumn = column;
    this.userSearchService.sortDirection = direction;
  }

}
