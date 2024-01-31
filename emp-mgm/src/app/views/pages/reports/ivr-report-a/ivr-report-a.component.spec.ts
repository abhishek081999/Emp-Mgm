import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IvrReportAComponent } from './ivr-report-a.component';

describe('IvrReportAComponent', () => {
  let component: IvrReportAComponent;
  let fixture: ComponentFixture<IvrReportAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IvrReportAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IvrReportAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
