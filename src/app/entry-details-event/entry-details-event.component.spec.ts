import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryDetailsEventComponent } from './entry-details-event.component';

describe('EntryDetailsEventComponent', () => {
  let component: EntryDetailsEventComponent;
  let fixture: ComponentFixture<EntryDetailsEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryDetailsEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryDetailsEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
