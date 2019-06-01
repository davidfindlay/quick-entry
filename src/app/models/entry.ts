import {EntryEvent} from './entryevent';
import {EntrantDetails} from './entrant-details';
import {MembershipDetails} from "./membership-details";
import {MedicalDetails} from "./medical-details";

export class Entry {

    private _id: number;
    private _meetId: number;

   private _entrantDetails: EntrantDetails;
   private _membershipDetails: MembershipDetails;
   private _medicalDetails: MedicalDetails;

    // Membership
    private _memberType: string;
    private _memberNumber: string;

    // Club
    private _noClub: string;
    private _clubId: number;
    private _clubName: string;
    private _clubCode: string;
    private _clubCountry: string;

    // Events
    private _entryEvents: EntryEvent[];

  get id(): number {
    return this._id;
  }

  get meetId(): number {
    return this._meetId;
  }

  set meetId(value: number) {
    this._meetId = value;
  }

  get memberType(): string {
    return this._memberType;
  }

  set memberType(value: string) {
    this._memberType = value;
  }

  get memberNumber(): string {
    return this._memberNumber;
  }

  set memberNumber(value: string) {
    this._memberNumber = value;
  }

  get noClub(): string {
    return this._noClub;
  }

  set noClub(value: string) {
    this._noClub = value;
  }

  get clubId(): number {
    return this._clubId;
  }

  set clubId(value: number) {
    this._clubId = value;
  }

  get clubName(): string {
    return this._clubName;
  }

  set clubName(value: string) {
    this._clubName = value;
  }

  get clubCode(): string {
    return this._clubCode;
  }

  set clubCode(value: string) {
    this._clubCode = value;
  }

  get clubCountry(): string {
    return this._clubCountry;
  }

  set clubCountry(value: string) {
    this._clubCountry = value;
  }

  get entryEvents(): EntryEvent[] {
    return this._entryEvents;
  }

  set entryEvents(value: EntryEvent[]) {
    this._entryEvents = value;
  }

  get entrantDetails(): EntrantDetails {
    return this._entrantDetails;
  }

  set entrantDetails(value: EntrantDetails) {
    this._entrantDetails = value;
  }

  get memberershipDetails(): MembershipDetails {
    return this._membershipDetails;
  }

  set membershipDetails(value: MembershipDetails) {
    this._membershipDetails = value;
  }

  get medicalDetails(): MedicalDetails {
    return this._medicalDetails;
  }

  set medicalDetails(value: MedicalDetails) {
    this._medicalDetails = value;
  }
}
