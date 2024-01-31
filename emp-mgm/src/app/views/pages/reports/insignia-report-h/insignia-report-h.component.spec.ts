import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsigniaReportHComponent } from './insignia-report-h.component';

describe('InsigniaReportHComponent', () => {
  let component: InsigniaReportHComponent;
  let fixture: ComponentFixture<InsigniaReportHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsigniaReportHComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsigniaReportHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
