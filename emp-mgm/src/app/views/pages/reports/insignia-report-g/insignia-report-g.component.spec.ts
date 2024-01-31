import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsigniaReportGComponent } from './insignia-report-g.component';

describe('InsigniaReportGComponent', () => {
  let component: InsigniaReportGComponent;
  let fixture: ComponentFixture<InsigniaReportGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsigniaReportGComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsigniaReportGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
