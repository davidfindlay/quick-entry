import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Meet} from '../models/meet';
import {NgxSpinnerService} from 'ngx-spinner';
import {MeetService} from '../meet.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

@Component({
  selector: 'app-meet-selector',
  templateUrl: './meet-selector.component.html',
  styleUrls: ['./meet-selector.component.css']
})
export class MeetSelectorComponent implements OnInit {

  meetSelectorForm: FormGroup;
  meets: Meet[];
  meetPreset;
  meetId;
  filteredMeets = [];
  years = [];
  yearSelected;

  initialLoad = true;

  constructor(private fb: FormBuilder,
              private spinner: NgxSpinnerService,
              private meetService: MeetService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {

    this.spinner.show();

    this.meetPreset = this.route.snapshot.paramMap.get('meetId');
    this.meetId = this.meetPreset;

    this.filterMeets();

    this.meetSelectorForm = this.fb.group({
      meetYear: [this.yearSelected, Validators.required],
      meet: []
    });

    this.meetSelectorForm.controls.meetYear.valueChanges.subscribe((val) => {
      // console.log('meet selector year changes: ' + parseInt(val, 10));

      this.yearSelected = parseInt(val, 10);
      this.filterMeets();
    });

    this.meetSelectorForm.controls.meet.valueChanges.subscribe((val) => {
      // console.log('meet selector meet changes: ' + parseInt(val, 10));

      let routeDelta = [];
      if (this.route.snapshot.paramMap.get('meetId')) {
        routeDelta = ['..', parseInt(val, 10)];
      } else {
        routeDelta = [parseInt(val, 10)];
      }

      this.router.navigate(routeDelta, {
        relativeTo: this.route
      });

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
    // console.log('filterMeets');

    this.filteredMeets = [];

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

      if (!this.yearSelected) {
        this.yearSelected = new Date().getFullYear();
        this.meetSelectorForm.patchValue({
          meetYear: this.yearSelected
        }, { emitEvent: false });
      }

      for (let i = 0, len = this.meets.length; i < len; i++) {
        const meet = this.meets[i];
        const startDate = new Date(meet.startdate);
        const year = startDate.getFullYear();

        if (year === this.yearSelected) {
          this.filteredMeets.push(meet);
          // console.log('Add Meet ' + meet.meetname);
        }

        if (this.filteredMeets.length > 0) {
          // console.log('current meetId: ' + this.meetId);
          if (this.meetId !== undefined && this.meetId !== null) {
            console.log('meet id is set to ' + this.meetId)
            this.meetSelectorForm.patchValue(
              {meet: this.meetId},
              {emitEvent: false}
            );
          } else {
            console.log('meet id not set');
            this.meetId = this.filteredMeets[0].id;
            this.meetSelectorForm.patchValue(
              {meet: this.meetId},
              {emitEvent: true}
            );

          }
        }
      }

      this.spinner.hide();

    });


  }

}
