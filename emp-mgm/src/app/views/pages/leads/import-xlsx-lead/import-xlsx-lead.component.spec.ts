import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportXlsxLeadComponent } from './import-xlsx-lead.component';

describe('ImportXlsxLeadComponent', () => {
  let component: ImportXlsxLeadComponent;
  let fixture: ComponentFixture<ImportXlsxLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportXlsxLeadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportXlsxLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
