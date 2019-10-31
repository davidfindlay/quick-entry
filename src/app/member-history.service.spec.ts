import { TestBed } from '@angular/core/testing';

import { MemberHistoryService } from './member-history.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('MemberHistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
  }));

  it('should not request history for NaN', () => {
    const service: MemberHistoryService = TestBed.get(MemberHistoryService);
    expect(service.downloadHistory(NaN)).toBeFalsy();
  });

  it('should not request history for null', () => {
    const service: MemberHistoryService = TestBed.get(MemberHistoryService);
    expect(service.downloadHistory(null)).toBeFalsy();
  });

  it('should not request history for undefined', () => {
    const service: MemberHistoryService = TestBed.get(MemberHistoryService);
    expect(service.downloadHistory(undefined)).toBeFalsy();
  });

});
