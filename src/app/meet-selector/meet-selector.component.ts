import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Meet} from '../models/meet';
import {NgxSpinnerService} from 'ngx-spinner';
import {MeetService} from '../meet.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-meet-selector',
  templateUrl: './meet-selector.component.html',
  styleUrls: ['./meet-selector.component.css']
})
export class MeetSelectorComponent implements OnInit {

  @Input() meetPreset: number;

  meetSelectorForm: FormGroup;
  meets: Meet[];
  meetId;
  filteredMeets = [];
  years = [];
  yearSelected;

  constructor(private fb: FormBuilder,
              private spinner: NgxSpinnerService,
              private meetService: MeetService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {

    this.spinner.show();
    this.meetService.getAllMeets().subscribe((meets: Meet[]) => {
      this.meets = meets;

      for (let i = 0, len = this.meets.length; i < len; i++) {
        const meet = this.meets[i];
        const startDate = new Date(meet.startdate);
        // console.log(startDate);

        const year = startDate.getFullYear();
        if (!this.years.includes(year)) {
          this.years.push(year);
        }

      }

      const meetYear = this.getMeetYear(this.meetId);

      if (this.years.includes(meetYear)) {
        this.meetSelectorForm.patchValue({
          meetYear: meetYear
        });
      }

    });

    this.meetId = this.meetPreset;

    this.meetSelectorForm = this.fb.group({
      meetYear: [this.yearSelected, Validators.required],
      meet: []
    });

    this.meetSelectorForm.valueChanges.subscribe((val) => {
      console.log(val);
      if (parseInt(val.meetYear, 10) !== this.yearSelected) {
        this.yearSelected = parseInt(val.meetYear, 10);
        this.filterMeets();
      }

      if (parseInt(val.meet, 10) !== this.meetId) {
        this.meetId = parseInt(val.meet, 10);
        this.filterMeets();
      }
    });

  }

  getMeetYear(meetId: number) {
    const meet = this.meets.filter(x => x.id === meetId);
    if (meet !== null) {
      return new Date(meet[0].startdate).getFullYear();
    } else {
      return null;
    }
  }

  filterMeets() {
    console.log('filterMeets');
    this.filteredMeets = [];
    for (let i = 0, len = this.meets.length; i < len; i++) {
      const meet = this.meets[i];
      const startDate = new Date(meet.startdate);
      const year = startDate.getFullYear();

      if (year === this.yearSelected) {
        this.filteredMeets.push(meet);
        // console.log('Add Meet ' + meet.meetname);
      }

      if (this.filteredMeets.length > 0) {
        console.log('current meetId: ' + this.meetId);
        if (this.meetId !== undefined && this.meetId !== null) {
          this.meetSelectorForm.patchValue(
            {meet: this.meetId},
            {emitEvent: false}
            );
        } else {
          this.meetId = this.filteredMeets[0].id;
          this.router.navigate(['/', 'pending-entries', this.meetId]);
        }
      }
    }
  }

}
