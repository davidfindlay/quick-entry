import {MeetEventRule} from './meet-event-rule';

export class MeetEventGroup {
  id: number;
  meet_id: number;
  max_choices: number;
  groupname: string;
  rules: MeetEventRule[];
}
