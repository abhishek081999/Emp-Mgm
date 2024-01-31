import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioCheckupDetailsComponent } from './portfolio-checkup-details.component';

describe('PortfolioCheckupDetailsComponent', () => {
  let component: PortfolioCheckupDetailsComponent;
  let fixture: ComponentFixture<PortfolioCheckupDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioCheckupDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioCheckupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
