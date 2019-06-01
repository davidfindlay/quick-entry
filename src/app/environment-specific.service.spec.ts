import { TestBed } from '@angular/core/testing';

import { EnvironmentSpecificService } from './environment-specific.service';

describe('EnvironmentSpecificService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnvironmentSpecificService = TestBed.get(EnvironmentSpecificService);
    expect(service).toBeTruthy();
  });
});
