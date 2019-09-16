import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingEntryListComponent } from './pending-entry-list.component';

describe('PendingEntryListComponent', () => {
  let component: PendingEntryListComponent;
  let fixture: ComponentFixture<PendingEntryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingEntryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
