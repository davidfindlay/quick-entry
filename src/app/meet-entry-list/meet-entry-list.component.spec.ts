import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetEntryListComponent } from './meet-entry-list.component';

describe('MeetEntryListComponent', () => {
  let component: MeetEntryListComponent;
  let fixture: ComponentFixture<MeetEntryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetEntryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
