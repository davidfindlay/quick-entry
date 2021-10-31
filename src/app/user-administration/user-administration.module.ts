import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserListComponent} from './user-list/user-list.component';
import {UserViewComponent} from './user-view/user-view.component';
import {UserEditComponent} from './user-edit/user-edit.component';
import {UserAdministrationRoutingModule} from './user-administration-routing.module';
import {NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    UserListComponent,
    UserViewComponent,
    UserEditComponent
  ],
  imports: [
    UserAdministrationRoutingModule,
    SharedModule,
    NgbModule,
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    CommonModule
  ]
})
export class UserAdministrationModule { }
