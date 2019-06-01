import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificationMedicalDetailsComponent } from './classification-medical-details.component';

describe('ClassificationMedicalDetailsComponent', () => {
  let component: ClassificationMedicalDetailsComponent;
  let fixture: ComponentFixture<ClassificationMedicalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassificationMedicalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationMedicalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
