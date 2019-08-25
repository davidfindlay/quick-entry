/**
 * Created by david on 7/9/17.
 */
import {EventType} from './event-type';
import {EventDistance} from './event-distance';
import {EventDiscipline} from './event-discipline';

export class MeetEvent {

    id: number;
    meet_id: number;
    type: string;
    discipline: string;
    legs: number;
    distance: string;
    metres: number;
    course: string;
    eventname: string;
    prognumber: string;
    progsuffix: string;
    eventfee: string;
    deadline: string;
    exhibition: boolean;
    freetime: boolean;
    timerequired: boolean;

    event_type: EventType;
    event_distance: EventDistance;
    event_discipline: EventDiscipline;

}
