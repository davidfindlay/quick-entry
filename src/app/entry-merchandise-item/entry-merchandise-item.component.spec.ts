import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryMerchandiseItemComponent } from './entry-merchandise-item.component';

describe('EntryMerchandiseItemComponent', () => {
  let component: EntryMerchandiseItemComponent;
  let fixture: ComponentFixture<EntryMerchandiseItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryMerchandiseItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryMerchandiseItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
