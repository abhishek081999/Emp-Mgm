import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsigniaReportBComponent } from './insignia-report-b.component';

describe('InsigniaReportBComponent', () => {
  let component: InsigniaReportBComponent;
  let fixture: ComponentFixture<InsigniaReportBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsigniaReportBComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsigniaReportBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
