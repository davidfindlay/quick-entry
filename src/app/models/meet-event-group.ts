import {MeetEventRule} from './meet-event-rule';
import {MeetEventGroupItem} from './meet-event-group-item';

export class MeetEventGroup {
  id: number;
  meet_id: number;
  max_choices: number;
  groupname: string;
  rules: MeetEventRule[];
  events: MeetEventGroupItem[];
}
