import { Component, OnInit } from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {EntryService} from '../../entry.service';
import {PaypalService} from '../paypal.service';

@Component({
  selector: 'app-departure',
  templateUrl: './departure.component.html',
  styleUrls: ['./departure.component.css']
})
export class DepartureComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService,
              private entryService: EntryService,
              private paypalService: PaypalService) { }

  ngOnInit() {
    // this.spinner.show();
  }

}
