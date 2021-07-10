import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
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
    this.memberSearchForm = this.fb.group({
      memberName: ''
    });
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
    this.memberService.findMember(this.memberSearchForm.get('memberName').value).subscribe((results: any) => {
      this.results = results.results;
      this.resultRows = [];
      for (const resultRow of results.results) {
        const searchRow = {
          id: resultRow.id,
          surname: resultRow.surname,
          firstname: resultRow.firstname,
          number: resultRow.number
        };

        this.resultRows.push(searchRow);
      }
      this.rerender();
    });
  }

}
