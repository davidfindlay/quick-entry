import {Component, Input, OnInit} from '@angular/core';
import {MeetService} from '../meet.service';
import {ClubsService} from '../clubs.service';
import {RelayService} from '../relay.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TimeService} from '../time.service';
import {RelayTeam} from '../models/relay-team';
import {RelayTeamMember} from '../models/relay-team-member';

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
  teamId;

  errorLetterUsed = false;
  errorAgeIncorrect = false;
  errorGenderIncorrect = false;
  edit = false;
  editTeam;

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

    this.teamId = parseInt(this.route.snapshot.paramMap.get('teamId'), 10);

    this.createForm();

    this.meetService.getSingleMeet(this.meetId).subscribe((meet: any) => {

      this.meet = meet;

      this.relayService.getRelayTeams(this.clubId, this.meetId, this.eventId).subscribe((relays: any) => {
        this.relayTeams = relays.relays;

        if (this.teamId) {
          this.editTeam = this.relayTeams.find(x => x.id === this.teamId);
          this.eventId = this.editTeam.meetevent_id;
        }

        this.clubService.getEntries(this.clubId, this.meetId).subscribe((entries: any) => {

          this.entries = entries.entries;

          this.getEventGender();
          this.getAllMembers();
          this.getAvailableMembers();

          if (this.teamId) {

            // Add team members to available members
            for (const member of this.editTeam.members) {
              const swimmer = this.swimmers.find(x => x.id === member.member_id);
              this.availableSwimmers.push(swimmer);
            }

            this.availableSwimmers.sort(this.nameSort);

            const swimmer1 = this.editTeam.members.find(x => x.leg === 1);
            const swimmer2 = this.editTeam.members.find(x => x.leg === 2);
            const swimmer3 = this.editTeam.members.find(x => x.leg === 3);
            const swimmer4 = this.editTeam.members.find(x => x.leg === 4);

            let swimmer1Id = null;
            let swimmer2Id = null;
            let swimmer3Id = null;
            let swimmer4Id = null;

            if (swimmer1) {
              swimmer1Id = swimmer1.member_id;
            }

            if (swimmer2) {
              swimmer2Id = swimmer2.member_id;
            }

            if (swimmer3) {
              swimmer3Id = swimmer3.member_id;
            }

            if (swimmer4) {
              swimmer4Id = swimmer4.member_id;
            }

            this.relayForm.patchValue({
              ageGroup: this.editTeam.age_group.min,
              letter: this.editTeam.letter,
              teamName: this.editTeam.teamname,
              swimmer1: swimmer1Id,
              swimmer2: swimmer2Id,
              swimmer3: swimmer3Id,
              swimmer4: swimmer4Id,
              seedTime: TimeService.formatTime(this.editTeam.seedtime)
            });


          }
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
      swimmer1: ['', Validators.required],
      swimmer2: ['', Validators.required],
      swimmer3: ['', Validators.required],
      swimmer4: ['', Validators.required],
      seedTime: ''
    });

    this.relayForm.controls.ageGroup.valueChanges.subscribe((ageGroup) => {
      if (ageGroup !== '') {
        console.log('clear validators');
        this.relayForm.controls.swimmer1.setValidators(null);
        this.relayForm.controls.swimmer2.setValidators(null);
        this.relayForm.controls.swimmer3.setValidators(null);
        this.relayForm.controls.swimmer4.setValidators(null);

      } else {
        console.log('require validators');
        this.relayForm.controls.swimmer1.setValidators([Validators.required]);
        this.relayForm.controls.swimmer2.setValidators([Validators.required]);
        this.relayForm.controls.swimmer3.setValidators([Validators.required]);
        this.relayForm.controls.swimmer4.setValidators([Validators.required]);
      }
      this.relayForm.controls.swimmer1.updateValueAndValidity();
      this.relayForm.controls.swimmer2.updateValueAndValidity();
      this.relayForm.controls.swimmer3.updateValueAndValidity();
      this.relayForm.controls.swimmer4.updateValueAndValidity();

    });

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

    this.swimmers.sort(this.nameSort);
  }

  nameSort(a, b) {

      // return a.surname - b.surname || a.firstname - b.firstname;
      if (a.surname > b.surname) {
        return 1;
      }
      if (b.surname > a.surname) {
        return -1;
      }
      if (a.firstname > b.firstname) {
        return 1;
      }
      if (b.firstname > a.firstname) {
        return -1;
      }

  }

  getAvailableMembers() {
    console.log('getAvailableMembers');
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

    // console.log(member_ids);

    this.availableSwimmers = this.swimmers.filter(x => !member_ids.includes(x.id));
    // this.availableSwimmers.sort( (a, b) => {
    //   // return a.surname - b.surname || a.firstname - b.firstname;
    //   return a.surname > b.surname;
    // });

    console.log(this.availableSwimmers);
  }

  getAge(member) {
    const birthYear = member.dob.split('-')[0];
    const birthDt = new Date(birthYear + '-12-31T23:59:59+1000');
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

  createTeam() {

    const relayTeam = this.createRelayTeamObj();

    this.relayService.createRelayTeam(relayTeam).subscribe((relay: any) => {
      console.log(relay);
      this.router.navigate(['/', 'club-relays', this.clubId, this.meetId]);
    });
  }

  saveTeam() {
    const relayTeam = this.createRelayTeamObj();

    this.relayService.editRelayTeam(relayTeam).subscribe((relay: any) => {
      console.log(relay);
      this.router.navigate(['/', 'club-relays', this.clubId, this.meetId]);
    });
  }

  createRelayTeamObj() {
    const relayTeam = new RelayTeam();
    // console.log(this.relayForm.value);

    if (this.editTeam) {
      relayTeam.id = this.editTeam.id;
    }

    relayTeam.club_id = this.clubId;
    relayTeam.meet_id = this.meetId;
    relayTeam.meetevent_id = this.eventId;
    relayTeam.teamname = this.relayForm.controls.teamName.value;
    relayTeam.letter =  this.relayForm.controls.letter.value;
    relayTeam.seedtime = TimeService.timeStringToSeconds(this.relayForm.controls.seedTime.value);
    relayTeam.members = [];

    if (this.relayForm.controls.swimmer1.value !== '') {
      const swimmer1 = new RelayTeamMember();
      swimmer1.member_id = parseInt(this.relayForm.controls.swimmer1.value, 10);
      swimmer1.leg = 1;
      relayTeam.members.push(swimmer1);
    }

    if (this.relayForm.controls.swimmer2.value !== '') {
      const swimmer2 = new RelayTeamMember();
      swimmer2.member_id = parseInt(this.relayForm.controls.swimmer2.value, 10);
      swimmer2.leg = 2;
      relayTeam.members.push(swimmer2);
    }

    if (this.relayForm.controls.swimmer3.value !== '') {
      const swimmer3 = new RelayTeamMember();
      swimmer3.member_id = parseInt(this.relayForm.controls.swimmer3.value, 10);
      swimmer3.leg = 3;
      relayTeam.members.push(swimmer3);
    }

    if (this.relayForm.controls.swimmer4.value !== '') {
      const swimmer4 = new RelayTeamMember();
      swimmer4.member_id = parseInt(this.relayForm.controls.swimmer4.value, 10);
      swimmer4.leg = 4;
      relayTeam.members.push(swimmer4);
    }

    if (this.relayForm.controls.ageGroup.value !== '') {
      relayTeam.agegroup_min = parseInt(this.relayForm.controls.ageGroup.value, 10);
    }

    console.log(relayTeam);

    return relayTeam;
  }

  cancel() {
    this.router.navigate(['/', 'club-relays', this.clubId, this.meetId]);
  }

}
