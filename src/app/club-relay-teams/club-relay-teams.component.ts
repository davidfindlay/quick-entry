import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ClubsService} from '../clubs.service';
import {RelayService} from '../relay.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {MeetService} from '../meet.service';
import {Club} from '../models/club';
import {Meet} from '../models/meet';
import {RelayTeam} from '../models/relay-team';
import {Alert} from '../models/alert';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TimeService} from '../time.service';
import * as moment from 'moment';

@Component({
  selector: 'app-club-relay-teams',
  templateUrl: './club-relay-teams.component.html',
  styleUrls: ['./club-relay-teams.component.css']
})
export class ClubRelayTeamsComponent implements OnInit {

  @ViewChild('confirmDelete', {static: false}) confirmDelete;

  club: Club;
  clubId;
  meetId;
  meet;

  numRelayEvents;
  relayEvents = [];
  relayTeams;
  payments;

  alerts: Alert[];

  constructor(private clubService: ClubsService,
              private meetService: MeetService,
              private relayService: RelayService,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              private cdRef: ChangeDetectorRef,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {

      this.numRelayEvents = null;
      this.relayEvents = [];
      this.relayTeams = null;

      this.clubId = parseInt(params.get('clubId'), 10);
      this.club = this.clubService.getClubById(this.clubId);
      this.meetId = parseInt(params.get('meetId'), 10);

      this.resetAlerts();

      this.meetService.getSingleMeet(this.meetId).subscribe((meet: Meet) => {
        this.meet = meet;

        // Determine if there are relay events
        this.numRelayEvents = 0;
        for (const me of this.meet.events) {
          if (me.legs > 1) {
            this.numRelayEvents++;
            this.relayEvents.push(me);
          }
        }

        this.relayEvents.sort((a, b) => (a.prognumber - b.prognumber));

        this.relayService.getRelayTeams(this.clubId, this.meetId).subscribe((relays: any) => {
          this.relayTeams = relays.relays;
          if (relays.payments) {
            this.payments = relays.payments;
          }
        });

      });

    });
  }

  public getDetails(relayEvent) {
    let genderString = '';
    let eventString = '';

    if (relayEvent.event_type) {
      switch (relayEvent.event_type.gender) {
        case 1:
          genderString = 'Men\'s ';
          break;
        case 2:
          genderString = 'Women\'s ';
          break;
        case 3:
          genderString = 'Mixed ';
          break;
      }
    }

    eventString = 'Event ' + relayEvent.prognumber + relayEvent.progsuffix + ': ';
    eventString += genderString + relayEvent.legs + 'x' + relayEvent.event_distance.distance + ' ';
    eventString += relayEvent.event_discipline.discipline + ' Relay';

    if (relayEvent.eventname) {
      eventString += ': ' + relayEvent.eventname;
    }

    return eventString;

  }

  public getTeamsByEvent(eventId): RelayTeam[] {
    return this.relayTeams.filter(x => x.meetevent_id === eventId);
  }

  public getRelayTeamName(relayTeam) {
    let teamName = relayTeam.age_group.groupname + relayTeam.letter;
    teamName = teamName.replace('Mixed ', 'X');
    teamName = teamName.replace('Men\'s ', 'M');
    teamName = teamName.replace('Women\'s ', 'F');

    return teamName;
  }

  public eventOpen(relayEvent) {
    let deadlineDt = null;
    if (relayEvent.deadline) {
      deadlineDt = moment(relayEvent.deadline + '+1000');
    } else {
      deadlineDt = moment(this.meet.deadline + 'T23:59:59+1000');
    }

    if (deadlineDt > moment()) {
      return true;
    } else {
      return false;
    }
  }

  public getClose(relayEvent) {
    let deadlineDt = null;
    if (relayEvent.deadline) {
      deadlineDt = moment(relayEvent.deadline + '+1000');
    } else {
      deadlineDt = moment(this.meet.deadline + 'T23:59:59+1000')
    }

    return deadlineDt;
  }

  public editTeam(relayTeam) {
    this.router.navigate([relayTeam.id], {relativeTo: this.route});
  }

  public addTeam(relayEvent) {
    this.router.navigate(['create', relayEvent.id ], {
      relativeTo: this.route});
  }

  deleteTeam(relayTeam) {

    this.modalService.open(this.confirmDelete, { size: 'lg' }).result.then((result) => {
      if (result === 'yes') {
        this.spinner.show();
        this.relayService.deleteTeam(relayTeam).subscribe((del: any) => {
          this.relayTeams = this.relayTeams.filter(x => x.id !== relayTeam.id);
          this.cdRef.detectChanges();
          this.alerts.push({
            type: 'success',
            message: del.message
          });
          this.spinner.hide();
        });
      }
    }, (reason) => {

    });


  }

  resetAlerts() {
    this.alerts = [];
  }

  closeAlert(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  formatTime(timeString) {
    return TimeService.formatTime(timeString);
  }

  getTotalAge(relayTeam) {
    let totalAge = 0;
    for (const member of relayTeam.members) {;
      totalAge += this.relayService.getAge(member.member);
    }
    return totalAge;
  }

}
