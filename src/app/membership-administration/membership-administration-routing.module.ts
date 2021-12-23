import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminGuard} from '../admin.guard';
import {MembershipTypeAdminComponent} from './membership-type-admin/membership-type-admin.component';

const routes: Routes = [
  { path: 'member-admin/types', component: MembershipTypeAdminComponent, canActivate: [AdminGuard] }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembershipAdministrationRoutingModule { }
