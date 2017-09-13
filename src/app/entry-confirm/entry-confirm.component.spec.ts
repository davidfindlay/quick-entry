import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryConfirmComponent } from './entry-confirm.component';

describe('EntryConfirmComponent', () => {
  let component: EntryConfirmComponent;
  let fixture: ComponentFixture<EntryConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
