import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelayGuestComponent } from './relay-guest.component';

describe('RelayGuestComponent', () => {
  let component: RelayGuestComponent;
  let fixture: ComponentFixture<RelayGuestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelayGuestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelayGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
