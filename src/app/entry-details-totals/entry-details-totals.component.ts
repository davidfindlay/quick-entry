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

  constructor(private entryService: EntryService) { }

  ngOnInit() {
    this.entryService.entriesChanged.subscribe((entries: Entry[]) => {
      const entry = entries.find(x => x.meetId === this.meetId, 10);
      this.eventsEntered = entry.entryEvents.length;
    });
  }

}
