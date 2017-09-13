import {Injectable} from '@angular/core';
import {Meet} from './models/meet';
import {HttpClient} from '@angular/common/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class MeetService {

    constructor(private http: HttpClient) {
    }

    getMeets(): Observable<Meet[]> {
        return this.http.get('/assets/meets.json')
            .map((response: Response) => response)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

}
