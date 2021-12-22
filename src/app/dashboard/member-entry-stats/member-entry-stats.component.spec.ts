import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberEntryStatsComponent } from './member-entry-stats.component';

describe('MemberEntryStatsComponent', () => {
  let component: MemberEntryStatsComponent;
  let fixture: ComponentFixture<MemberEntryStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberEntryStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberEntryStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
