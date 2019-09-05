import {Entry} from './entry';

export class IncompleteEntry {
  id: number;
  code: string;
  meet_id: number;
  user_id: number;
  status_id: number;
  member_id: number;
  entrydata: Entry;
  created_at: Date;
  updated_at: Date;
}
