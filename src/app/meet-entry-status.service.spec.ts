import { TestBed } from '@angular/core/testing';

import { MeetEntryStatusService } from './meet-entry-status.service';

describe('MeetEntryStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MeetEntryStatusService = TestBed.get(MeetEntryStatusService);
    expect(service).toBeTruthy();
  });
});
