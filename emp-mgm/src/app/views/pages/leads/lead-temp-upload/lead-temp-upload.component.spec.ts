import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadTempUploadComponent } from './lead-temp-upload.component';

describe('LeadTempUploadComponent', () => {
  let component: LeadTempUploadComponent;
  let fixture: ComponentFixture<LeadTempUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadTempUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadTempUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
