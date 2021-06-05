import {Component, OnInit, ViewChild} from '@angular/core';
import {WorkflowNavComponent} from '../workflow-nav/workflow-nav.component';
import {ReplaySubject} from 'rxjs';
import {Meet} from '../models/meet';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MeetService} from '../meet.service';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {MedicalDetails} from '../models/medical-details';
import {EntryService} from '../entry.service';
import {MealMerchandiseDetails} from '../models/meal-merchandise-details';
import {EntryFormObject} from '../models/entry-form-object';

@Component({
  selector: 'app-entry-meals-merchandise',
  templateUrl: './entry-meals-merchandise.component.html',
  styleUrls: ['./entry-meals-merchandise.component.css']
})
export class EntryMealsMerchandiseComponent implements OnInit {

  @ViewChild(WorkflowNavComponent, {static: true}) workflow: WorkflowNavComponent;
  public formValidSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>();

  meet_id: number;
  meet: Meet;
  meetName: string;

  mealsMerchandiseForm: FormGroup;
  mealName = 'Meal';
  mealsQuantity = 0;
  mealSubtotal = 0;

  constructor(private fb: FormBuilder,
              private meetService: MeetService,
              private route: ActivatedRoute,
              private entryService: EntryService) { }

  ngOnInit() {
    this.meet_id = +this.route.snapshot.paramMap.get('meet');
    this.meet = this.meetService.getMeet(this.meet_id);
    if (this.meet) {

      this.meetName = this.meet.meetname;
    }

    console.log('meal name:' + this.meet.mealname + '.');
    if (this.meet.mealname !== null && this.meet.mealname !== '') {
      this.mealName = this.meet.mealname;
    }
    this.createForm();

    // Prefill existing details
    this.getExistingEntry();
  }

  createForm() {
    this.mealsMerchandiseForm = this.fb.group({
      meals: [0],
      mealComments: ['']
    });

    this.mealsMerchandiseForm.valueChanges.subscribe((mealsChanges) => {
      this.mealsQuantity = mealsChanges.meals;
    });

    this.formValidSubject.next(true);
  }

  getExistingEntry() {
    this.entryService.getIncompleteEntryFO(this.meet_id).subscribe((entry: EntryFormObject) => {
      console.log(entry);
      if (entry !== undefined && entry !== null) {
        const mealMerchandiseDetails = entry.mealMerchandiseDetails;
        if (mealMerchandiseDetails !== undefined && mealMerchandiseDetails != null) {

          // Patch the value of the meal form
          this.mealsMerchandiseForm.patchValue(mealMerchandiseDetails);

        }
      }
    });
  }

  addMeal() {
    this.mealsQuantity++;
    this.mealsMerchandiseForm.patchValue({
      meals: this.mealsQuantity
    });

    this.mealSubtotal += this.meet.mealfee;
  }

  removeMeal() {
    if (this.mealsQuantity > 0) {
      this.mealsQuantity--;
      this.mealsMerchandiseForm.patchValue({
        meals: this.mealsQuantity
      });
      this.mealSubtotal -= this.meet.mealfee;
    }
  }

  onSubmit($event) {
    switch ($event) {
      case 'cancel':
        this.entryService.deleteEntry(this.meet_id);
        break;
      case 'saveAndExit':
        this.saveEntry(false);
        break;
      case 'submit':
        this.saveEntry(true);
        break;
    }
  }

  saveEntry(advance) {
    // TODO: don't overwrite existing
    // const mealMerchandiseDetails: MealMerchandiseDetails = Object.assign({}, this.mealsMerchandiseForm.value);

    this.entryService.setMealMerchandiseDetails(this.meet_id, this.mealsMerchandiseForm.controls['meals'].value,
      this.mealsMerchandiseForm.controls['mealComments'].value).subscribe((updated) => {
      console.log(updated);
      if (advance) {
        this.workflow.navigateNext();
      }
    });
  }
}
