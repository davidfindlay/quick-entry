import { TestBed } from '@angular/core/testing';

import { EntryListService } from './entry-list.service';

describe('EntryListService', () => {
  let service: EntryListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntryListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
