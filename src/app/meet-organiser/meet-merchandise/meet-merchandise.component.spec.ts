import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetMerchandiseComponent } from './meet-merchandise.component';

describe('MeetMerchandiseComponent', () => {
  let component: MeetMerchandiseComponent;
  let fixture: ComponentFixture<MeetMerchandiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetMerchandiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetMerchandiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
