import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetMerchandiseItemComponent } from './meet-merchandise-item.component';

describe('MeetMerchandiseItemComponent', () => {
  let component: MeetMerchandiseItemComponent;
  let fixture: ComponentFixture<MeetMerchandiseItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetMerchandiseItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetMerchandiseItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
