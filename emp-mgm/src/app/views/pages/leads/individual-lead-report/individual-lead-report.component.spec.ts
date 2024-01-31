import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualLeadReportComponent } from './individual-lead-report.component';

describe('IndividualLeadReportComponent', () => {
  let component: IndividualLeadReportComponent;
  let fixture: ComponentFixture<IndividualLeadReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualLeadReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualLeadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
