import { TestBed } from '@angular/core/testing';

import { TimeService } from './time.service';

describe('TimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should convert hours min sec correctly', () => {
    expect(TimeService.timeStringToSeconds('2:35:14.34')).toBe(9314.34);
  });

  it('should convert min sec correctly', () => {
    expect(TimeService.timeStringToSeconds('35:14.34')).toBe(2114.34);
  });

  it('should convert sec correctly', () => {
    expect(TimeService.timeStringToSeconds('14.34')).toBe(14.34);
  });
});
