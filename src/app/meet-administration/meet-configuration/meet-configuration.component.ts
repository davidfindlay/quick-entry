import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MeetService} from '../../meet.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Meet} from '../../models/meet';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Alert} from '../../models/alert';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MeetAdministrationService} from '../meet-administration.service';

@Component({
  selector: 'app-meet-configuration',
  templateUrl: './meet-configuration.component.html',
  styleUrls: ['./meet-configuration.component.css']
})
export class MeetConfigurationComponent implements OnInit {

  @ViewChild('publishConfirm', {static: true}) publishConfirm: ElementRef;
  @ViewChild('paymentMethod', {static: true}) paymentMethod: ElementRef;
  @ViewChild('configureEvent', {static: true}) configureEvent: ElementRef;
  @ViewChild('addOrganiser', {static: true}) addOrganiser: ElementRef;

  meet: Meet;
  meetName: string;

  editMeet = false;

  alerts: Alert[];

  editMeetForm: FormGroup;
  paymentMethodForm: FormGroup;
  configureEventForm: FormGroup;

  constructor(private meetService: MeetService,
              private meetAdministrationService: MeetAdministrationService,
              private modal: NgbModal,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.route.params.subscribe((routeParams) => {
      if (routeParams.meetId && parseInt(routeParams.meetId, 10) !== 0) {
        this.loadMeet(parseInt(routeParams.meetId, 10))
      }
    });

    this.resetAlerts();
  }

  createForm() {
    console.log('createForm');
    this.editMeetForm = this.fb.group({
      meetname: this.meet.meetname,
      startdate: this.meet.startdate,
      enddate: this.meet.enddate,
      deadline: this.meet.deadline,
      contactname: this.meet.contactname,
      contactphone: this.meet.contactphone,
      contactemail: this.meet.contactemail,
      maxevents: this.meet.maxevents,
      minevents: this.meet.minevents,
      meetfee: this.meet.meetfee,
      meetfee_nonmember: this.meet.meetfee_nonmember,
      includedevents: this.meet.included_events,
      extraeventfee: this.meet.extra_event_fee,
      mealfee: this.meet.mealfee,
      mealsincluded: this.meet.mealsincluded,
      mealname: this.meet.mealname,
      location: this.meet.location
    });

    this.paymentMethodForm = this.fb.group({
      paymentMethod: 1
    });

    this.configureEventForm = this.fb.group({
      eventName: '',
      deadline: '',
      fee: '',
      disallowNT: ''
    });

  }

  loadMeet(meetId) {
    this.meetService.getSingleMeet(meetId).subscribe((meet: Meet) => {
      console.log(meet);
      this.meetName = meet.meetname;
      this.meet = meet;
      this.createForm();
    })
  }

  setPublished(published) {
    this.modal.open(this.publishConfirm).result.then((approved: any) => {
      if (approved === 'Yes') {
        this.spinner.show();
        console.log('set Published: ' + published);
        this.meetAdministrationService.publishMeet(this.meet.id, published).subscribe((response: any) => {
          if (response.success) {
            this.alerts.push({
              type: 'success',
              message: response.message
            });
          } else {
            this.alerts.push({
              type: 'danger',
              message: response.message
            });
          }
          this.loadMeet(this.meet.id);
          this.spinner.hide();

        }, (error) => {
          console.error(error);
          this.alerts.push({
            type: 'danger',
            message: 'Unable to change publishing state of meet. Please contact the system administrator. '
          });
          this.spinner.hide();
        });
      }

    }, (error: any) => {
      console.log(error);
    });
  }

  resetAlerts() {
    this.alerts = [];
  }

