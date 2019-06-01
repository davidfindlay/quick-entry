import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryConfirmationComponent } from './entry-confirmation.component';

describe('EntryConfirmationComponent', () => {
  let component: EntryConfirmationComponent;
  let fixture: ComponentFixture<EntryConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
