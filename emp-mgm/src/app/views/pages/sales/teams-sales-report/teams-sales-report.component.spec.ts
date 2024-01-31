import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsSalesReportComponent } from './teams-sales-report.component';

describe('TeamsSalesReportComponent', () => {
  let component: TeamsSalesReportComponent;
  let fixture: ComponentFixture<TeamsSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamsSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
