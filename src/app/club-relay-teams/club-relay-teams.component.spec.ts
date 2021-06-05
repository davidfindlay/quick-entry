import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubRelayTeamsComponent } from './club-relay-teams.component';

describe('ClubRelayTeamsComponent', () => {
  let component: ClubRelayTeamsComponent;
  let fixture: ComponentFixture<ClubRelayTeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubRelayTeamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubRelayTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
