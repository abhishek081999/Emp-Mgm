import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualSalesReportComponent } from './individual-sales-report.component';

describe('IndividualSalesReportComponent', () => {
  let component: IndividualSalesReportComponent;
  let fixture: ComponentFixture<IndividualSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
