import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartureComponent } from './departure/departure.component';
import { LandingComponent } from './landing/landing.component';

@NgModule({
  declarations: [DepartureComponent, LandingComponent],
  imports: [
    CommonModule
  ]
})
export class PaypalModule { }
