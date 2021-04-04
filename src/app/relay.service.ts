import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RelayService {

  constructor(private http: HttpClient) { }

  getRelayTeams(clubId, meetId, eventId = null) {
    if (eventId) {
      return this.http.get(environment.api + 'club/' + clubId + '/relay_teams?meetId=' + meetId + '&eventId=' + eventId);
    } else {
      return this.http.get(environment.api + 'club/' + clubId + '/relay_teams?meetId=' + meetId);
    }
  }

  createRelayTeam(relayTeam) {
    return this.http.post(environment.api + 'relay', relayTeam);
  }

  editRelayTeam(relayTeam) {
    return this.http.put(environment.api + 'relay/' + relayTeam.id, relayTeam);
  }

  deleteTeam(relayTeam) {
    return this.http.delete(environment.api + 'relay/' + relayTeam.id);
  }

  getAge(member) {
    const birthYear = member.dob.split('-')[0];
    const birthDt = new Date(birthYear + '-01-01T00:00:00+1000');
    return new Date().getFullYear() - birthDt.getFullYear();
  }

  getDisplayAge(member) {
    const age = this.getAge(member);
    if (member.gender === 1) {
      return 'M' + age;
    } else {
      return 'F' + age;
    }
  }

  reportPayment(club_id, meet_id, paymentDetails) {
    return this.http.post(environment.api + 'relay_payment/' + club_id + '/' + meet_id, paymentDetails);
  }
}
