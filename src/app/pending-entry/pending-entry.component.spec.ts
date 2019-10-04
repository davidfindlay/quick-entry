import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingEntryComponent } from './pending-entry.component';

describe('PendingEntryComponent', () => {
  let component: PendingEntryComponent;
  let fixture: ComponentFixture<PendingEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
