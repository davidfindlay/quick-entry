import { TestBed } from '@angular/core/testing';

import { UnauthenticatedEntryService } from './unauthenticated-entry.service';

describe('UnauthenticatedEntryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnauthenticatedEntryService = TestBed.get(UnauthenticatedEntryService);
    expect(service).toBeTruthy();
  });
});
