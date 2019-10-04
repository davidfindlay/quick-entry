import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import { environment } from '../../environments/environment';
import {MeetEntry} from '../models/meet-entry';
import {IncompleteEntry} from '../models/incomplete_entry';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router ) { }

  createPaymentFinalisedEntry(meetEntry: MeetEntry) {
    return this.http.post(environment.api + 'create_payment_entry/' + meetEntry.id, meetEntry);
  }

  createPaymentIncompleteEntry(incompleteEntry: IncompleteEntry) {
    return this.http.post(environment.api + 'create_payment_incomplete/' + incompleteEntry.id, incompleteEntry);
  }

  finalisePayment(paymentData: any) {
    console.log(paymentData);
    return this.http.post(environment.api + 'finalise_payment/', paymentData);
  }

  handleLanding() {
    // Paypal status
    console.log(this.route.snapshot);
    const paypalSuccess = this.route.snapshot.queryParams['paypalsuccess'];
    const paypalToken = this.route.snapshot.queryParams['token'];
    const paymentId = this.route.snapshot.queryParams['paymentId'];
    const payerID = this.route.snapshot.queryParams['PayerID'];
    const pendingId = this.route.snapshot.queryParams['pending_entry'];
    const entryId = this.route.snapshot.queryParams['meet_entry'];

    if (paypalSuccess !== 'false') {
      console.log('Got paypal success');
      const paymentDetails = {
        paypalSuccess: paypalSuccess,
        paypalToken: paypalToken,
        paymentId: paymentId,
        payerID: payerID
      };

      this.finalisePayment(paymentDetails).subscribe((paid: any) => {
        console.log(paid);
        // this.paidAmount = paid.paid;
        // this.paypalData = paid.paypalPayment;
        // this.showPaymentChoice = false;
        // this.workflowNav.enableFinishButton();
        // this.entryService.setStatus(this.entryService.getIncompleteEntry(this.meet_id), paid.status);
        // this.entryService.deleteEntry(this.meet_id);
        // this.ngxSpinner.hide();

        if (pendingId !== undefined && pendingId !== null) {
          this.router.navigate(['/', 'pending-entry-confirmation', pendingId]);
        }

        if (entryId !== undefined && entryId !== null) {
          this.router.navigate(['/', 'entry-confirmation', entryId]);
        }

      });
    } else {
      if (pendingId !== undefined && pendingId !== null) {
        this.router.navigate(['/', 'pending-entry-confirmation', pendingId]);
      }

      if (entryId !== undefined && entryId !== null) {
        this.router.navigate(['/', 'entry-confirmation', entryId]);
      }
    }
  }

}
