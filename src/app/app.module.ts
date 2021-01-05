import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, Injectable, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {Routes,
    RouterModule} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {MeetService} from './meet.service';
import {HeaderComponent} from './header/header.component';
import { MeetListComponent } from './meet-list/meet-list.component';
import { MeetListItemComponent } from './meet-list-item/meet-list-item.component';
import { EntrantDetailsComponent } from './entrant-details/entrant-details.component';
import { EntryDetailsComponent } from './entry-details/entry-details.component';
import { EntryConfirmComponent } from './entry-confirm/entry-confirm.component';
import { LoginComponent } from './login/login.component';

import { ConfirmCancelComponent } from './confirm-cancel/confirm-cancel.component';
import { WorkflowNavComponent } from './workflow-nav/workflow-nav.component';
import {AuthenticationModule} from './authentication';
import {UserService} from './user.service';
import {EntryService} from './entry.service';
import { MembershipClubDetailsComponent } from './membership-club-details/membership-club-details.component';
import { ClassificationMedicalDetailsComponent } from './classification-medical-details/classification-medical-details.component';
import { EntryPaymentComponent } from './entry-payment/entry-payment.component';
import { EntryConfirmationComponent } from './entry-confirmation/entry-confirmation.component';
import { EntryDetailsEventComponent } from './entry-details-event/entry-details-event.component';
import { EventSelectCheckboxComponent } from './event-select-checkbox/event-select-checkbox.component';
import { TimePipe } from './time.pipe';
import { SeedtimeHelperComponent } from './seedtime-helper/seedtime-helper.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { EntryDetailsTotalsComponent } from './entry-details-totals/entry-details-totals.component';
import {NgxPayPalModule} from 'ngx-paypal';
import {NgxSpinnerModule} from 'ngx-spinner';
import {MeetEntryStatusService} from './meet-entry-status.service';
import { SubmittedEntryComponent } from './submitted-entry/submitted-entry.component';
import { PendingEntryComponent } from './pending-entry/pending-entry.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import {PaypalModule} from './paypal/paypal.module';
import {DepartureComponent} from './paypal/departure/departure.component';
import {LandingComponent} from './paypal/landing/landing.component';
import { MeetEntryListComponent } from './meet-entry-list/meet-entry-list.component';
import { PendingEntryListComponent } from './pending-entry-list/pending-entry-list.component';
import { PendingEntryActionComponent } from './pending-entry-action/pending-entry-action.component';
import {MemberService} from './member.service';
import { MeetEntryActionComponent } from './meet-entry-action/meet-entry-action.component';
import { ClubMemberSelectorComponent } from './club-member-selector/club-member-selector.component';

import * as Sentry from '@sentry/browser';
import {environment} from '../environments/environment';
import { MeetEntryContactListComponent } from './meet-entry-contact-list/meet-entry-contact-list.component';
import { EntryMealsMerchandiseComponent } from './entry-meals-merchandise/entry-meals-merchandise.component';
import {MeetDashboardComponent} from './meet-organiser/meet-dashboard/meet-dashboard.component';
import {MeetMerchandiseComponent} from './meet-organiser/meet-merchandise/meet-merchandise.component';
import {MeetOrganiserModule} from './meet-organiser/meet-organiser.module';
import {MeetMerchandiseEditComponent} from './meet-organiser/meet-merchandise-edit/meet-merchandise-edit.component';
import { EntryMerchandiseItemComponent } from './entry-merchandise-item/entry-merchandise-item.component';
import {MerchandiseOrdersComponent} from './meet-organiser/merchandise-orders/merchandise-orders.component';
import {MealOrdersComponent} from './meet-organiser/meal-orders/meal-orders.component';
import {EmergencyContactsComponent} from './meet-organiser/emergency-contacts/emergency-contacts.component';
import {ContactsComponent} from './meet-organiser/contacts/contacts.component';
import {PendingEntriesComponent} from './meet-organiser/pending-entries/pending-entries.component';
import {EntryListComponent} from './meet-organiser/entry-list/entry-list.component';
import { MeetSelectorComponent } from './meet-selector/meet-selector.component';
import { PostalTimeEntryComponent } from './postal-time-entry/postal-time-entry.component';
import { UserListComponent } from './user-list/user-list.component';
import {NgbdSortableHeader} from './sortable.directive';
import { UserEditComponent } from './user-edit/user-edit.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { RegisterComponent } from './register/register.component';

