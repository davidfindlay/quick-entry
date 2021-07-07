import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetConfigurationComponent } from './meet-configuration.component';

describe('MeetConfigurationComponent', () => {
  let component: MeetConfigurationComponent;
  let fixture: ComponentFixture<MeetConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
