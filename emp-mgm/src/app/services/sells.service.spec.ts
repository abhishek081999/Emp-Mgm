import { TestBed } from '@angular/core/testing';

import { SellsService } from './sells.service';

describe('SellsService', () => {
  let service: SellsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
