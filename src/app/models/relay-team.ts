import {RelayTeamMember} from './relay-team-member';

export class RelayTeam {
  id: number;
  meet_id: number;
  club_id: number;
  meetevent_id: number;
  teamname: string;
  letter: string;
  agegroup: number;
  seedtime: number;
  cost: number;
  paid: number;
  members: RelayTeamMember[];
}
