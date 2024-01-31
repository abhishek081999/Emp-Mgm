import { TestBed } from '@angular/core/testing';

import { InvesletterService } from './invesletter.service';

describe('InvesletterService', () => {
  let service: InvesletterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvesletterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
