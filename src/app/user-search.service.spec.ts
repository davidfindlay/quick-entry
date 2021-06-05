import { TestBed } from '@angular/core/testing';

import { UserSearchService } from './user-search.service';

describe('UserSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserSearchService = TestBed.get(UserSearchService);
    expect(service).toBeTruthy();
  });
});
