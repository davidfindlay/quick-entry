import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetEntryContactListComponent } from './meet-entry-contact-list.component';

describe('MeetEntryContactListComponent', () => {
  let component: MeetEntryContactListComponent;
  let fixture: ComponentFixture<MeetEntryContactListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetEntryContactListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetEntryContactListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
