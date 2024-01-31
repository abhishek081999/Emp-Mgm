import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSetAttendanceComponent } from './modal-set-attendance.component';

describe('ModalSetAttendanceComponent', () => {
  let component: ModalSetAttendanceComponent;
  let fixture: ComponentFixture<ModalSetAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSetAttendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSetAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
