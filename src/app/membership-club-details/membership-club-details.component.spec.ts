import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipClubDetailsComponent } from './membership-club-details.component';

describe('MembershipClubDetailsComponent', () => {
  let component: MembershipClubDetailsComponent;
  let fixture: ComponentFixture<MembershipClubDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipClubDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipClubDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
