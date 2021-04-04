import { Component, OnInit } from '@angular/core';
import {EntryService} from '../entry.service';
import {Subject} from 'rxjs';
import {MeetEntry} from '../models/meet-entry';

import * as moment from 'moment';

@Component({
  selector: 'app-my-entries',
  templateUrl: './my-entries.component.html',
  styleUrls: ['./my-entries.component.css']
})
export class MyEntriesComponent implements OnInit {

  entries: MeetEntry[];

  constructor(private entryService: EntryService) { }

  ngOnInit() {
    // Refresh submitted entries
    this.entryService.retrieveSubmittedEntries();

    this.entryService.submittedChanged.subscribe((entries: MeetEntry[]) => {
      for (const entry of entries) {
        entry.created_at = moment(entry.created_at).toDate();
        entry.updated_at = moment(entry.updated_at).toDate();
      }

      this.entries = entries;
      // console.log(entries);
    });
  }

}
