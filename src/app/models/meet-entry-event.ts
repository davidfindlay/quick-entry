export class MeetEntryEvent {
  id: number;
  meet_entry_id: number;
  event_id: number;
  member_id: number;
  relay_id: number;
  leg: number;
  seedtime: number;
  cost: number;
  paid: number;
  cancelled: boolean;
  scratched: boolean;
}
