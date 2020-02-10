import {Component, OnInit, ViewChild} from '@angular/core';
import {WorkflowNavComponent} from '../workflow-nav/workflow-nav.component';
import {ReplaySubject} from 'rxjs';
import {Meet} from '../models/meet';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    this.createForm();
  }

  createForm() {
    this.mealsMerchandiseForm = this.fb.group({
      meals: [0],
      mealComments: ['']
    });
  }

}
