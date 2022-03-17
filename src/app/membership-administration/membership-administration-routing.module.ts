import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminGuard} from '../admin.guard';
import {MembershipTypeAdminComponent} from './membership-type-admin/membership-type-admin.component';
import {MembershipImportComponent} from './membership-import/membership-import.component';
import {MembershipImportExceptionsComponent} from './membership-import-exceptions/membership-import-exceptions.component';
import {SportstgMembersComponent} from './sportstg-members/sportstg-members.component';

const routes: Routes = [
  { path: 'member-admin/types', component: MembershipTypeAdminComponent, canActivate: [AdminGuard] },
  { path: 'member-admin/import', component: MembershipImportComponent, canActivate: [AdminGuard] },
  { path: 'member-admin/exceptions', component: MembershipImportExceptionsComponent, canActivate: [AdminGuard] },
  { path: 'member-admin/sportstg', component: SportstgMembersComponent, canActivate: [AdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembershipAdministrationRoutingModule { }
