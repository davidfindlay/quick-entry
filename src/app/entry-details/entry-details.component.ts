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

        if (this.meet.events !== undefined && this.meet.events !== null) {
          this.meet.events.forEach((meetEvent) => {

            const fields = {
              event: '',
              seedtime: ''
            };

            const fg = this.fb.group(fields);

            eventArray.push(fg);

          });
        }

        this.entryDetailsForm = this.fb.group({events: eventArray}) ;
    }

    onSubmit(event) {
      console.log('onSubmit');
    }

}
