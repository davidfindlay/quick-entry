import { TestBed } from '@angular/core/testing';

import { EmergencyContactsService } from './emergency-contacts.service';

describe('EmergencyContactsService', () => {
  let service: EmergencyContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmergencyContactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
