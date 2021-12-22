import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetEntryCountComponent } from './meet-entry-count.component';

describe('MeetEntryCountComponent', () => {
  let component: MeetEntryCountComponent;
  let fixture: ComponentFixture<MeetEntryCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetEntryCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetEntryCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
