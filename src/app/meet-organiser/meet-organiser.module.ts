import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetDashboardComponent } from './meet-dashboard/meet-dashboard.component';
import { MeetMerchandiseComponent } from './meet-merchandise/meet-merchandise.component';
import { MeetMerchandiseItemComponent } from './meet-merchandise-item/meet-merchandise-item.component';
import { MeetMerchandiseEditComponent } from './meet-merchandise-edit/meet-merchandise-edit.component';
import {ReactiveFormsModule} from '@angular/forms';
import { MerchandiseOrdersComponent } from './merchandise-orders/merchandise-orders.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { MealOrdersComponent } from './meal-orders/meal-orders.component';
import { EmergencyContactsComponent } from './emergency-contacts/emergency-contacts.component';
import { ContactsComponent } from './contacts/contacts.component';
import { PendingEntriesComponent } from './pending-entries/pending-entries.component';
import { EntryListComponent } from './entry-list/entry-list.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    MeetDashboardComponent,
    MeetMerchandiseComponent,
    MeetMerchandiseItemComponent,
    MeetMerchandiseEditComponent,
    MerchandiseOrdersComponent,
    MealOrdersComponent,
    EmergencyContactsComponent,
    ContactsComponent,
    PendingEntriesComponent,
    EntryListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbModule,
    RouterModule
  ]
})
export class MeetOrganiserModule { }
