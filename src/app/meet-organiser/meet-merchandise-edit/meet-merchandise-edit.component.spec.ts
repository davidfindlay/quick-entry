import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetMerchandiseEditComponent } from './meet-merchandise-edit.component';

describe('MeetMerchandiseEditComponent', () => {
  let component: MeetMerchandiseEditComponent;
  let fixture: ComponentFixture<MeetMerchandiseEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetMerchandiseEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetMerchandiseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
