import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadStagesComponent } from './lead-stages.component';

describe('LeadStagesComponent', () => {
  let component: LeadStagesComponent;
  let fixture: ComponentFixture<LeadStagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadStagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
