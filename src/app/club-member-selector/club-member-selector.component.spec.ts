import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubMemberSelectorComponent } from './club-member-selector.component';

describe('ClubMemberSelectorComponent', () => {
  let component: ClubMemberSelectorComponent;
  let fixture: ComponentFixture<ClubMemberSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubMemberSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubMemberSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
