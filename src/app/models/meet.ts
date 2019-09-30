import {Session} from './session';
import {MeetEvent} from './meet-event';
import {Phone} from './phone';
import {Email} from './email';
import {MeetEventGroup} from './meet-event-group';
import {MeetPaymentMethod} from './meet-payment-method';

/**
 * Created by david on 7/9/17.
 */

export class Meet {

  public id;
  public meetname;
  public startdate;
  public enddate;
  public deadline;
  public contactname;
  public phone: Phone;
  public contactemail;
  public email: Email;
  public contactphone;
  public meetfee;
  public meetfee_non_member;
  public mealfee;
  public location;
  public status;
  public maxevents;
  public minevents;
  public mealsincluded;
  public mealname;
  public massagefee;
  public programfee;
  public sessions: Session[];
  public events: MeetEvent[];

  public groups: MeetEventGroup[];
  public payment_types: MeetPaymentMethod[];
}
