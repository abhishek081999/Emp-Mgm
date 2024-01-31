import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignLeadsReportComponent } from './campaign-leads-report.component';

describe('CampaignLeadsReportComponent', () => {
  let component: CampaignLeadsReportComponent;
  let fixture: ComponentFixture<CampaignLeadsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignLeadsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignLeadsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
