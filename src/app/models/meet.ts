import {Session} from './session';
import {MeetEvent} from './meet-event';
import {Phone} from './phone';
import {Email} from './email';
import {MeetEventGroup} from './meet-event-group';
import {MeetPaymentMethod} from './meet-payment-method';
import {MeetMerchandise} from './meet-merchandise';

/**
 * Created by david on 7/9/17.
 */

export class Meet {

  public id;
  public meetname;
  public startdate: Date;
  public enddate: Date;
  public deadline: Date;
  public contactname;
  public phone: Phone;
  public contactemail;
  public email: Email;
  public contactphone;
  public meetfee;
  public meetfee_non_member;
  public meetfee_nonmember;
  public mealfee;
  public location;
  public status;
  public maxevents;
  public minevents;
  public mealsincluded;
  public mealname;
  public mealdescription;
  public massagefee;
  public programfee;
  public included_events;
  public extra_event_fee;
  public access: any[];
  public sessions: Session[];
  public events: MeetEvent[];

  public groups: MeetEventGroup[];
  public payment_types: MeetPaymentMethod[];
  public merchandise: MeetMerchandise[];
}
