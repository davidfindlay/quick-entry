import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubRelayStatusComponent } from './club-relay-status.component';

describe('ClubRelayStatusComponent', () => {
  let component: ClubRelayStatusComponent;
  let fixture: ComponentFixture<ClubRelayStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubRelayStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubRelayStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
