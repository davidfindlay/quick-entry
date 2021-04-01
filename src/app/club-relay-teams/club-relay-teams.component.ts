import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ClubsService} from '../clubs.service';
import {RelayService} from '../relay.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {MeetService} from '../meet.service';
import {Club} from '../models/club';
import {Meet} from '../models/meet';
import {RelayTeam} from '../models/relay-team';

@Component({
  selector: 'app-club-relay-teams',
  templateUrl: './club-relay-teams.component.html',
  styleUrls: ['./club-relay-teams.component.css']
})
export class ClubRelayTeamsComponent implements OnInit {

  club: Club;
  clubId;
  meetId;
  meet;

  numRelayEvents;
  relayEvents = [];
  relayTeams;

  constructor(private clubService: ClubsService,
              private meetService: MeetService,
              private relayService: RelayService,
              private route: ActivatedRoute,
              private router: Router,
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
      deadlineDt = new Date(relayEvent.deadline + '+1000');
    } else {
      deadlineDt = new Date(this.meet.deadline + 'T23:59:59+1000')
    }

    if (deadlineDt > new Date()) {
      return true;
    } else {
      return false;
    }
  }

  public getClose(relayEvent) {
    let deadlineDt = null;
    if (relayEvent.deadline) {
      deadlineDt = new Date(relayEvent.deadline + '+1000');
    } else {
      deadlineDt = new Date(this.meet.deadline + 'T23:59:59+1000')
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
    this.relayService.deleteTeam(relayTeam).subscribe((del: any) => {
      console.log(del);
      this.relayTeams = this.relayTeams.filter(x => x.id !== relayTeam.id);
      console.log(this.relayTeams);
      this.cdRef.detectChanges();
    });
  }

}
