export class MembershipDetails {

  // Field for determining if this is a third party entry

  private _member_type: string;
  private _member_number: string;
  private _club_name: string;
  private _club_code: string;
  private _club_country: string;
  private _club_selector: string;

  get member_type(): string {
    return this._member_type;
  }

  set member_type(value: string) {
    this._member_type = value;
  }

  get member_number(): string {
    return this._member_number;
  }

  set member_number(value: string) {
    this._member_number = value;
  }

  get club_name(): string {
    return this._club_name;
  }

  set club_name(value: string) {
    this._club_name = value;
  }

  get club_code(): string {
    return this._club_code;
  }

  set club_code(value: string) {
    this._club_code = value;
  }

  get club_country(): string {
    return this._club_country;
  }

  set club_country(value: string) {
    this._club_country = value;
  }

  get club_selector(): string {
    return this._club_selector;
  }

  set club_selector(value: string) {
    this._club_selector = value;
  }
}
