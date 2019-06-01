import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowNavComponent } from './workflow-nav.component';

describe('WorkflowNavComponent', () => {
  let component: WorkflowNavComponent;
  let fixture: ComponentFixture<WorkflowNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('return to index if no previous', () => {
    component.clickBack();
    const location = TestBed.get(Location);
    expect(location.path()).toBe('/');
  });
});
