import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubListComponent } from './club-list/club-list.component';
import {ClubAdministrationRoutingModule} from './club-administration-router.module';
import {DataTablesModule} from 'angular-datatables';
import {ManageClubComponent} from './manage-club/manage-club.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    ClubListComponent,
    ManageClubComponent
  ],
  imports: [
    DataTablesModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    ClubAdministrationRoutingModule,
    CommonModule
  ]
})
export class ClubAdministrationModule { }
