import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCancelComponent } from './confirm-cancel.component';

describe('ConfirmCancelComponent', () => {
  let component: ConfirmCancelComponent;
  let fixture: ComponentFixture<ConfirmCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
