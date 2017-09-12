import {Session} from './session';
import {Event} from "./event";
/**
 * Created by david on 7/9/17.
 */

export class Meet {

    private open: string;
    private close: string;
    private name: string;

    private maxindividualevents: number;
    private maxrelayevents: number;
    private maxevents: number;

    private surveyed: string;   // TODO: change to records

    // Sub objects
    private sessions: Session[];
    private events: Event[];

}
