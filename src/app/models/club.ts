import {BranchRegion} from './branch-region';
import {ClubRole} from './club-role';

export class Club {
  id: number;
  code: string;
  clubname: string;
  branch_region: BranchRegion;
  verified: boolean;
  roles: ClubRole[];
}
