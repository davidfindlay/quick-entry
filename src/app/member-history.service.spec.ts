import { TestBed } from '@angular/core/testing';

import { MemberHistoryService } from './member-history.service';

describe('MemberHistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MemberHistoryService = TestBed.get(MemberHistoryService);
    expect(service).toBeTruthy();
  });
});
