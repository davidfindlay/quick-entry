import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipTypeAdminComponent } from './membership-type-admin.component';

describe('MembershipTypeAdminComponent', () => {
  let component: MembershipTypeAdminComponent;
  let fixture: ComponentFixture<MembershipTypeAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembershipTypeAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipTypeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
