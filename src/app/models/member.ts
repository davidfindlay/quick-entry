import {MemberMeetAccess} from './member-meet-access';

export class Member {
  id: number;
  number: string;
  surname: string;
  firstname: string;
  othernames: string;
  dob: Date;
  gender: number;
  address: number;
  postal: number;
  meet_access: MemberMeetAccess[];
}
