import {Component, OnInit, ViewChild} from '@angular/core';
import {MeetService} from '../meet.service';
import {UserService} from '../user.service';
import {PlatformLocation} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {BehaviorSubject, Subject} from 'rxjs';
import {Meet} from '../models/meet';
import {EntryService} from '../entry.service';
import {EntryFormObject} from '../models/entry-form-object';
import {IncompleteEntry} from '../models/incomplete_entry';
import {WorkflowNavComponent} from '../workflow-nav/workflow-nav.component';

@Component({
    selector: 'app-entry-details',
    templateUrl: './entry-details.component.html',
    styleUrls: ['./entry-details.component.css']
})
export class EntryDetailsComponent implements OnInit {

  @ViewChild(WorkflowNavComponent, {static: true}) workflow: WorkflowNavComponent;
  public formValidSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    entryDetailsForm: FormGroup;

    meet_id;
    meet: Meet;
    meetName;

    rules = [];

    isAnonymousEntry = true;

    nextScreen;

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

        if ((this.meet.mealname !== null && this.meet.mealname !== '') || (this.meet.merchandise && this.meet.merchandise.length > 0)) {
          this.nextScreen = '/enter/' + this.meet_id + '/merchandise';
        } else {
          this.nextScreen = '/enter/' + this.meet_id + '/confirmation';
        }

        this.createForm();

        // Monitor changes to the entry
      this.entryService.incompleteChanged.subscribe((entries: IncompleteEntry[]) => {
        console.log('incompleteChanges');
        const meetEntry = entries.find(x => x.meet_id === this.meet_id);
        if (meetEntry && meetEntry.entrydata) {
          console.log(meetEntry.entrydata.validEvents);
          this.formValidSubject.next(meetEntry.entrydata.validEvents);
        }
      });

      this.entryService.checkEvents(this.meet_id);

      console.log(this.meet.groups);
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
          this.saveEntry(false);
          break;
        case 'submit':
          this.saveEntry(true);
          break;
      }
    }

    saveEntry(advance) {
      this.entryService.storeEntries();
      if (advance) {
        this.workflow.navigateNext();
      }
    }

}
