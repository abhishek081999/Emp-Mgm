import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobapplicationsComponent } from './jobapplications.component';

describe('JobapplicationsComponent', () => {
  let component: JobapplicationsComponent;
  let fixture: ComponentFixture<JobapplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobapplicationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobapplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
