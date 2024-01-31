import { TestBed } from '@angular/core/testing';

import { SupportSlaService } from './support-sla.service';

describe('SupportSlaService', () => {
  let service: SupportSlaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportSlaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
