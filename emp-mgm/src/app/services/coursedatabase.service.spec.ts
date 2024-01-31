import { TestBed } from '@angular/core/testing';

import { CoursedatabaseService } from './coursedatabase.service';

describe('CoursedatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoursedatabaseService = TestBed.get(CoursedatabaseService);
    expect(service).toBeTruthy();
  });
});
