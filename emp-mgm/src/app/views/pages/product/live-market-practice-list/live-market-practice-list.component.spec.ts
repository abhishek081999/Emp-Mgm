import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveMarketPracticeListComponent } from './live-market-practice-list.component';

describe('LiveMarketPracticeListComponent', () => {
  let component: LiveMarketPracticeListComponent;
  let fixture: ComponentFixture<LiveMarketPracticeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveMarketPracticeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveMarketPracticeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
