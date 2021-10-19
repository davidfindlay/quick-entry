import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminGuard} from '../admin.guard';
import {UserEditComponent} from './user-edit/user-edit.component';
import {UserViewComponent} from './user-view/user-view.component';
import {UserListComponent} from './user-list/user-list.component';

const routes: Routes = [
  { path: 'user-admin/:userId', component: UserViewComponent, canActivate: [AdminGuard] },
  { path: 'user-admin/:userId/edit', component: UserEditComponent, canActivate: [AdminGuard] },
  { path: 'user-admin', component: UserListComponent, canActivate: [AdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAdministrationRoutingModule { }
