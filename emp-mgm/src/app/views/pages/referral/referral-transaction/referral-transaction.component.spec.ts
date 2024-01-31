import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralTransactionComponent } from './referral-transaction.component';

describe('ReferralTransactionComponent', () => {
  let component: ReferralTransactionComponent;
  let fixture: ComponentFixture<ReferralTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
