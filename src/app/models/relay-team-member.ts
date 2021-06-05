import {Member} from './member';

export class RelayTeamMember {
  id: number;
  relay_team: number;
  member_id: number;
  member: Member;
  leg: number;
}
