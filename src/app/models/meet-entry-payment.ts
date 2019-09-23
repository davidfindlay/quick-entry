import {Club} from './club';
import {Member} from './member';
import {MeetEntryEvent} from './meet-entry-event';
import {MeetEntryStatus} from './meet-entry-status';

export class MeetEntryPayment {
  id: number;
  entry_id: number;
  member_id: number;
  received: string;
  amount: number;
  method: number;
  comment: string;
  club_id: number;
  created_at: Date;
  updated_at: Date;
}
