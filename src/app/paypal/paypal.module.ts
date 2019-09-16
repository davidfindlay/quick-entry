import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartureComponent } from './departure/departure.component';
import { LandingComponent } from './landing/landing.component';
import {PaypalService} from './paypal.service';
import {NgxSpinnerModule} from 'ngx-spinner';

@NgModule({
  declarations: [DepartureComponent, LandingComponent],
  imports: [
    CommonModule,
    NgxSpinnerModule
  ],
  providers: [
    PaypalService
  ]
})
export class PaypalModule { }
