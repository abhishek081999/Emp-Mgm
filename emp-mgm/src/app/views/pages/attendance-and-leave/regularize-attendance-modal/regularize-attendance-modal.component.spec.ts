import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularizeAttendanceModalComponent } from './regularize-attendance-modal.component';

describe('RegularizeAttendanceModalComponent', () => {
  let component: RegularizeAttendanceModalComponent;
  let fixture: ComponentFixture<RegularizeAttendanceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegularizeAttendanceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularizeAttendanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