  closeAlert(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  edit() {
    this.editMeet = true;
    console.log('edit meet: ' + this.editMeet);
  }

  cancelEdit() {
    this.editMeet = false;
    console.log('edit meet: ' + this.editMeet);
  }

  backToMeetList() {
    this.router.navigate(['/', 'meet-admin']);
  }

  saveMeet() {
    console.log('saveMeet');
    this.meet.meetname = this.editMeetForm.get('meetname').value;
    this.meet.startdate = this.editMeetForm.get('startdate').value;
    this.meet.enddate = this.editMeetForm.get('enddate').value;
    this.meet.deadline = this.editMeetForm.get('deadline').value;
    this.meet.contactname = this.editMeetForm.get('contactname').value;
    this.meet.contactphone = this.editMeetForm.get('contactphone').value;
    this.meet.contactemail = this.editMeetForm.get('contactemail').value;
    this.meet.maxevents = this.editMeetForm.get('maxevents').value;
    this.meet.minevents = this.editMeetForm.get('minevents').value;
    this.meet.meetfee = this.editMeetForm.get('meetfee').value;
    this.meet.meetfee_nonmember = this.editMeetForm.get('meetfee_nonmember').value;
    this.meet.included_events = this.editMeetForm.get('includedevents').value;
    this.meet.extra_event_fee = this.editMeetForm.get('extraeventfee').value;
    this.meet.mealsincluded = this.editMeetForm.get('mealsincluded').value;
    this.meet.mealname = this.editMeetForm.get('mealname').value;
    this.meet.location = this.editMeetForm.get('location').value;

    console.log(this.meet);

    this.meetAdministrationService.updateMeet(this.meet).subscribe((meetDetails: any) => {
      console.log(meetDetails);
      this.loadMeet(this.meet.id);
    });

  }

  addPaymentMethod() {
    this.modal.open(this.paymentMethod).result.then((approved: any) => {
        if (approved === 'Add Method') {
          const addMethod = this.paymentMethodForm.get('paymentMethod').value;

          this.meetAdministrationService.addPaymentMethod(this.meet, addMethod).subscribe((response: any) => {
              if (response.success) {
                this.alerts.push({
                  type: 'success',
                  message: response.message
                });
              } else {
                this.alerts.push({
                  type: 'danger',
                  message: response.message
                });
              }
              this.loadMeet(this.meet.id);
              this.spinner.hide();
            },
            (error) => {
              console.error(error);
              this.alerts.push({
                type: 'danger',
                message: 'Unable to add the payment method to the meet. Please contact the system administrator. '
              });
              this.spinner.hide();
            }
          );
        }

      }, (error: any) => {
        console.log(error);
      });
  }

  removePaymentMethod(removeMethod) {
    this.meetAdministrationService.removePaymentMethod(this.meet, removeMethod).subscribe((response: any) => {
        if (response.success) {
          this.alerts.push({
            type: 'success',
            message: response.message
          });
        } else {
          this.alerts.push({
            type: 'danger',
            message: response.message
          });
        }
        this.loadMeet(this.meet.id);
        this.spinner.hide();
      },
      (error) => {
        console.error(error);
        this.alerts.push({
          type: 'danger',
          message: 'Unable to remove the payment method. Please contact the system administrator. '
        });
        this.spinner.hide();
      }
    );
  }

  configureEventClick(eventId) {

    const currentEvent = this.meet.events.find(x => x.id === eventId);

    this.configureEventForm.patchValue({
      eventName: currentEvent.eventname,
      deadline: currentEvent.deadline,
      fee: currentEvent.eventfee,
      disallowNT: currentEvent.times_required
    });

    this.modal.open(this.configureEvent).result.then((result: any) => {
      if (result === 'Save Changes') {
        const formData = this.configureEventForm.value;
        console.log(formData);
        this.meetAdministrationService.updateEvent(this.meet.id, eventId, formData).subscribe((updateResult: any) => {
          console.log(updateResult);
          this.loadMeet(this.meet.id);
        });
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  addOrganiserClick() {

    this.modal.open(this.addOrganiser).result.then((result: any) => {
      console.log(result);
    }, (error: any) => {
      console.log(error);
    });
  }

}
