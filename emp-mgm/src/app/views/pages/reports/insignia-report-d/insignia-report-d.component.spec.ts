import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsigniaReportDComponent } from './insignia-report-d.component';

describe('InsigniaReportDComponent', () => {
  let component: InsigniaReportDComponent;
  let fixture: ComponentFixture<InsigniaReportDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsigniaReportDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsigniaReportDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
