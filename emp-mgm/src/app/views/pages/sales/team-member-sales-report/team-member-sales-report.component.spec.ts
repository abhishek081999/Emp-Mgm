import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberSalesReportComponent } from './team-member-sales-report.component';

describe('TeamMemberSalesReportComponent', () => {
  let component: TeamMemberSalesReportComponent;
  let fixture: ComponentFixture<TeamMemberSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMemberSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
