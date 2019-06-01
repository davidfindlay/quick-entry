export class EntrantDetails {

  // Field for determining if this is a third party entry
  private _who: string;

  // User Details
  private _userFirstName: string;
  private _userSurname: string;
  private _userEmail: string;
  private _userPhone: string;

  // Entrant Details
  private _entrantFirstName: string;
  private _entrantSurname: string;
  private _entrantEmail: string;
  private _entrantPhone: string;
  private _entrantDob: string;
  private _entrantGender: string;

  // Emergency Contact
  private _emergencyFirstName: string;
  private _emergencySurname: string;
  private _emergencyEmail: string;
  private _emergencyPhone: string;

  get userFirstName(): string {
    return this._userFirstName;
  }

  set userFirstName(value: string) {
    this._userFirstName = value;
  }

  get userSurname(): string {
    return this._userSurname;
  }

  set userSurname(value: string) {
    this._userSurname = value;
  }

  get userEmail(): string {
    return this._userEmail;
  }

  set userEmail(value: string) {
    this._userEmail = value;
  }

  get userPhone(): string {
    return this._userPhone;
  }

  set userPhone(value: string) {
    this._userPhone = value;
  }

  get entrantFirstName(): string {
    return this._entrantFirstName;
  }

  set entrantFirstName(value: string) {
    this._entrantFirstName = value;
  }

  get entrantSurname(): string {
    return this._entrantSurname;
  }

  set entrantSurname(value: string) {
    this._entrantSurname = value;
  }

  get entrantEmail(): string {
    return this._entrantEmail;
  }

  set entrantEmail(value: string) {
    this._entrantEmail = value;
  }

  get entrantPhone(): string {
    return this._entrantPhone;
  }

  set entrantPhone(value: string) {
    this._entrantPhone = value;
  }

  get entrantDob(): string {
    return this._entrantDob;
  }

  set entrantDob(value: string) {
    this._entrantDob = value;
  }

  get entrantGender(): string {
    return this._entrantGender;
  }

  set entrantGender(value: string) {
    this._entrantGender = value;
  }

  get emergencyFirstName(): string {
    return this._emergencyFirstName;
  }

  set emergencyFirstName(value: string) {
    this._emergencyFirstName = value;
  }

  get emergencySurname(): string {
    return this._emergencySurname;
  }

  set emergencySurname(value: string) {
    this._emergencySurname = value;
  }

  get emergencyEmail(): string {
    return this._emergencyEmail;
  }

  set emergencyEmail(value: string) {
    this._emergencyEmail = value;
  }

  get emergencyPhone(): string {
    return this._emergencyPhone;
  }

  set emergencyPhone(value: string) {
    this._emergencyPhone = value;
  }

  get who(): string {
    return this._who;
  }

  set who(value: string) {
    this._who = value;
  }
}
