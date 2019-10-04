import {MeetEntryStatusCode} from './meet-entry-status-code';

export class MeetEntryStatus {
  entry_id: number;
  code: number;
  changed: Date;
  status: MeetEntryStatusCode;
}
