import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioCheckupListComponent } from './portfolio-checkup-list.component';

describe('PortfolioCheckupListComponent', () => {
  let component: PortfolioCheckupListComponent;
  let fixture: ComponentFixture<PortfolioCheckupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioCheckupListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioCheckupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
