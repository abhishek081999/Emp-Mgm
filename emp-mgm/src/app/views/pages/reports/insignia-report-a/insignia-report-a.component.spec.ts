import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsigniaReportAComponent } from './insignia-report-a.component';

describe('InsigniaReportAComponent', () => {
  let component: InsigniaReportAComponent;
  let fixture: ComponentFixture<InsigniaReportAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsigniaReportAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsigniaReportAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
