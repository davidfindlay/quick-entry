import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminGuard} from '../admin.guard';
import {ClubListComponent} from './club-list/club-list.component';
import {ManageClubComponent} from './manage-club/manage-club.component';

const routes: Routes = [
  { path: 'club-admin', component: ClubListComponent, canActivate: [AdminGuard] },
  { path: 'club-admin/:id', component: ManageClubComponent, canActivate: [AdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClubAdministrationRoutingModule { }
