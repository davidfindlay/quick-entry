import {EntryFormObject} from './entry-form-object';
import {MeetEntryStatusCode} from './meet-entry-status-code';
import {MeetEntry} from './meet-entry';

export class IncompleteEntry {
  id: number;
  code: string;
  meet_id: number;
  user_id: number;
  status_id: number;
  status_label: string;
  status_description: string;
  status: MeetEntryStatusCode;
  pending_reason: string;
  member_id: number;
  paid_amount: number;
  edit_mode: boolean;
  entrydata: EntryFormObject;
  created_at: Date;
  updated_at: Date;
  finalised_at: Date;
  meet_entry: MeetEntry;
}
