import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancesettingsComponent } from './attendancesettings.component';

describe('AttendancesettingsComponent', () => {
  let component: AttendancesettingsComponent;
  let fixture: ComponentFixture<AttendancesettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendancesettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendancesettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
