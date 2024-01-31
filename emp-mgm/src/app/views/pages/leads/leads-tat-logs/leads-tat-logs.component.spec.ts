import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsTatLogsComponent } from './leads-tat-logs.component';

describe('LeadsTatLogsComponent', () => {
  let component: LeadsTatLogsComponent;
  let fixture: ComponentFixture<LeadsTatLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadsTatLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsTatLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
