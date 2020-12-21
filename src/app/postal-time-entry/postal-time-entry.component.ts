import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup} from '@angular/forms';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-postal-time-entry',
  templateUrl: './postal-time-entry.component.html',
  styleUrls: ['./postal-time-entry.component.css']
})
export class PostalTimeEntryComponent implements OnInit {

  @Input() memberNo: number;
  @Input() inDistance: Observable<number>;
  @Input() inDiscipline: Observable<string>;
  @Input() inCourse: Observable<string>;
  @Input() inFreetime: Observable<boolean>;

  public distance: number;
  public discipline: string;
  public course: string;
  public freetime: boolean;

  public postalRows;

  public postalTimeForm: FormGroup;

  constructor(public activeModal: NgbActiveModal) {
    console.log('test3');
  }

  ngOnInit() {

    forkJoin({
      distance: this.inDistance,
      discipline: this.inDiscipline,
      course: this.inCourse,
      freetime: this.inFreetime
    }).subscribe((eventDetails) => {
      this.distance = eventDetails.distance;
      this.discipline = eventDetails.discipline;
      this.course = eventDetails.course;
      this.freetime = eventDetails.freetime;

      const postalRows = [];
      let multiplier = 0;

      if (this.course === 'LC') {
        multiplier = 50;
      } else {
        multiplier = 25;
      }

      const laps = this.distance / multiplier;
      for (let i = 1; i <= laps; i++) {
        const lapRow = {
          distance: (i * 50),
          timer1: null,
          timer2: null,
          timer3: null
        };
        postalRows.push(lapRow);
      }

      this.postalRows = postalRows;
      console.log(this.postalRows);

    });

  }

  clickCancel() {
    this.activeModal.close();
  }

  clickSubmit() {
    this.activeModal.close();
  }

}
