import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveMarketPracticeScheduleComponent } from './live-market-practice-schedule.component';

describe('LiveMarketPracticeScheduleComponent', () => {
  let component: LiveMarketPracticeScheduleComponent;
  let fixture: ComponentFixture<LiveMarketPracticeScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveMarketPracticeScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveMarketPracticeScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
