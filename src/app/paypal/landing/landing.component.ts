import { Component, OnInit } from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {EntryService} from '../../entry.service';
import {PaypalService} from '../paypal.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService,
              private entryService: EntryService,
              private paypalService: PaypalService) { }

  ngOnInit() {
    this.paypalService.handleLanding();
  }

}
