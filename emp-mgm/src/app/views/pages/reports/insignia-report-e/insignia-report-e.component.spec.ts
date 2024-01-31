import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsigniaReportEComponent } from './insignia-report-e.component';

describe('InsigniaReportEComponent', () => {
  let component: InsigniaReportEComponent;
  let fixture: ComponentFixture<InsigniaReportEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsigniaReportEComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsigniaReportEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
