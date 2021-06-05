import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubEntriesComponent } from './club-entries.component';

describe('ClubEntriesComponent', () => {
  let component: ClubEntriesComponent;
  let fixture: ComponentFixture<ClubEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
