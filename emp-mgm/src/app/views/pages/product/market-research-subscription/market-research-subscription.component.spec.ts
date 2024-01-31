import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketResearchSubscriptionComponent } from './market-research-subscription.component';

describe('MarketResearchSubscriptionComponent', () => {
  let component: MarketResearchSubscriptionComponent;
  let fixture: ComponentFixture<MarketResearchSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketResearchSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketResearchSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
