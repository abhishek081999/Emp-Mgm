import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveDatePickerComponent } from './leave-date-picker.component';

describe('LeaveDatePickerComponent', () => {
  let component: LeaveDatePickerComponent;
  let fixture: ComponentFixture<LeaveDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveDatePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
