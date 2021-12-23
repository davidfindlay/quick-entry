import {MembershipStatus} from './membership-status';

export class MembershipType {
  id: number;
  typename: string;
  startdate: string;
  enddate: string;
  months: number;
  weeks: number;
  status: number;
  membership_status: MembershipStatus;
  active: number;
}
