import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipTypeAdminComponent } from './membership-type-admin/membership-type-admin.component';
import {MembershipAdministrationRoutingModule} from './membership-administration-routing.module';
import {DataTablesModule} from 'angular-datatables';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    MembershipTypeAdminComponent
  ],
  imports: [
    CommonModule,
    MembershipAdministrationRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    DataTablesModule
  ]
})
export class MembershipAdministrationModule { }
