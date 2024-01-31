import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostponeScheduleComponent } from './postpone-schedule.component';

describe('PostponeScheduleComponent', () => {
  let component: PostponeScheduleComponent;
  let fixture: ComponentFixture<PostponeScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostponeScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostponeScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
