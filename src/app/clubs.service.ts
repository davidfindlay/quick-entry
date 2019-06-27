import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Club} from "./models/club";
import {filter} from "rxjs/internal/operators/filter";

@Injectable({
  providedIn: 'root'
})
export class ClubsService {

  clubs: Club[];

  constructor(private http: HttpClient) {
    this.loadClubs();
  }

  loadClubs() {
    this.http.get('http://localhost:8088/api/clubs').subscribe((result: Club[]) => {
      this.clubs = result;
    });
  }

  getClubs() {
    return this.clubs;
  }

  findClub(term: string): Club[] {
    return this.clubs.filter(x => x.clubname.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
  }

  findClubName(term: string) {
    const clubNames: string[] = new Array();
    const clubList = this.findClub(term);

    clubList.forEach(club => {
      clubNames.push(club.clubname)
    });

    return clubNames
  }
}
