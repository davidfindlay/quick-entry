import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipImportExceptionsComponent } from './membership-import-exceptions.component';

describe('MembershipImportExceptionsComponent', () => {
  let component: MembershipImportExceptionsComponent;
  let fixture: ComponentFixture<MembershipImportExceptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembershipImportExceptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipImportExceptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
