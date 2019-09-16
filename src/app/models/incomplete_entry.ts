import {EntryFormObject} from './entry-form-object';

export class IncompleteEntry {
  id: number;
  code: string;
  meet_id: number;
  user_id: number;
  status_id: number;
  status_label: string;
  status_description: string;
  member_id: number;
  paid_amount: number;
  edit_mode: boolean;
  entrydata: EntryFormObject;
  created_at: Date;
  updated_at: Date;
}
