import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppReportAComponent } from './app-report-a.component';

describe('AppReportAComponent', () => {
  let component: AppReportAComponent;
  let fixture: ComponentFixture<AppReportAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppReportAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppReportAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
