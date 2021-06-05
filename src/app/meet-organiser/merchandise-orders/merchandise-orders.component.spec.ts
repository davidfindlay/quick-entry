import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseOrdersComponent } from './merchandise-orders.component';

describe('MerchandiseOrdersComponent', () => {
  let component: MerchandiseOrdersComponent;
  let fixture: ComponentFixture<MerchandiseOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchandiseOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
