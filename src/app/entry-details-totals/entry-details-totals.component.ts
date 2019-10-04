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
    this.entryService.getIncompleteEntryFO(this.meetId).subscribe((entry: EntryFormObject) => {
      this.entryCost = this.entryService.getEntryCost(entry);
    });

    this.entryService.incompleteChanged.subscribe((entries: IncompleteEntry[]) => {
      const entry = entries.filter(x => x.meet_id === this.meetId);

      if (entry !== undefined && entry !== null && entry.length > 0) {
        this.eventsEntered = this.entryService.getIndividualEventCount(entry[0].entrydata);
        this.entryCost = this.entryService.getEntryCost(entry[0].entrydata);
      }
    });
  }

}
