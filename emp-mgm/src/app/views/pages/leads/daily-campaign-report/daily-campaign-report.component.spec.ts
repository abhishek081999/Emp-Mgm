import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyCampaignReportComponent } from './daily-campaign-report.component';

describe('DailyCampaignReportComponent', () => {
  let component: DailyCampaignReportComponent;
  let fixture: ComponentFixture<DailyCampaignReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyCampaignReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyCampaignReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
