import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetAdministrationComponent } from './meet-administration.component';

describe('MeetAdministrationComponent', () => {
  let component: MeetAdministrationComponent;
  let fixture: ComponentFixture<MeetAdministrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetAdministrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
