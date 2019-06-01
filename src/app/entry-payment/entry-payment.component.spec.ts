import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryPaymentComponent } from './entry-payment.component';

describe('EntryPaymentComponent', () => {
  let component: EntryPaymentComponent;
  let fixture: ComponentFixture<EntryPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
