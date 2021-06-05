import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeetAdministrationComponent } from './meet-administration/meet-administration.component';
import {AdminGuard} from '../admin.guard';

const routes: Routes = [
  { path: 'meet-admin', component: MeetAdministrationComponent, canActivate: [AdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetAdministrationRoutingModule { }
