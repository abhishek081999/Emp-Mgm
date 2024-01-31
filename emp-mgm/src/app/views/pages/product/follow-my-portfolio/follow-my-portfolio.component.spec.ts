import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowMyPortfolioComponent } from './follow-my-portfolio.component';

describe('FollowMyPortfolioComponent', () => {
  let component: FollowMyPortfolioComponent;
  let fixture: ComponentFixture<FollowMyPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowMyPortfolioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowMyPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
