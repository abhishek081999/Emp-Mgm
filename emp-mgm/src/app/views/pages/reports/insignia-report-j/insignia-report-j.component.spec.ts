import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsigniaReportJComponent } from './insignia-report-j.component';

describe('InsigniaReportJComponent', () => {
  let component: InsigniaReportJComponent;
  let fixture: ComponentFixture<InsigniaReportJComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsigniaReportJComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsigniaReportJComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
