import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadAudienceReportComponent } from './lead-audience-report.component';

describe('LeadAudienceReportComponent', () => {
  let component: LeadAudienceReportComponent;
  let fixture: ComponentFixture<LeadAudienceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadAudienceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadAudienceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
