import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrantDetailsComponent } from './entrant-details.component';

describe('EntrantDetailsComponent', () => {
  let component: EntrantDetailsComponent;
  let fixture: ComponentFixture<EntrantDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntrantDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
