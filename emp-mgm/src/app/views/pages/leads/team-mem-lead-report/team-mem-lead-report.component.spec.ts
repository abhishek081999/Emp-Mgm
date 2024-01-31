import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemLeadReportComponent } from './team-mem-lead-report.component';

describe('TeamMemLeadReportComponent', () => {
  let component: TeamMemLeadReportComponent;
  let fixture: ComponentFixture<TeamMemLeadReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMemLeadReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemLeadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
