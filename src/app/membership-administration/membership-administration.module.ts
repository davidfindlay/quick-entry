import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipTypeAdminComponent } from './membership-type-admin/membership-type-admin.component';
import {MembershipAdministrationRoutingModule} from './membership-administration-routing.module';
import {DataTablesModule} from 'angular-datatables';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MembershipImportComponent } from './membership-import/membership-import.component';
import { SportstgMembersComponent } from './sportstg-members/sportstg-members.component';
import { MembershipImportExceptionsComponent } from './membership-import-exceptions/membership-import-exceptions.component';


@NgModule({
  declarations: [
    MembershipTypeAdminComponent,
    MembershipImportComponent,
    SportstgMembersComponent,
    MembershipImportExceptionsComponent
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
