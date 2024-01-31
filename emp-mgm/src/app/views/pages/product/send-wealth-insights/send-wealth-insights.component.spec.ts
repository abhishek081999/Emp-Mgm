import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendWealthInsightsComponent } from './send-wealth-insights.component';

describe('SendWealthInsightsComponent', () => {
  let component: SendWealthInsightsComponent;
  let fixture: ComponentFixture<SendWealthInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendWealthInsightsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendWealthInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
