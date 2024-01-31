import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignLeadsEcReportComponent } from './campaign-leads-ec-report.component';

describe('CampaignLeadsEcReportComponent', () => {
  let component: CampaignLeadsEcReportComponent;
  let fixture: ComponentFixture<CampaignLeadsEcReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignLeadsEcReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignLeadsEcReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
