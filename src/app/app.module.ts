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

const appRoutes: Routes = [
    { path: '', component: MeetListComponent },
    { path: 'login', component: LoginComponent },
  { path: 'enter/:meet', component: EntrantDetailsComponent },
    { path: 'enter/:meet/step1', component: EntrantDetailsComponent },
    { path: 'enter/:meet/step2', component: MembershipClubDetailsComponent},
  { path: 'enter/:meet/step3', component: ClassificationMedicalDetailsComponent},
  { path: 'enter/:meet/step4', component: EntryDetailsComponent},
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
    { path: '**', component: MeetListComponent }
];

Sentry.init({
  dsn: 'https://42bf4739de1440ff92f4ffd3475ab87a@sentry.io/1768736'
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    const eventId = Sentry.captureException(error.originalError || error);
    Sentry.showReportDialog({ eventId });
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
        ClubMemberSelectorComponent
    ],
    entryComponents: [ ConfirmCancelComponent, SeedtimeHelperComponent ],
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
    PaypalModule
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
