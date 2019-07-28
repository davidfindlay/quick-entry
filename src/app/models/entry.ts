import {EntryEvent} from './entryevent';
import {EntrantDetails} from './entrant-details';
import {MembershipDetails} from './membership-details';
import {MedicalDetails} from './medical-details';

export class Entry {

  id: number;
  meetId: number;

  entrantDetails: EntrantDetails;
  membershipDetails: MembershipDetails;
  medicalDetails: MedicalDetails;

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

}
