import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceAndLeaveComponent } from './attendance-and-leave.component';

describe('AttendanceAndLeaveComponent', () => {
  let component: AttendanceAndLeaveComponent;
  let fixture: ComponentFixture<AttendanceAndLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceAndLeaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceAndLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
