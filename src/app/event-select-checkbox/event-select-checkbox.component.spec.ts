import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSelectCheckboxComponent } from './event-select-checkbox.component';

describe('EventSelectCheckboxComponent', () => {
  let component: EventSelectCheckboxComponent;
  let fixture: ComponentFixture<EventSelectCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventSelectCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSelectCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
