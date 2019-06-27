import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {EnvironmentSpecificResolver} from './environment-specific-resolver';
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
import {AuthenticationService} from './authentication.service';
import {UserService} from './user.service';
import {EntryService} from './entry.service';
import {EnvironmentSpecificService} from './environment-specific.service';
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

const appRoutes: Routes = [
    { path: '', component: MeetListComponent, resolve: { envSpecific: EnvironmentSpecificResolver } },
    { path: 'login', component: LoginComponent },
    { path: 'enter/:meet/step1', component: EntrantDetailsComponent },
    { path: 'enter/:meet/step2', component: MembershipClubDetailsComponent},
  { path: 'enter/:meet/step3', component: ClassificationMedicalDetailsComponent},
  { path: 'enter/:meet/step4', component: EntryDetailsComponent},
  { path: 'enter/:meet/step5', component: EntryPaymentComponent},
  { path: 'enter/:meet/confirmation', component: EntryConfirmationComponent},
    { path: '**', component: MeetListComponent }
];

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
        EntryDetailsTotalsComponent
    ],
    entryComponents: [ ConfirmCancelComponent, SeedtimeHelperComponent ],
  imports: [
    BrowserModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    AuthenticationModule,
    NgxDatatableModule
  ],
    providers: [
      EnvironmentSpecificService,
      EnvironmentSpecificResolver,
        MeetService,
        UserService,
        AuthenticationService,
        EntryService,
      TimePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
