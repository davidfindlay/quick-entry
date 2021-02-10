import { TestBed } from '@angular/core/testing';

import { MeetAdministrationService } from './meet-administration.service';

describe('MeetAdministrationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MeetAdministrationService = TestBed.get(MeetAdministrationService);
    expect(service).toBeTruthy();
  });
});
