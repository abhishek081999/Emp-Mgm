import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsigniaReportCComponent } from './insignia-report-c.component';

describe('InsigniaReportCComponent', () => {
  let component: InsigniaReportCComponent;
  let fixture: ComponentFixture<InsigniaReportCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsigniaReportCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsigniaReportCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
