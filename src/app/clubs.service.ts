import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Club} from './models/club';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClubsService {
  private api;

  clubs: Club[];

  constructor(private http: HttpClient) {
    this.loadClubs();
  }

  loadClubs() {
    console.log('loadClubs');
    this.http.get(environment.api + 'clubs').subscribe((result: Club[]) => {
      this.clubs = result;
      // console.log(this.clubs);
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
