import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreshLeadAssignCountComponent } from './fresh-lead-assign-count.component';

describe('FreshLeadAssignCountComponent', () => {
  let component: FreshLeadAssignCountComponent;
  let fixture: ComponentFixture<FreshLeadAssignCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreshLeadAssignCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreshLeadAssignCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
