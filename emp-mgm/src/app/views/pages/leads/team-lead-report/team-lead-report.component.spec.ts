import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeadReportComponent } from './team-lead-report.component';

describe('TeamLeadReportComponent', () => {
  let component: TeamLeadReportComponent;
  let fixture: ComponentFixture<TeamLeadReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamLeadReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamLeadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
