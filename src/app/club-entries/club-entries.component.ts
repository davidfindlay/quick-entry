import { Component, OnInit } from '@angular/core';
import {ClubsService} from '../clubs.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Club} from '../models/club';
import {NgxSpinnerService} from 'ngx-spinner';
import {MeetEntry} from '../models/meet-entry';

@Component({
  selector: 'app-club-entries',
  templateUrl: './club-entries.component.html',
  styleUrls: ['./club-entries.component.css']
})
export class ClubEntriesComponent implements OnInit {

  club: Club;
  clubId;
  meetId;

  entries: MeetEntry[] = [];

  constructor(private clubService: ClubsService,
              private route: ActivatedRoute,
              private router: Router,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.spinner.show();
      this.clubId = parseInt(params.get('clubId'), 10);
      this.club = this.clubService.getClubById(this.clubId);
      console.log(this.club);
      this.meetId = parseInt(params.get('meetId'), 10);

      this.clubService.getEntries(this.clubId, this.meetId).subscribe((entries: any) => {
        this.entries = entries.entries;
        console.log(this.entries);
        this.spinner.hide();
      });
    });
  }

}
