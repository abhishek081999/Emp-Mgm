import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleDatePickerComponent } from './multiple-date-picker.component';

describe('MultipleDatePickerComponent', () => {
  let component: MultipleDatePickerComponent;
  let fixture: ComponentFixture<MultipleDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleDatePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
