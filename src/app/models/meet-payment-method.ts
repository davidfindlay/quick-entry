import {PaymentType} from './payment-type';

export class MeetPaymentMethod {
  id: number;
  meet_id: number;
  payment_type_id: number;
  required: number;
  payment_type: PaymentType;
}
