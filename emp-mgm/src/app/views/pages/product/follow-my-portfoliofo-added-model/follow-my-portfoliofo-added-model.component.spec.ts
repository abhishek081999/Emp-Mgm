import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowMyPortfoliofoAddedModelComponent } from './follow-my-portfoliofo-added-model.component';

describe('FollowMyPortfoliofoAddedModelComponent', () => {
  let component: FollowMyPortfoliofoAddedModelComponent;
  let fixture: ComponentFixture<FollowMyPortfoliofoAddedModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowMyPortfoliofoAddedModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowMyPortfoliofoAddedModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
