import { Component, OnInit } from '@angular/core';
import {MeetService} from '../../meet.service';
import {Meet} from '../../models/meet';
import {DateTime} from 'luxon';
import {MeetEntryInfo} from '../../models/meet-entry-info';

@Component({
  selector: 'app-meet-entry-count',
  templateUrl: './meet-entry-count.component.html',
  styleUrls: ['./meet-entry-count.component.css']
})
export class MeetEntryCountComponent implements OnInit {
  meets: Meet[];
  selectedMeets: Meet[];
  meetInfo: MeetEntryInfo[];

  meetYears: number[] = [];

  constructor(private meetService: MeetService) { }

  ngOnInit(): void {

    this.meetService.getAllMeets().subscribe((meets: Meet[]) => {
      this.meets = meets;

      this.meetYears = this.meetService.getMeetYears(meets);

      const startDate = DateTime.now().minus({months: 2});
      const endDate = DateTime.now().plus({months: 3});

      this.selectedMeets = [];
      const meetIdList = [];
      for (const meet of this.meets) {
        // @ts-ignore
        const meetStart = DateTime.fromISO(meet.startdate);
        if (meetStart > startDate && endDate > meetStart) {
          this.selectedMeets.push(meet);
          meetIdList.push(meet.id);
        }
      }

      console.log(meetIdList);

      this.meetService.getMeetEntryInfo(meetIdList).subscribe((meetInfo: any) => {
        this.meetInfo = meetInfo.meets;
      });
    });
  }

}
