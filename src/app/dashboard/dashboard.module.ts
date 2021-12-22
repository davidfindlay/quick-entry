import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MeetEntryCountComponent } from './meet-entry-count/meet-entry-count.component';
import { MemberEntryStatsComponent } from './member-entry-stats/member-entry-stats.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    MeetEntryCountComponent,
    MemberEntryStatsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
