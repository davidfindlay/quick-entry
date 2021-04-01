import {Component, Input, OnInit} from '@angular/core';
import {MeetService} from '../meet.service';
import {ClubsService} from '../clubs.service';
import {RelayService} from '../relay.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TimeService} from '../time.service';

@Component({
  selector: 'app-club-relay-team-edit',
  templateUrl: './club-relay-team-edit.component.html',
  styleUrls: ['./club-relay-team-edit.component.css']
})
export class ClubRelayTeamEditComponent implements OnInit {

  relayForm: FormGroup;

  clubId;
  meetId;
  eventId;

  errorLetterUsed = false;
  errorAgeIncorrect = false;
  errorGenderIncorrect = false;
  edit = false;

  meet;
  relayTeams = [];
  entries = [];
  swimmers = [];

  availableSwimmers = [];
  eventGender;

  totalAge;


  constructor(private meetService: MeetService,
              private clubService: ClubsService,
              private relayService: RelayService,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.spinner.show();
    this.clubId = parseInt(this.route.snapshot.paramMap.get('clubId'), 10);
    this.meetId = parseInt(this.route.snapshot.paramMap.get('meetId'), 10);
    this.eventId = parseInt(this.route.snapshot.paramMap.get('eventId'), 10);

    this.createForm();

    this.meetService.getSingleMeet(this.meetId).subscribe((meet: any) => {

      this.meet = meet;

      this.relayService.getRelayTeams(this.clubId, this.meetId, this.eventId).subscribe((relays: any) => {
        this.relayTeams = relays.relays;

        this.clubService.getEntries(this.clubId, this.meetId).subscribe((entries: any) => {

          this.entries = entries.entries;

          this.getEventGender();
          this.getAllMembers();
          this.getAvailableMembers();

          this.spinner.hide();
        });
      });
    });
  }

  createForm() {
    this.relayForm = this.fb.group({
      ageGroup: '',
      letter: '',
      teamName: '',
      swimmer1: '',
      swimmer2: '',
      swimmer3: '',
      swimmer4: '',
      seedTime: ''
    });

    // this.relayForm.valueChanges.subscribe((change) => {
    //   console.log(change);
    // });

    this.relayForm.controls.swimmer1.valueChanges.subscribe((change) => {
      if (this.relayForm.controls.swimmer2.value === change) {
        this.relayForm.controls.swimmer2.patchValue('', {emitEvent: false});
      }
      if (this.relayForm.controls.swimmer3.value === change) {
        this.relayForm.controls.swimmer3.patchValue('', {emitEvent: false});
      }
      if (this.relayForm.controls.swimmer4.value === change) {
        this.relayForm.controls.swimmer4.patchValue('', {emitEvent: false});
      }
      this.calculateAge();
    });

    this.relayForm.controls.swimmer2.valueChanges.subscribe((change) => {
      if (this.relayForm.controls.swimmer1.value === change) {
        this.relayForm.controls.swimmer1.patchValue('', {emitEvent: false});
      }
      if (this.relayForm.controls.swimmer3.value === change) {
        this.relayForm.controls.swimmer3.patchValue('', {emitEvent: false});
      }
      if (this.relayForm.controls.swimmer4.value === change) {
        this.relayForm.controls.swimmer4.patchValue('', {emitEvent: false});
      }
      this.calculateAge();
    });

    this.relayForm.controls.swimmer3.valueChanges.subscribe((change) => {
      if (this.relayForm.controls.swimmer1.value === change) {
        this.relayForm.controls.swimmer1.patchValue('', {emitEvent: false});
      }
      if (this.relayForm.controls.swimmer2.value === change) {
        this.relayForm.controls.swimmer2.patchValue('', {emitEvent: false});
      }
      if (this.relayForm.controls.swimmer4.value === change) {
        this.relayForm.controls.swimmer4.patchValue('', {emitEvent: false});
      }
      this.calculateAge();
    });

    this.relayForm.controls.swimmer4.valueChanges.subscribe((change) => {
      if (this.relayForm.controls.swimmer1.value === change) {
        this.relayForm.controls.swimmer1.patchValue('', {emitEvent: false});
      }
      if (this.relayForm.controls.swimmer2.value === change) {
        this.relayForm.controls.swimmer2.patchValue('', {emitEvent: false});
      }
      if (this.relayForm.controls.swimmer3.value === change) {
        this.relayForm.controls.swimmer3.patchValue('', {emitEvent: false});
      }
      this.calculateAge();
    });

  }

  fixSeedTime() {
    const formattedSeedTime = TimeService.rewriteTimeEM(this.relayForm.controls.seedTime.value);
    this.relayForm.controls.seedTime.patchValue(formattedSeedTime, {emitEvent: false});
  }

  calculateAge() {
    let age = 0;
    if (this.relayForm.controls.swimmer1.value) {
      const member = this.swimmers.find(x => x.id === parseInt(this.relayForm.controls.swimmer1.value, 10));
      age += this.getAge(member);
    }
    if (this.relayForm.controls.swimmer2.value) {
      const member = this.swimmers.find(x => x.id === parseInt(this.relayForm.controls.swimmer2.value, 10));
      age += this.getAge(member);
    }
    if (this.relayForm.controls.swimmer3.value) {
      const member = this.swimmers.find(x => x.id === parseInt(this.relayForm.controls.swimmer3.value, 10));
      age += this.getAge(member);
    }
    if (this.relayForm.controls.swimmer4.value) {
      const member = this.swimmers.find(x => x.id === parseInt(this.relayForm.controls.swimmer4.value, 10));
      age += this.getAge(member);
    }

    this.totalAge = age;
    return age;
  }

  getAllMembers() {
    for (const entry of this.entries) {
      this.swimmers.push(entry.member);
    }
  }

  getAvailableMembers() {
    const member_ids = [];

    for (const swimmer of this.swimmers) {
      if (this.eventGender) {
        if (this.eventGender === 1 && swimmer.gender === 2) {
          member_ids.push(swimmer.id);
        }
        if (this.eventGender === 2 && swimmer.gender === 1) {
          member_ids.push(swimmer.id);
        }
      }
    }

    for (const team of this.relayTeams) {
      if (team.meetevent_id === this.eventId) {
        for (const member of team.members) {
          member_ids.push(member.member_id);
        }
      }
    }

    console.log(member_ids);

    this.availableSwimmers = this.swimmers.filter(x => !member_ids.includes(x.id));
  }

  getAge(member) {
    const birthYear = member.dob.split('-')[0];
    const birthDt = new Date(birthYear + '-01-01T00:00:00+1000');
    const age = new Date().getFullYear() - birthDt.getFullYear();
    return age;
  }

  getDisplayAge(member) {
    const age = this.getAge(member);
    if (member.gender === 1) {
      return 'M' + age;
    } else {
      return 'F' + age;
    }
  }

  getEventGender() {
    const relayEvent = this.meet.events.find(x => x.id === this.eventId);

    if (relayEvent) {
      this.eventGender = relayEvent.event_type.gender;
    }
  }

}
