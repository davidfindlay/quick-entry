import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetCalendarViewComponent } from './meet-calendar-view.component';

describe('MeetCalendarComponent', () => {
  let component: MeetCalendarViewComponent;
  let fixture: ComponentFixture<MeetCalendarViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetCalendarViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetCalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
