import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetListItemComponent } from './meet-list-item.component';

describe('MeetListItemComponent', () => {
  let component: MeetListItemComponent;
  let fixture: ComponentFixture<MeetListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
