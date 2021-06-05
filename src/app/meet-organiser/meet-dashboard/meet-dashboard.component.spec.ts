import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetDashboardComponent } from './meet-dashboard.component';

describe('MeetDashboardComponent', () => {
  let component: MeetDashboardComponent;
  let fixture: ComponentFixture<MeetDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
