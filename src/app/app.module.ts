import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

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

const appRoutes: Routes = [
    { path: '', component: AppComponent },
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
    ],
    imports: [
        BrowserModule,
        FormsModule,
        NgbModule.forRoot(),
        RouterModule.forRoot(appRoutes),
        HttpClientModule
    ],
    providers: [
        MeetService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
