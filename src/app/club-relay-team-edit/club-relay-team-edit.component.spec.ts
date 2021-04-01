import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubRelayTeamEditComponent } from './club-relay-team-edit.component';

describe('ClubRelayTeamEditComponent', () => {
  let component: ClubRelayTeamEditComponent;
  let fixture: ComponentFixture<ClubRelayTeamEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubRelayTeamEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubRelayTeamEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
