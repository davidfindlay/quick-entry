import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDismissReasons, NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MemberHistoryService} from '../member-history.service';
import {Observable} from 'rxjs';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TimeService} from '../time.service';
import {EventEmitter} from '@angular/core';
import {DatatableComponent} from "@swimlane/ngx-datatable";

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

  @Output() timeEntered = new EventEmitter();

  // @ViewChild(DatatableComponent) pbTable: DatatableComponent;
  // @ViewChild(DatatableComponent) recentTable: DatatableComponent;

  private distance: number;
  private discipline: string;
  private course: string;

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
              private memberHistoryService: MemberHistoryService) {
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
      course: this.inCourse
    }).subscribe((eventDetails) => {
      this.distance = eventDetails.distance;
      this.discipline = eventDetails.discipline;
      this.course = eventDetails.course;
      this.shouldShowHours();
      console.log('Seedtime helper for ' + this.distance + ' ' + this.discipline + ' ' + this.course);

      this.memberHistoryService.getPersonalBest(this.memberNo, this.distance, this.discipline, this.course).subscribe((pbs) => {
        if (pbs !== null && pbs.length !== 0) {
          this.pbRows = pbs;
          this.historyAvailable = true;

          console.log(this.pbRows);
        }
      });
      this.memberHistoryService.getRecentResults(this.memberNo, this.distance, this.discipline, this.course).subscribe((recent) => {
        if (recent !== null && recent.length !== 0) {
          this.recentRows = recent;
          this.historyAvailable = true;

          console.log(this.recentRows);
        }
      });

    });

    this.seedTimeForm.valueChanges.subscribe((inputData) => {
      const hours = parseInt(inputData.hours, 10) || 0;
      const minutes = parseInt(inputData.minutes, 10) || 0;
      const seconds = parseInt(inputData.seconds, 10) || 0;
      const millis = parseInt(inputData.millis, 10) || 0;

      console.log(hours + ' ' + minutes + ' ' + seconds + ' ' + millis);

      this.seconds = ((parseInt(inputData.hours, 10) || 0) * 3600) +
        ((parseInt(inputData.minutes, 10) || 0) * 60) +
        (parseInt(inputData.seconds, 10) || 0) +
        ((parseInt(inputData.millis, 10) || 0) / 100);
      console.log(this.seconds);
      this.formattedTime = TimeService.formatTime(this.seconds);
    });


    //
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

  onSelect(event) {
    console.log(event);
  }
}
