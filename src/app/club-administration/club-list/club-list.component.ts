import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Club} from '../../models/club';
import {ClubsService} from '../../clubs.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-club-list',
  templateUrl: './club-list.component.html',
  styleUrls: ['./club-list.component.css']
})
export class ClubListComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  dtOptions: any = {
    columnDefs: [{
      targets: [ 0 ],
      class: 'text-center',
      width: '5%'
      },
      {
        targets: [ 1 ],
        class: 'text-center',
        width: '5%'
      },
      {
        targets: [ 2 ],
        width: '50%'
      },
      {
        targets: [ 3 ],
        width: '5%'
      },
      {
        targets: [ 4 ],
        class: 'text-center',
        width: '5%'
      },
      {
        targets: [ 5 ],
        class: 'text-center',
        width: '5%'
      }],
    autoWidth: true
  };
  dtTrigger: Subject<void> = new Subject();

  clubs: Club[];

  constructor(private clubsService: ClubsService,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.clubsService.getAllClubs().subscribe((results: any) => {
      this.clubs = results.clubs;
      this.rerender();
      this.spinner.hide();
    });
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
      // dtInstance.table.columns.adjust().draw();
    });
  }

  getNumberOfMembers(club) {
    let clubMembers = 0;
    for (const membership of club.memberships) {
      const start = new Date(membership.startdate);
      const end = new Date(membership.enddate);
      const today = new Date();
      if (today > start && today < end) {
        clubMembers++;
      }
    }
    return clubMembers;
  }

  manageClub(clubId) {
    this.router.navigate([clubId], {relativeTo: this.route});
  }

}
