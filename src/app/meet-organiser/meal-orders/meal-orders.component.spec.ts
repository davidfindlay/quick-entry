import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MealOrdersComponent } from './meal-orders.component';

describe('MealOrdersComponent', () => {
  let component: MealOrdersComponent;
  let fixture: ComponentFixture<MealOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
