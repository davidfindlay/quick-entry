import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

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
import { InfoCardComponent } from './info-card/info-card.component';
import { LoginComponent } from './login/login.component';
import {AuthenticationService} from "./authentication.service";
import {AuthGuard} from "./guards/auth.guard";
import {UserService} from "./user.service";
import {BaseRequestOptions, HttpModule} from "@angular/http";

import { ConfirmCancelComponent } from './confirm-cancel/confirm-cancel.component';
import { WorkflowNavComponent } from './workflow-nav/workflow-nav.component';
import {TokenInterceptor} from "./token.interceptor";

const appRoutes: Routes = [
    { path: '', component: MeetListComponent },
    { path: 'login', component: LoginComponent },
    { path: 'enter', component: EntrantDetailsComponent },
    { path: 'enter-step2', component: EntryDetailsComponent},
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
        InfoCardComponent,
        LoginComponent,
        ConfirmCancelComponent,
        WorkflowNavComponent
    ],
    entryComponents: [ ConfirmCancelComponent ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        RouterModule.forRoot(appRoutes),
        HttpClientModule,
        HttpModule
    ],
    providers: [
        MeetService,
        AuthGuard,
        AuthenticationService,
        UserService,
        BaseRequestOptions,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
