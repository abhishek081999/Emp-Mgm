import { TestBed } from '@angular/core/testing';

import { AlertNotificationsService } from './alert-notifications.service';

describe('AlertNotificationsService', () => {
  let service: AlertNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
