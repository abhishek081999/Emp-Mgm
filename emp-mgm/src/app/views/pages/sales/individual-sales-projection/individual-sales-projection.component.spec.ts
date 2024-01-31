import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualSalesProjectionComponent } from './individual-sales-projection.component';

describe('IndividualSalesProjectionComponent', () => {
  let component: IndividualSalesProjectionComponent;
  let fixture: ComponentFixture<IndividualSalesProjectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualSalesProjectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualSalesProjectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
