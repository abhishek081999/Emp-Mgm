import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAdjustmentsComponent } from './request-adjustments.component';

describe('RequestAdjustmentsComponent', () => {
  let component: RequestAdjustmentsComponent;
  let fixture: ComponentFixture<RequestAdjustmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestAdjustmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestAdjustmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
