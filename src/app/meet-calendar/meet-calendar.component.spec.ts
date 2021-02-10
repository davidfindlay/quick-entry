import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetCalendarComponent } from './meet-calendar.component';

describe('MeetCalendarComponent', () => {
  let component: MeetCalendarComponent;
  let fixture: ComponentFixture<MeetCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
