import {Component, OnInit} from '@angular/core';
import {MeetService} from '../meet.service';
import {UserService} from '../user.service';
import {PlatformLocation} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {Meet} from '../models/meet';
import {EntryService} from '../entry.service';
import {Entry} from '../models/entry';

@Component({
    selector: 'app-entry-details',
    templateUrl: './entry-details.component.html',
    styleUrls: ['./entry-details.component.css']
})
export class EntryDetailsComponent implements OnInit {

  public formValidSubject: Subject<boolean> = new Subject<boolean>();

    entryDetailsForm: FormGroup;

    meet_id;
    meet: Meet;
    meetName;

    rules = [];

    isAnonymousEntry = true;

    constructor(private fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private location: PlatformLocation,
                private userService: UserService,
                private meetService: MeetService,
                private entryService: EntryService) {
    }

    ngOnInit() {
        this.meet_id = +this.route.snapshot.paramMap.get('meet');
        this.meet = this.meetService.getMeet(this.meet_id);
        if (this.meet) {

            this.meetName = this.meet.meetname;
        }

        if (this.meet.events === undefined || this.meet.events === null) {
          this.meetService.getMeetDetails(this.meet).subscribe((updated) => {
            console.log('Got Meet Details');
            console.log(updated);
            this.meet = updated;
          });
        }

        this.createForm();

        // Monitor changes to the entry
      this.entryService.entriesChanged.subscribe((entries: Entry[]) => {
        const meetEntry = entries.filter(x => x.meetId === this.meet_id);
        if (meetEntry !== null && meetEntry.length === 1) {
          this.formValidSubject.next(meetEntry[0].validEvents);
        }
      });

      this.entryService.checkEvents(this.meet_id);

      if (this.meet.groups !== undefined && this.meet.groups !== null) {
        for (const group of this.meet.groups) {
          for (const rule of group.rules) {
            if (!this.rules.includes(rule.rule)) {
              this.rules.push(rule.rule);
            }
          }
        }
      }

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

    onSubmit($event) {
      switch ($event) {
        case 'cancel':
          this.entryService.deleteEntry(this.meet_id);
          break;
        case 'saveAndExit':
          this.saveEntry();
          break;
        case 'submit':
          this.saveEntry();
          break;
      }
    }

    saveEntry() {
      this.entryService.storeEntries();
    }

}
