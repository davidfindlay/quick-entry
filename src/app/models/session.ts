import {MeetEvent} from './meet-event';

/**
 * Created by david on 7/9/17.
 */

export class Session {
  private id: number;
  private meet_id: number;
  private location: number;
  private name: string;
  private date: string;
  private warmup: string;
  private start: string;
  public events: MeetEvent[];
}
