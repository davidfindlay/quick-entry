import {Club} from './club';
import {Member} from './member';
import {MeetEntryEvent} from './meet-entry-event';
import {MeetEntryStatus} from './meet-entry-status';
import {MeetEntryPayment} from './meet-entry-payment';

export class MeetEntry {
  id: number;
  meet_id: number;
  member_id: number;
  member: Member;
  age_group_id: number;
  meals: number;
  medical: boolean;
  cost: number;
  notes: string;
  club_id: number;
  club: Club;
  cancelled: boolean;
  massages: number;
  programs: number;
  lodged_by: number;
  disability_status: number;
  disability_s_id: number;
  disability_sb_id: number;
  disability_sm_id: number;
  medical_condition: boolean;
  medical_safety: boolean;
  medical_details: string;
  events: MeetEntryEvent[];
  status: MeetEntryStatus;
  payments: MeetEntryPayment[];
  code: string;
  created_at: Date;
  updated_at: Date;
}
