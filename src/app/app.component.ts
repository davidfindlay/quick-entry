import {Component, OnInit} from '@angular/core';

import {environment} from '../environments/environment';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    console.log(environment);
  }

}
