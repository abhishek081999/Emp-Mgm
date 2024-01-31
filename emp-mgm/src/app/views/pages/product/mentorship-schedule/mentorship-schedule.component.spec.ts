import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorshipScheduleComponent } from './mentorship-schedule.component';

describe('MentorshipScheduleComponent', () => {
  let component: MentorshipScheduleComponent;
  let fixture: ComponentFixture<MentorshipScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorshipScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorshipScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
