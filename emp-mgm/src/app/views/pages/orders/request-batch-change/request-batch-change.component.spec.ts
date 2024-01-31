import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestBatchChangeComponent } from './request-batch-change.component';

describe('RequestBatchChangeComponent', () => {
  let component: RequestBatchChangeComponent;
  let fixture: ComponentFixture<RequestBatchChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestBatchChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestBatchChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
