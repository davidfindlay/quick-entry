export class MeetEntryPayment {
  id: number;
  entry_id: number;
  member_id: number;
  received: Date;
  amount: number;
  method: number;
  comment: string;
  club_id: number;
  created_at: Date;
  updated_at: Date;
}
