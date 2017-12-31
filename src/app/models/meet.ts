import {Session} from './session';
import {Event} from "./event";
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
    public contactemail;
    public contactphone;
    public meetfee;
    public mealfee;
    public location;
    public status;
    public maxevents;
    public mealsincluded;
    public mealname;
    public massagefee;
    public programfee;
    public events: Event[];
}
