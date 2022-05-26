import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MeetCalendarViewComponent} from './meet-calendar-view/meet-calendar-view.component';
import {MeetService} from '../meet.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule, Routes} from '@angular/router';
import { NotAuthorisedComponent } from './not-authorised/not-authorised.component';
import {MeetListComponent} from '../meet-list/meet-list.component';
import { MemberSearchComponent } from './member-search/member-search.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import { EntryStatusSelectorComponent } from './entry-status-selector/entry-status-selector.component';

const appRoutes: Routes = [{ path: 'not-authorised', component: NotAuthorisedComponent }];

@NgModule({
  declarations: [
    MeetCalendarViewComponent,
    NotAuthorisedComponent,
    MemberSearchComponent,
    EntryStatusSelectorComponent
  ],
  imports: [
    NgbModule,
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(appRoutes),
    CommonModule
  ],
  providers: [
    MeetService
  ],
  exports: [
    MeetCalendarViewComponent,
    MemberSearchComponent,
    EntryStatusSelectorComponent
  ]
})
export class SharedModule { }
