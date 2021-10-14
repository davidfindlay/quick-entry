import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {MemberService} from '../../member.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DataTableDirective} from 'angular-datatables';

@Component({
  selector: 'app-member-search',
  templateUrl: './member-search.component.html',
  styleUrls: ['./member-search.component.css']
})
export class MemberSearchComponent implements AfterViewInit, OnDestroy, OnInit {

  @Output() onMemberPicked = new EventEmitter<any>();
  @Input('searchPrefill') searchPrefill: string;
  @Input('showDob') showDob: Boolean;
  @Input() clubPreset: string;

  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  dtOptions: any = {
    columnDefs: [{
      targets: [ 0 ],
      visible: false
    }],
    lengthMenu: [ 5 ],
    lengthChange: false,
    searching: false,
    select: true,
    rowCallback: (row: Node, data: any[] | Object, index: number) => {
      const self = this;
      // Unbind first in order to avoid any duplicate handler
      // (see https://github.com/l-lin/angular-datatables/issues/87)
      // Note: In newer jQuery v3 versions, `unbind` and `bind` are
      // deprecated in favor of `off` and `on`
      $('td', row).off('click');
      $('td', row).on('click', () => {
        self.memberClicked(data);
      });
      return row;
    }
  };
  dtTrigger: Subject<void> = new Subject();

  memberSearchForm: FormGroup;
  resultRows = [];
  results;

  memberSearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? [] : this.memberService.findMember(term))
    );

  constructor(private memberService: MemberService,
              private fb: FormBuilder) { }

  ngOnInit() {

    let prefill = '';

    if (this.searchPrefill && this.searchPrefill.trim() !== '') {
      prefill = this.searchPrefill;
    }

    let limitToClub = false;
    if (this.clubPreset) {
      limitToClub = true;
      console.log('Limit to club: ' + this.clubPreset);
    } else {
      console.log('No preset club');
    }

    this.memberSearchForm = this.fb.group({
      memberName: prefill,
      limitToClub: limitToClub
    });

    if (prefill !== '') {
      this.search();
    }
  }

  memberClicked(info: any) {
    const memberId = parseInt(info[0], 10);
    const member = this.results.find(x => x.id === memberId);
    this.onMemberPicked.emit(member);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  memberSelected($event) {

  }

  search() {
    // Clear any previously selected member
    this.onMemberPicked.emit(null);

    this.memberService.findMember(this.memberSearchForm.get('memberName').value).subscribe((results: any) => {
      this.results = results.results;
      this.resultRows = [];
      for (const resultRow of results.results) {
        const dob = new Date(resultRow.dob);

        const clubListCurrent = [];
        const clubListPast = [];
        const clubCodes = [];
        let clubString = '';

        // Convert membership date strings to dates
        for (const membership of resultRow.memberships) {
          membership.startdate = new Date(membership.startdate);
          membership.enddate = new Date(membership.enddate);
        }

        resultRow.memberships.sort((a, b) => (a.enddate < b.enddate) ? 1 : -1);

        for (const membership of resultRow.memberships) {
          if (!membership.club) {
            console.error('Member ship club details are not set!');
            continue;
          }
          const clubCode = membership.club.code;

          if (membership.enddate >= new Date()) {
            if (!clubCodes.includes(clubCode)) {
              clubListCurrent.push(membership.club);
              clubCodes.push(clubCode);
            }

          } else {
            if (!clubCodes.includes(clubCode)) {
              clubListPast.push(membership.club);
              clubCodes.push(clubCode);
            }
          }
        }

        for (const code of clubCodes) {
          if (clubString.length === 0) {
            clubString = code;
          } else {
            clubString += ', ' + code;
          }
        }

        const searchRow = {
          id: resultRow.id,
          surname: resultRow.surname,
          dob: dob,
          firstname: resultRow.firstname,
          number: resultRow.number,
          clubListCurrent: clubListCurrent,
          clubListPast: clubListPast
        };

        // If results are to be limited to club members only, show only insert club members
        if (this.clubPreset && this.memberSearchForm.get('limitToClub').value) {
          for (const club of clubListCurrent)  {
            if (club.id === parseInt(this.clubPreset, 10)) {
              this.resultRows.push(searchRow);
            }
          }
        } else {
          this.resultRows.push(searchRow);
        }
      }
      this.rerender();
    });
  }

}
