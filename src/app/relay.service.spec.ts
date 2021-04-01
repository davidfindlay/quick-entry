import { TestBed } from '@angular/core/testing';

import { RelayServiceService } from './relay.service';

describe('RelayServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RelayServiceService = TestBed.get(RelayServiceService);
    expect(service).toBeTruthy();
  });
});
