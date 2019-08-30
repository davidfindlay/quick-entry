import {EntryEvent} from './entryevent';
import {EntrantDetails} from './entrant-details';
import {MembershipDetails} from './membership-details';
import {MedicalDetails} from './medical-details';
import {PaymentOption} from './paymentoption';

export class Entry {

  id: number;
  meetId: number;

  entrantDetails: EntrantDetails;
  membershipDetails: MembershipDetails;
  medicalDetails: MedicalDetails;
  paymentOptions: PaymentOption;

  // Membership
  memberType: string;
  memberNumber: string;

  // Club
  noClub: string;
  clubId: number;
  clubName: string;
  clubCode: string;
  clubCountry: string;

  // Events
  entryEvents: EntryEvent[];

  validEvents: boolean;

  incompleteId: number;

  status: number;

}
