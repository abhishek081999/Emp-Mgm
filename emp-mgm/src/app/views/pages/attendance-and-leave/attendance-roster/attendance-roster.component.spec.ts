import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceRosterComponent } from './attendance-roster.component';

describe('AttendanceRosterComponent', () => {
  let component: AttendanceRosterComponent;
  let fixture: ComponentFixture<AttendanceRosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceRosterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
