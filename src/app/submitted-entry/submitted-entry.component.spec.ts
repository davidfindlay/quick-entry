import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedEntryComponent } from './submitted-entry.component';

describe('SubmittedEntryComponent', () => {
  let component: SubmittedEntryComponent;
  let fixture: ComponentFixture<SubmittedEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmittedEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittedEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
