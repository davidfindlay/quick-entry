import {Component, Input, OnInit} from '@angular/core';
import {EntryService} from '../entry.service';
import {Entry} from '../models/entry';

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
    const entry = this.entryService.getEntry(this.meetId);
    this.entryService.entriesChanged.subscribe((entries: Entry[]) => {
      this.eventsEntered = this.entryService.getIndividualEventCount(entry);

      this.entryCost = this.entryService.getEntryCost(entry);
    });

    this.entryCost = this.entryService.getEntryCost(entry);
  }

}
