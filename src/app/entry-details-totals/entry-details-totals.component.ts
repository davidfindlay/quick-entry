import {Component, Input, OnInit} from '@angular/core';
import {EntryService} from '../entry.service';
import {EntryFormObject} from '../models/entry-form-object';
import {IncompleteEntry} from '../models/incomplete_entry';

@Component({
  selector: 'app-entry-details-totals',
  templateUrl: './entry-details-totals.component.html',
  styleUrls: ['./entry-details-totals.component.css']
})
export class EntryDetailsTotalsComponent implements OnInit {

  @Input() meetId;
  eventsEntered: number;
  entryCost: number;

  constructor(private entryService: EntryService) { }

  ngOnInit() {
    const entry = this.entryService.getIncompleteEntryFO(this.meetId);
    this.entryService.incompleteChanged.subscribe((entries: IncompleteEntry[]) => {
      this.eventsEntered = this.entryService.getIndividualEventCount(entry);

      this.entryCost = this.entryService.getEntryCost(entry);
    });

    this.entryCost = this.entryService.getEntryCost(entry);
  }

}
