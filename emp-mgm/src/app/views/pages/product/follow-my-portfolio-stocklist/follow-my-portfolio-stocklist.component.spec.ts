import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowMyPortfolioStocklistComponent } from './follow-my-portfolio-stocklist.component';

describe('FollowMyPortfolioStocklistComponent', () => {
  let component: FollowMyPortfolioStocklistComponent;
  let fixture: ComponentFixture<FollowMyPortfolioStocklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowMyPortfolioStocklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowMyPortfolioStocklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
