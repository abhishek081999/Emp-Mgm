import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAdjustmentHistoryComponent } from './request-adjustment-history.component';

describe('RequestAdjustmentHistoryComponent', () => {
  let component: RequestAdjustmentHistoryComponent;
  let fixture: ComponentFixture<RequestAdjustmentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestAdjustmentHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestAdjustmentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
