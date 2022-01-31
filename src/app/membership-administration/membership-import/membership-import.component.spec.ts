import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipImportComponent } from './membership-import.component';

describe('MembershipImportComponent', () => {
  let component: MembershipImportComponent;
  let fixture: ComponentFixture<MembershipImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembershipImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
