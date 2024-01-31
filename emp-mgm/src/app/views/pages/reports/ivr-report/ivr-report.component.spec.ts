import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IVRReportComponent } from './ivr-report.component';

describe('IVRReportComponent', () => {
  let component: IVRReportComponent;
  let fixture: ComponentFixture<IVRReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IVRReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IVRReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
