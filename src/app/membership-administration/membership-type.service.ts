import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembershipTypeService {

  constructor(private http: HttpClient) { }

  getMembershipTypes() {
    return this.http.get(environment.api + 'membership/types');
  }

  addType(membershipType) {
    return this.http.post(environment.api + 'membership/types', membershipType);
  }

  updateType(membershipType) {
    return this.http.put(environment.api + 'membership/types/' + membershipType.id, membershipType);
  }
}
