import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetEntryActionComponent } from './meet-entry-action.component';

describe('MeetEntryActionComponent', () => {
  let component: MeetEntryActionComponent;
  let fixture: ComponentFixture<MeetEntryActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetEntryActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetEntryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
