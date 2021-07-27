import {Member} from './member';

export class ClubRole {
  id: number;
  member_id: number;
  club_id: number;
  role_id: number;
  member: Member;
}
