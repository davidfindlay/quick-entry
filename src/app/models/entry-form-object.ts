import {EntryEvent} from './entryevent';
import {EntrantDetails} from './entrant-details';
import {MembershipDetails} from './membership-details';
import {MedicalDetails} from './medical-details';
import {PaymentOption} from './paymentoption';
import {MealMerchandiseDetails} from './meal-merchandise-details';

export class EntryFormObject {

  id: number;
  meetId: number;

  entrantDetails: EntrantDetails;
  membershipDetails: MembershipDetails;
  medicalDetails: MedicalDetails;
  paymentOptions: PaymentOption;
  mealMerchandiseDetails: MealMerchandiseDetails;

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

  edit_mode: boolean;
  edit_entry_id: number;
  edit_paid: number;

  status: number;

}
