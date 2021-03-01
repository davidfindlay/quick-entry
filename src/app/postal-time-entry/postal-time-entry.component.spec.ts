import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostalTimeEntryComponent } from './postal-time-entry.component';

describe('PostalTimeEntryComponent', () => {
  let component: PostalTimeEntryComponent;
  let fixture: ComponentFixture<PostalTimeEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostalTimeEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostalTimeEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
