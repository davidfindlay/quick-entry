import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportstgMembersComponent } from './sportstg-members.component';

describe('SportstgMembersComponent', () => {
  let component: SportstgMembersComponent;
  let fixture: ComponentFixture<SportstgMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SportstgMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SportstgMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
