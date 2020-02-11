import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private http: HttpClient) { }

  getMemberByNumber(memberNumber) {
    console.log('getMemberByNumber: ' + memberNumber);
    if (memberNumber === undefined || memberNumber === null) {
      return null;
    }
    return this.http.get(environment.api + 'member_by_number/' + memberNumber);
  }

  createMember(memberDetails) {
    return this.http.post(environment.api + 'members/create', memberDetails);
  }
}