const appRoutes: Routes = [
    { path: '', component: MeetListComponent },
    { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password/:token', component: PasswordResetComponent },
  { path: 'enter/:meet', component: EntrantDetailsComponent },
    { path: 'enter/:meet/step1', component: EntrantDetailsComponent },
    { path: 'enter/:meet/step2', component: MembershipClubDetailsComponent},
  { path: 'enter/:meet/step3', component: ClassificationMedicalDetailsComponent},
  { path: 'enter/:meet/step4', component: EntryDetailsComponent},
  { path: 'enter/:meet/merchandise', component: EntryMealsMerchandiseComponent},
  { path: 'enter/:meet/step5', component: EntryPaymentComponent},
  { path: 'enter/:meet/confirmation', component: EntryConfirmationComponent},
  { path: 'pending-entry-confirmation/:pendingId', component: EntryConfirmationComponent},
  { path: 'entry-confirmation/:entryId', component: EntryConfirmationComponent},
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'paypal-depart', component: DepartureComponent },
  { path: 'paypal-landing', component: LandingComponent },
  { path: 'meet-entries/:meetId', component: MeetEntryListComponent },
  { path: 'meet-entries', component: MeetEntryListComponent },
  { path: 'meet-entry/:entryId', component: MeetEntryActionComponent },
  { path: 'pending-entries/:meetId', component: PendingEntryListComponent },
  { path: 'pending-entries', component: PendingEntryListComponent },
  { path: 'pending-entry/:pendingId', component: PendingEntryActionComponent },
  { path: 'entrant-contact-list', component: MeetEntryContactListComponent },
  { path: 'meet-organiser/:meetId', component: MeetDashboardComponent },
  { path: 'meet-organiser/:meetId/merchandise', component: MerchandiseOrdersComponent },
  { path: 'meet-organiser/:meetId/merchandise/items', component: MeetMerchandiseComponent },
  { path: 'meet-organiser/:meetId/merchandise/items/add', component: MeetMerchandiseEditComponent },
  { path: 'meet-organiser/:meetId/merchandise/items/:merchandiseId/edit', component: MeetMerchandiseEditComponent },
  { path: 'meet-organiser/:meetId/meals', component: MealOrdersComponent },
  { path: 'meet-organiser/:meetId/emergency', component: EmergencyContactsComponent },
  { path: 'meet-organiser/:meetId/contacts', component: ContactsComponent },
  { path: 'meet-organiser/:meetId/pending-entries', component: PendingEntriesComponent },
  { path: 'meet-organiser/:meetId/entry-list', component: EntryListComponent },
  { path: 'meet-organiser/:meetId/dashboard', component: MeetDashboardComponent },
  { path: 'user-list', component: UserListComponent },
  { path: 'user-list/:userId', component: UserEditComponent },
    { path: '**', component: MeetListComponent }
];

Sentry.init({
  dsn: environment.sentryDsn
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    const eventId = Sentry.captureException(error.originalError || error);
    // Sentry.showReportDialog({ eventId });
  }
}


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        MeetListComponent,
        MeetListItemComponent,
        EntrantDetailsComponent,
        EntryDetailsComponent,
        EntryConfirmComponent,
        LoginComponent,
        ConfirmCancelComponent,
        WorkflowNavComponent,
        MembershipClubDetailsComponent,
        ClassificationMedicalDetailsComponent,
        EntryPaymentComponent,
        EntryConfirmationComponent,
        EntryDetailsEventComponent,
        EventSelectCheckboxComponent,
        TimePipe,
        SeedtimeHelperComponent,
        EntryDetailsTotalsComponent,
        SubmittedEntryComponent,
        PendingEntryComponent,
        SidebarMenuComponent,
        MyProfileComponent,
        MeetEntryListComponent,
        PendingEntryListComponent,
        PendingEntryActionComponent,
        MeetEntryActionComponent,
        ClubMemberSelectorComponent,
        MeetEntryContactListComponent,
        EntryMealsMerchandiseComponent,
        EntryMerchandiseItemComponent,
        MeetSelectorComponent,
        PostalTimeEntryComponent,
        UserListComponent,
        NgbdSortableHeader,
        UserEditComponent,
        PasswordResetComponent,
        RegisterComponent
    ],
    entryComponents: [ ConfirmCancelComponent, SeedtimeHelperComponent, PostalTimeEntryComponent ],
  imports: [
    BrowserModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes, {scrollPositionRestoration: 'enabled'}),
    HttpClientModule,
    AuthenticationModule,
    NgxDatatableModule,
    NgxSpinnerModule,
    PaypalModule,
    MeetOrganiserModule
  ],
    providers: [
        MeetService,
        UserService,
        EntryService,
      TimePipe,
      MeetEntryStatusService,
      MemberService,
      { provide: ErrorHandler, useClass: SentryErrorHandler }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
