import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetAdministrationComponent } from './meet-administration/meet-administration.component';
import {AppModule} from '../app.module';
import {MeetAdministrationRoutingModule} from './meet-administration-routing.module';
import {SharedModule} from '../shared/shared.module';
import { AddMeetDateComponent } from './add-meet-date/add-meet-date.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [MeetAdministrationComponent, AddMeetDateComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    MeetAdministrationRoutingModule,
    ReactiveFormsModule
  ],
  entryComponents: [AddMeetDateComponent]
})
export class MeetAdministrationModule {}
