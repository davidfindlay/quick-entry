import {ApplicationRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetService} from '../../meet.service';
import {Meet} from '../../models/meet';
import {MeetMerchandise} from '../../models/meet-merchandise';

@Component({
  selector: 'app-meet-merchandise',
  templateUrl: './meet-merchandise.component.html',
  styleUrls: ['./meet-merchandise.component.css']
})
export class MeetMerchandiseComponent implements OnInit {

  meetId;
  meet;
  merchandise: MeetMerchandise[];
  meetName;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private meetService: MeetService,
              private appRef: ApplicationRef) { }

  ngOnInit() {
    this.meetId = parseInt(this.activatedRoute.snapshot.params['meetId'], 10);
    console.log('Meet Merchandise meetId = ' + this.meetId);
    this.meetService.getMeetDetails(this.meetId).subscribe((meet: Meet) => {
      if (meet !== undefined && meet !== null) {
        this.meet = meet;
        this.meetName = meet.meetname;
        this.merchandise = meet.merchandise;
        this.appRef.tick();
      } else {
        console.error('Unable to load meet details for meetId: ' + this.meetId);
      }
    });
  }

  addMerchandise() {
    this.router.navigate(['add'], {relativeTo: this.activatedRoute});

  }

}
