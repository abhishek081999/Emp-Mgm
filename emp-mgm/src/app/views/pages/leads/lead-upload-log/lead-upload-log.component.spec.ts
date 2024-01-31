import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadUploadLogComponent } from './lead-upload-log.component';

describe('LeadUploadLogComponent', () => {
  let component: LeadUploadLogComponent;
  let fixture: ComponentFixture<LeadUploadLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadUploadLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadUploadLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
