import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import { environment } from '../environments/environment';
import {MeetEntry} from './models/meet-entry';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  constructor(private http: HttpClient) { }

  createPaymentFinalisedEntry(meetEntry: MeetEntry) {
    return this.http.post(environment.api + 'create_payment_entry/' + meetEntry.id, meetEntry);
  }

  finalisePayment(paymentData: any) {
    console.log(paymentData);
    return this.http.post(environment.api + 'finalise_payment/', paymentData);
  }

}
