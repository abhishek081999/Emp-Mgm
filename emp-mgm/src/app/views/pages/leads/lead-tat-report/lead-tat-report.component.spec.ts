import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadTatReportComponent } from './lead-tat-report.component';

describe('LeadTatReportComponent', () => {
  let component: LeadTatReportComponent;
  let fixture: ComponentFixture<LeadTatReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadTatReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadTatReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
