import { TestBed } from '@angular/core/testing';

import { SupportGroupService } from './support-group.service';

describe('SupportGroupService', () => {
  let service: SupportGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
