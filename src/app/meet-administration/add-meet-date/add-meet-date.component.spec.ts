import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMeetDateComponent } from './add-meet-date.component';

describe('AddMeetDateComponent', () => {
  let component: AddMeetDateComponent;
  let fixture: ComponentFixture<AddMeetDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMeetDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMeetDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
