import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsigniaReportFComponent } from './insignia-report-f.component';

describe('InsigniaReportFComponent', () => {
  let component: InsigniaReportFComponent;
  let fixture: ComponentFixture<InsigniaReportFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsigniaReportFComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsigniaReportFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
