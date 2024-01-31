import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmbReportAComponent } from './bcmb-report-a.component';

describe('BcmbReportAComponent', () => {
  let component: BcmbReportAComponent;
  let fixture: ComponentFixture<BcmbReportAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcmbReportAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcmbReportAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
