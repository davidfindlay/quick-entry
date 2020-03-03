import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingEntriesComponent } from './pending-entries.component';

describe('PendingEntriesComponent', () => {
  let component: PendingEntriesComponent;
  let fixture: ComponentFixture<PendingEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
