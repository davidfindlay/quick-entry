import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MeetAdministrationService} from '../meet-administration.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Alert} from '../../models/alert';


@Component({
  selector: 'app-add-meet-date',
  templateUrl: './add-meet-date.component.html',
  styleUrls: ['./add-meet-date.component.css']
})
export class AddMeetDateComponent implements OnInit {

  @Output() meetDateCreated: EventEmitter<any> = new EventEmitter();

  addMeetForm: FormGroup;
  alerts: Alert[];

  constructor(public activeModal: NgbActiveModal,
              private meetAdministrationService: MeetAdministrationService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.addMeetForm = this.fb.group({
      meetDate: ['', Validators.required],
      endDate: '',
      meetName: ['', Validators.required],
      location: ''
    });
  }

  saveAndAddBtn() {
    const meetDetails = this.saveMeetDate();
    console.log(meetDetails);
    this.meetAdministrationService.addMeetDate(meetDetails).subscribe((addMeet: any) => {
      console.log(addMeet);
      if (addMeet.success) {
        console.log('success');
        this.alerts.push({
          type: 'success',
          message: 'Meet date for ' + meetDetails.meetname + ' saved.'
        });
        this.meetDateCreated.emit(addMeet.meet);
      } else {
        this.alerts.push({
          type: 'danger',
          message: 'Unable to create meet date for ' + meetDetails.meetname + ' saved.'
        });
      }
    });
  }

  saveBtn() {
    const meetDetails = this.saveMeetDate();
    console.log(meetDetails);
    this.meetAdministrationService.addMeetDate(meetDetails).subscribe((addMeet: any) => {
      this.activeModal.close('Meet date for ' + meetDetails.meetname + ' saved.');
      this.meetDateCreated.emit(addMeet.meet);
    });
  }

  saveMeetDate() {
    const startDate = this.formatDate(this.addMeetForm.get('meetDate').value);

    let endDate = null;
    if (this.addMeetForm.get('endDate').value !== null && this.addMeetForm.get('endDate').value !== '') {
      endDate = this.formatDate(this.addMeetForm.get('endDate').value);
    }

    const meetDetails = {
      startdate: startDate,
      enddate: endDate,
      meetname: this.addMeetForm.get('meetName').value,
      location: this.addMeetForm.get('location').value,
    };

    return meetDetails;
  }

  formatDate(date) {
    return date.year.toString() + '-' + date.month.toString().padStart(2, '0') + '-' + date.day.toString().padStart(2, '0');
  }

  closeAlert(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

}
