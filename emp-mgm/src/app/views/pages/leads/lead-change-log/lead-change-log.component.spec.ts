import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadChangeLogComponent } from './lead-change-log.component';

describe('LeadChangeLogComponent', () => {
  let component: LeadChangeLogComponent;
  let fixture: ComponentFixture<LeadChangeLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadChangeLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadChangeLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
