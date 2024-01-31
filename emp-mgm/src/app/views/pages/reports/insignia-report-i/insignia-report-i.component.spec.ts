import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsigniaReportIComponent } from './insignia-report-i.component';

describe('InsigniaReportIComponent', () => {
  let component: InsigniaReportIComponent;
  let fixture: ComponentFixture<InsigniaReportIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsigniaReportIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsigniaReportIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
