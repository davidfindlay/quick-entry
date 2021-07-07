import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeetAdministrationService {

  constructor(private http: HttpClient) { }

  addMeetDate(meetDetails: any) {
    return this.http.post(environment.api + 'meets', meetDetails);
  }

  publishMeet(meetId, published) {
    return this.http.post(environment.api + 'meets_publish/' + meetId, { publish: published });
  }

  updateMeet(meetDetails: any) {
    return this.http.put(environment.api + 'meets/' + meetDetails.id, meetDetails);
  }

  addPaymentMethod(meetDetails, addMethod) {
    return this.http.post(environment.api +  'meets_payment_method/' + meetDetails.id,
      {paymentMethodId: parseInt(addMethod, 10)});
  }

  removePaymentMethod(meetDetails, removeMethod) {
    return this.http.post(environment.api +  'meets_payment_method_remove/' + meetDetails.id,
      {removePaymentMethod: parseInt(removeMethod, 10)});
  }

  updateEvent(meetId, eventId, eventDetails) {
    return this.http.post(environment.api + 'meets/' + meetId + '/events/' + eventId + '/configure', eventDetails);
  }
}
