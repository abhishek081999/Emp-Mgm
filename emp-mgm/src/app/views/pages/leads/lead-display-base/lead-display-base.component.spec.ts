import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadDisplayBaseComponent } from './lead-display-base.component';

describe('LeadDisplayBaseComponent', () => {
  let component: LeadDisplayBaseComponent;
  let fixture: ComponentFixture<LeadDisplayBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadDisplayBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadDisplayBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
