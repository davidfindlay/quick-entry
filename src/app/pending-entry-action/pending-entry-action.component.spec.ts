import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingEntryActionComponent } from './pending-entry-action.component';

describe('PendingEntryActionComponent', () => {
  let component: PendingEntryActionComponent;
  let fixture: ComponentFixture<PendingEntryActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingEntryActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingEntryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
