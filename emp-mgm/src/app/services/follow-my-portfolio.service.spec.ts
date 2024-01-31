import { TestBed } from '@angular/core/testing';

import { FollowMyPortfolioService } from './follow-my-portfolio.service';

describe('FollowMyPortfolioService', () => {
  let service: FollowMyPortfolioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FollowMyPortfolioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
