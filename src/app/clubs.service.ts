import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Club} from './models/club';
import {EnvironmentSpecificService} from './environment-specific.service';
import {EnvSpecific} from './models/env-specific';

@Injectable({
  providedIn: 'root'
})
export class ClubsService {
  private api;

  clubs: Club[];

  constructor(private http: HttpClient,
              private envSpecificSvc: EnvironmentSpecificService) {
    envSpecificSvc.subscribe(this, this.setApi);

  }

  setApi(caller: any, es: EnvSpecific) {
    const thisCaller = caller as ClubsService;
    thisCaller.api = es.api;
  }

  loadClubs() {
    console.log('loadClubs');
    this.http.get(this.api + 'clubs').subscribe((result: Club[]) => {
      this.clubs = result;
    });
  }

  getClubs() {
    return this.clubs;
  }

  findClub(term: string): Club[] {
    if (this.clubs !== undefined && this.clubs !== null) {
      return this.clubs.filter(x => x.clubname.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
    } else {
      console.log('Club typeahead not available');
      return [];
    }
  }

  findClubName(term: string) {
    const clubNames: string[] = new Array();
    const clubList = this.findClub(term);

    clubList.forEach(club => {
      clubNames.push(club.clubname)
    });

    return clubNames
  }

  getClubById(id: number) {
    console.log('Get club ' + id);
    if (this.clubs !== undefined && this.clubs !== null) {
      const clubs = this.clubs.filter(x => x.id === id);
      if (clubs.length === 1) {
        return clubs[0];
      } else {
        console.log('Club not found');
      }
    } else {
      console.log('Clubs not available');
    }
    return null;
  }
}
