import {Component, OnInit, PipeTransform, QueryList, ViewChildren} from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../models/user';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {FormControl} from '@angular/forms';
import {startWith} from 'rxjs-compat/operator/startWith';
import {debounceTime, map, delay, switchMap, tap} from 'rxjs/operators';
import {UserSearch} from '../user-search.service';
import {NgbdSortableHeader, SortEvent} from '../sortable.directive';
import {ActivatedRoute, Router} from '@angular/router';

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

  users$: Observable<User[]>;
  total$: Observable<number>;

  // searchTerm: string;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  page = 0;
  pageSize = 10;

  constructor(private userService: UserService,
              public userSearchService: UserSearch,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.userService.getUserList().subscribe((users: User[]) => {
      this.usersList = users;
      this.userSearchService.userList = this.usersList;
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
