import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryMealsMerchandiseComponent } from './entry-meals-merchandise.component';

describe('EntryMealsMerchandiseComponent', () => {
  let component: EntryMealsMerchandiseComponent;
  let fixture: ComponentFixture<EntryMealsMerchandiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryMealsMerchandiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryMealsMerchandiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
