import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrantDetailsComponent } from './entrant-details.component';
import {By} from '@angular/platform-browser';

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

  it('should hide your details if entering for self', () => {
    fixture.componentInstance.isAnonymousEntry = false;
    expect(fixture.debugElement.query(By.css('.sectionYourDetails'))).toBeUndefined();
  });

  it('should show your details if entering for self', () => {
    fixture.componentInstance.isAnonymousEntry = true;
    expect(fixture.debugElement.query(By.css('.sectionYourDetails'))).toBeTruthy();
  });

});
