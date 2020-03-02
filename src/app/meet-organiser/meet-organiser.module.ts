import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetDashboardComponent } from './meet-dashboard/meet-dashboard.component';
import { MeetMerchandiseComponent } from './meet-merchandise/meet-merchandise.component';
import { MeetMerchandiseItemComponent } from './meet-merchandise-item/meet-merchandise-item.component';
import { MeetMerchandiseEditComponent } from './meet-merchandise-edit/meet-merchandise-edit.component';
import {ReactiveFormsModule} from '@angular/forms';
import { MerchandiseOrdersComponent } from './merchandise-orders/merchandise-orders.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    MeetDashboardComponent,
    MeetMerchandiseComponent,
    MeetMerchandiseItemComponent,
    MeetMerchandiseEditComponent,
    MerchandiseOrdersComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ]
})
export class MeetOrganiserModule { }
