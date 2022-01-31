import { TestBed } from '@angular/core/testing';

import { MembershipImportService } from './membership-import.service';

describe('MembershipImportService', () => {
  let service: MembershipImportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembershipImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
