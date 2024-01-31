import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAdjustmentListComponent } from './request-adjustment-list.component';

describe('RequestAdjustmentListComponent', () => {
  let component: RequestAdjustmentListComponent;
  let fixture: ComponentFixture<RequestAdjustmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestAdjustmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestAdjustmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
