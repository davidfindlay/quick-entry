import { TestBed } from '@angular/core/testing';

import { ClubAdministrationService } from './club-administration.service';

describe('ClubAdministrationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClubAdministrationService = TestBed.get(ClubAdministrationService);
    expect(service).toBeTruthy();
  });
});
