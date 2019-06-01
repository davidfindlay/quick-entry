import {Component, OnInit} from '@angular/core';
import {MeetService} from "../meet.service";
import {UserService} from "../user.service";
import {PlatformLocation} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {Subject} from "rxjs";
import {Meet} from "../models/meet";

@Component({
    selector: 'app-entry-details',
    templateUrl: './entry-details.component.html',
    styleUrls: ['./entry-details.component.css']
})
export class EntryDetailsComponent implements OnInit {

  private formValidSubject: Subject<boolean> = new Subject<boolean>();

    entryDetailsForm: FormGroup;

    meet_id;
    meet: Meet;
    meetName;

    isAnonymousEntry = true;

    constructor(private fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private location: PlatformLocation,
                private userService: UserService,
                private meetService: MeetService) {
    }

  meetEvents = [
      {
          'id': 1,
          'prognumber': 1,
          'distance': '200m',
          'discipline': 'Individual Medley',
          'type': 'Mixed Postal'
      },
      {
          'id': 2,
          'prognumber': 2,
          'distance': '200m',
          'discipline': 'Butterfly',
          'type': 'Mixed Postal'
      },
      {
          'id': 3,
          'prognumber': 3,
          'distance': '200m',
          'discipline': 'Backstroke',
          'type': 'Mixed Postal'
      },
      {
          'id': 4,
          'prognumber': 4,
          'distance': '200m',
          'discipline': 'Breaststroke',
          'type': 'Mixed Postal'
      },
      {
          'id': 5,
          'prognumber': 5,
          'distance': '200m',
          'discipline': 'Freestyle',
          'type': 'Mixed Postal'
      },
      {
          'id': 6,
          'prognumber': 6,
          'distance': '400m',
          'discipline': 'Individual Medley',
          'type': 'Mixed Postal'
      },
      {
          'id': 7,
          'prognumber': 7,
          'distance': '400m',
          'discipline': 'Butterfly',
          'type': 'Mixed Postal'
      },
      {
          'id': 8,
          'prognumber': 8,
          'distance': '400m',
          'discipline': 'Backstroke',
          'type': 'Mixed Postal'
      },
      {
          'id': 9,
          'prognumber': 9,
          'distance': '400m',
          'discipline': 'Breaststroke',
          'type': 'Mixed Postal'
      },
      {
          'id': 10,
          'prognumber': 10,
          'distance': '400m',
          'discipline': 'Freestyle',
          'type': 'Mixed Postal'
      },
      {
          'id': 11,
          'prognumber': 11,
          'distance': '100m',
          'discipline': 'Individual Medley',
          'type': 'Seeded Individual Mixed Timed Finals'
      },
      {
          'id': 12,
          'prognumber': 12,
          'distance': '25m',
          'discipline': 'Butterfly',
          'type': 'Seeded Individual Mixed Timed Finals'
      },
      {
          'id': 13,
          'prognumber': 13,
          'distance': '50m',
          'discipline': 'Backstroke',
          'type': 'Seeded Individual Mixed Timed Finals'
      },
      {
          'id': 14,
          'prognumber': 14,
          'distance': '100m',
          'discipline': 'Breaststroke',
          'type': 'Seeded Individual Mixed Timed Finals'
      },
      {
          'id': 15,
          'prognumber': 15,
          'distance': '25m',
          'discipline': 'Freestyle',
          'type': 'Seeded Individual Mixed Timed Finals'
      },
      {
          'id': 16,
          'prognumber': 16,
          'distance': '50m',
          'discipline': 'Butterfly',
          'type': 'Seeded Individual Mixed Timed Finals'
      },
      {
          'id': 17,
          'prognumber': 17,
          'distance': '100m',
          'discipline': 'Backstroke',
          'type': 'Seeded Individual Mixed Timed Finals'
      },
      {
          'id': 18,
          'prognumber': 18,
          'distance': '25m',
          'discipline': 'Breaststroke',
          'type': 'Seeded Individual Mixed Timed Finals'
      },
      {
          'id': 19,
          'prognumber': 19,
          'distance': '50m',
          'discipline': 'Freestyle',
          'type': 'Seeded Individual Mixed Timed Finals'
      },
      {
          'id': 20,
          'prognumber': 20,
          'distance': '100m',
          'discipline': 'Butterfly',
          'type': 'Seeded Individual Mixed Timed Finals'
      },
      {
          'id': 21,
          'prognumber': 21,
          'legs': 4,
          'distance': '50m',
          'discipline': 'Freestyle',
          'type': 'Men\'s Relay Timed Finals'
      },
      {
          'id': 22,
          'prognumber': 22,
          'legs': 4,
          'distance': '50m',
          'discipline': 'Freestyle',
          'type': 'Women\'s Relay Timed Finals'
      },
      {
          'id': 23,
          'prognumber': 23,
          'distance': '25m',
          'discipline': 'Backstroke',
          'type': 'Seeded Individual Mixed Timed Finals'
      },
      {
          'id': 24,
          'prognumber': 24,
          'distance': '50m',
          'discipline': 'Breaststroke',
          'type': 'Seeded Individual Mixed Timed Finals'
      },
      {
          'id': 25,
          'prognumber': 25,
          'distance': '100m',
          'discipline': 'Freestyle',
          'type': 'Seeded Individual Mixed Timed Finals'
      },
      {
          'id': 22,
          'prognumber': 22,
          'legs': 4,
          'distance': '50m',
          'discipline': 'Medley',
          'type': 'Mixed Relay Timed Finals'
      }
  ];

    ngOnInit() {
        this.meet_id = +this.route.snapshot.paramMap.get('meet');
        this.meet = this.meetService.getMeet(this.meet_id);
        if (this.meet) {

            this.meetName = this.meet.meetname;
        }

        console.log('Meet: ' + this.meetName);

        console.log(this.meet);

        this.createForm();



    }

    createForm() {

        const eventArray = [];

        this.meetEvents.forEach((meetEvent) => {
            const fields = {
                event: '',
                seedtime: ''
            };

            const fg = this.fb.group(fields);

            eventArray.push(fg);

        });

        this.entryDetailsForm = this.fb.group({events: eventArray}) ;
    }


    eventSelected(id) {

        const eventItems = this.entryDetailsForm.controls[id] as FormArray;
        const eventControls = eventItems.controls;

        if (eventControls['event'].value) {
             return true;
        }

        return false;

    }

}
