import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryDetailsTotalsComponent } from './entry-details-totals.component';

describe('EntryDetailsTotalsComponent', () => {
  let component: EntryDetailsTotalsComponent;
  let fixture: ComponentFixture<EntryDetailsTotalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryDetailsTotalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryDetailsTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
