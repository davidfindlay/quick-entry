import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryStatusSelectorComponent } from './entry-status-selector.component';

describe('EntryStatusSelectorComponent', () => {
  let component: EntryStatusSelectorComponent;
  let fixture: ComponentFixture<EntryStatusSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryStatusSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryStatusSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
