import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesProjectionComponent } from './add-sales-projection.component';

describe('AddSalesProjectionComponent', () => {
  let component: AddSalesProjectionComponent;
  let fixture: ComponentFixture<AddSalesProjectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSalesProjectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalesProjectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
