import { TestBed } from '@angular/core/testing';

import { CheckinMembersService } from './checkin-members.service';

describe('CheckinMembersService', () => {
  let service: CheckinMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckinMembersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
