import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyLeadReportComponent } from './daily-lead-report.component';

describe('DailyLeadReportComponent', () => {
  let component: DailyLeadReportComponent;
  let fixture: ComponentFixture<DailyLeadReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyLeadReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyLeadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
