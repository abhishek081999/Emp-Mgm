import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerwiseAttendanceReportComponent } from './managerwise-attendance-report.component';

describe('ManagerwiseAttendanceReportComponent', () => {
  let component: ManagerwiseAttendanceReportComponent;
  let fixture: ComponentFixture<ManagerwiseAttendanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerwiseAttendanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerwiseAttendanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
