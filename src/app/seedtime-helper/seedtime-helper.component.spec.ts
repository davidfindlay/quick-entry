import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedtimeHelperComponent } from './seedtime-helper.component';

describe('SeedtimeHelperComponent', () => {
  let component: SeedtimeHelperComponent;
  let fixture: ComponentFixture<SeedtimeHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeedtimeHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeedtimeHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
