import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembershipImportService {

  constructor(private http: HttpClient) { }

  getAllImports() {
    return this.http.get(environment.api + 'membership/imports');
  }

  requestAutoImport() {
    return this.http.post(environment.api + 'membership/autoImport', {});
  }

  getSportsTGMembers() {
    return this.http.get(environment.api + 'membership/sportstg');
  }

}
