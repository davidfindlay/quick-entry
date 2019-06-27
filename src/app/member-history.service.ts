import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Result} from "./models/result";
import {Observable} from "rxjs";

import * as moment from 'moment';
import {of} from "rxjs/internal/observable/of";

@Injectable({
  providedIn: 'root'
})
export class MemberHistoryService {

  private results: Result[];


  constructor(private http: HttpClient) {
  }

  downloadHistory(member_no: number) {
    this.http.get('http://localhost:8000/history/' + member_no + '/').subscribe((results: any[]) => {

      const storeResults: Result[] = [];

      results.forEach((result) => {
        const resultObj = <Result>{
          swimmer_name: result.swimmer_name,
          age: result.age,
          age_min: result.age_min,
          age_max: result.age_max,
          gender: result.gender,
          club_code: result.club_code,
          discipline: result.discipline,
          msa_id: result.msa_id,
          course: result.course === 'LC' ? 'LCM' : 'SCM',
          final_time: result.final_time,
          event_date: moment(result.event_date, 'DD.MM.YYYY').toDate(),
          location: result.location,
          seconds: parseFloat(result.seconds),
          distance: parseInt(result.distance, 10)
        };
        storeResults.push(resultObj)
      });

      this.results = storeResults;
    });
  }

  isHistoryAvailable(member_no: number, distance: number, discipline: string, course?: string): Observable<boolean> {
    const matching = this.filterResults(distance, discipline, course);

    if (this.results === undefined || this.results === null) {
      this.downloadHistory(member_no);
    }

    if (matching !== null && matching.length > 0) {
      return of(true);
    } else {
      return of(false);
    }

  }

  /**
   *
   * Gets the most recent time the member has swum for this event or null
   *
   * @param member_no the MSA member id number of the entrant
   * @param distance in metres
   * @param discipline Freestyle, Butterfly, Breaststroke, Backstroke or IM
   * @param course SC or LC
   *
   * @returns Result containing the most recent swim of this distance
   *
   */
  getLastTime(member_no: number, distance: number, discipline: string, course: string): Observable<Result> {

    return new Observable(subscriber => {
      this.getRecentResults(member_no, distance, discipline, course).subscribe((results) => {
        if (results.length > 0) {
          subscriber.next(results[0]);
        } else {
          subscriber.next(null);
        }
      })
    });

  }

  /**
   * Returns an array of all age group personal bests for this event
   *
   * @param member_no the MSA member id number of the entrant
   * @param distance in metres
   * @param discipline Freestyle, Butterfly, Breaststroke, Backstroke or IM
   * @param course SC or LC
   *
   * @returns array of Results listing all age group personal bests for this event
   */
  getPersonalBest(member_no: number, distance: number, discipline: string, course: string): Observable<Result[]> {

    const matching = this.filterResults(distance, discipline, course);
    const results: Result[] = [];

    if (matching !== null && matching.length > 0) {

      // Obstain a list of age groups represented in the results
      const ageGroups: number[] = [];
      matching.forEach((result) => {
        if (!ageGroups.includes(result.age_min)) {
          ageGroups.push(result.age_min);
        }
      });

      ageGroups.forEach((age) => {
        const ageGroupResults: Result[] = [];

        // get all results for this age group
        matching.forEach((result) => {
          if (result.age_min === age) {
            ageGroupResults.push(result);
          }
        });

        // In each age group search for fastest time and return it to main result array
        if (ageGroupResults.length > 0) {
          ageGroupResults.sort(function (a, b) {
            return a.seconds - b.seconds;
          });

          results.push(ageGroupResults[0]);
        }

      });

    } else {
      return of(null);
    }

    if (results.length > 0) {
      return of(results);
    } else {
      return of(null);
    }

  }

  getRecentResults(member_no: number, distance: number, discipline: string, course: string): Observable<Result[]> {
    const matching = this.filterResults(distance, discipline, course);

    if (matching !== null && matching.length > 0) {
      matching.sort(function (a, b) {
        return b.event_date.getTime() - a.event_date.getTime();
      });

      return of(matching);
    } else {
      return of(null);
    }

  }

  filterResults(distance: number, discipline: string, course: string): Result[] {

    if (discipline === 'Individual Medley') {
      discipline = 'IM';
    }

    console.log('Searching for last result in ' + distance + ' ' + course + ' ' + discipline + '.');

    if (this.results !== undefined && this.results !== null) {

      const matching = this.results.filter((result) => {
        if (result.distance === distance
          && result.discipline === discipline
          && result.course === course) {
          return result;
        }
      });
      return matching;
    } else {

      return null;

    }
  }

}
