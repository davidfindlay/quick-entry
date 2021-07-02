import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeetAdministrationComponent } from './meet-administration/meet-administration.component';
import {AdminGuard} from '../admin.guard';
import {MeetConfigurationComponent} from './meet-configuration/meet-configuration.component';

const routes: Routes = [
  { path: 'meet-admin/:meetId', component: MeetConfigurationComponent, canActivate: [AdminGuard] },
  { path: 'meet-admin', component: MeetAdministrationComponent, canActivate: [AdminGuard] }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetAdministrationRoutingModule { }
