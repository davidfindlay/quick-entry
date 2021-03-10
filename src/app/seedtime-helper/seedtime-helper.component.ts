import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDismissReasons, NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MemberHistoryService} from '../member-history.service';
import {Observable} from 'rxjs';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TimeService} from '../time.service';
import {EventEmitter} from '@angular/core';
import {TimePipe} from '../time.pipe';

@Component({
  selector: 'app-seedtime-helper',
  templateUrl: './seedtime-helper.component.html',
  styleUrls: ['./seedtime-helper.component.css']
})
export class SeedtimeHelperComponent implements OnInit {

  @Input() memberNo: number;
  @Input() inDistance: Observable<number>;
  @Input() inDiscipline: Observable<string>;
  @Input() inCourse: Observable<string>;
  @Input() inFreetime: Observable<boolean>;

  @Input() timeIn: number;

  @Input() inHideHistory: Observable<boolean>;
  public hideHistory: boolean;

  @Output() timeEntered = new EventEmitter();

  // @ViewChild(DatatableComponent) pbTable: DatatableComponent;
  // @ViewChild(DatatableComponent) recentTable: DatatableComponent;

  public distance: number;
  public discipline: string;
  public course: string;
  public freetime: boolean;

  closeResult: string;
  seedTimeForm: FormGroup;

  seconds: number;
  formattedTime = '';

  historyAvailable = false;
  showHours = false;

  selectedPb;
  selectedRecent;

  cols = [
    {
      name: 'event_date',
      prop: 'event_date'
    },
    {
      name: 'Age Group',
      prop: 'age_min'
    },
    {
      name: 'Location',
      prop: 'location'
    },
    {
      name: 'Time',
      prop: 'seconds'
    },
  ];

  pbRows = [];
  recentRows = [];

  constructor(public activeModal: NgbActiveModal,
              private fb: FormBuilder,
              private memberHistoryService: MemberHistoryService,
              private timePipe: TimePipe) {
  }

  ngOnInit() {

    this.seedTimeForm = this.fb.group({
      hours: '',
      minutes: '',
      seconds: '',
      millis: ''
    });


    forkJoin({
      distance: this.inDistance,
      discipline: this.inDiscipline,
      course: this.inCourse,
      freetime: this.inFreetime
      // hideHistory: this.inHideHistory
    }).subscribe((eventDetails) => {
      console.log(eventDetails);
      this.distance = eventDetails.distance;
      this.discipline = eventDetails.discipline;
      this.course = eventDetails.course;
      this.freetime = eventDetails.freetime;
      // this.hideHistory = eventDetails.hideHistory;
      this.shouldShowHours();

      this.memberHistoryService.getPersonalBest(this.memberNo, this.distance, this.discipline, this.course).subscribe((pbs) => {
        if (pbs !== null && pbs.length !== 0) {
          this.pbRows = pbs.slice(0, 3);
          this.historyAvailable = true;
        }
      });
      this.memberHistoryService.getRecentResults(this.memberNo, this.distance, this.discipline, this.course).subscribe((recent) => {
        if (recent !== null && recent.length !== 0) {
          this.recentRows = recent.slice(0, 5);
          this.historyAvailable = true;
        }
      });

    }, (error) => console.error(error));

    this.seedTimeForm.valueChanges.subscribe((inputData) => {
      const hours = parseInt(inputData.hours, 10) || 0;
      const minutes = parseInt(inputData.minutes, 10) || 0;
      const seconds = parseInt(inputData.seconds, 10) || 0;
      const millis = parseInt(inputData.millis, 10) || 0;

      this.seconds = ((parseInt(inputData.hours, 10) || 0) * 3600) +
        ((parseInt(inputData.minutes, 10) || 0) * 60) +
        (parseInt(inputData.seconds, 10) || 0) +
        ((parseInt(inputData.millis, 10) || 0) / 100);
      this.formattedTime = TimeService.formatTime(this.seconds);
    });


    if (this.timeIn !== null) {
      this.setTime(this.timeIn);
    }
  }

  shouldShowHours() {
    const maxSecs25 = 90;
    if (((this.distance / 25) * maxSecs25) > 3600) {
      this.showHours = true;
    }
  }

  clickUseTime() {
    this.timeEntered.emit(this.formattedTime);
    this.activeModal.close();
  }

  clickCancel() {
    this.activeModal.close();
  }

  selectResultRow(seconds, row) {
    this.setTime(seconds);
    console.log(row);
  }

  setTime(value) {
    const hours = Math.floor(value / 3600);
    const remainder = value % 3600;
    const minutes = Math.floor(remainder / 60);
    const seconds = Math.floor(remainder % 60);
    const millis = parseFloat(((remainder % 60) - seconds).toFixed(2)) * 100;

    let hoursStr = '';
    if (hours !== 0) {
      hoursStr = hours.toString(10);
    }

    let minStr = '';
    if (minutes !== 0) {
      minStr = minutes.toString(10);
    }

    let millisStr = '';
    if (millis < 10) {
      millisStr = '0' + millis.toString(10);
    } else {
      millisStr = millis.toString(10);
    }

    this.seedTimeForm.patchValue(
      {
        hours: hoursStr,
        minutes: minStr,
        seconds: seconds,
        millis: millisStr
      }
    )
  }
}

