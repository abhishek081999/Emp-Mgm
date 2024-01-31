import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IvrReportBComponent } from './ivr-report-b.component';

describe('IvrReportBComponent', () => {
  let component: IvrReportBComponent;
  let fixture: ComponentFixture<IvrReportBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IvrReportBComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IvrReportBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
