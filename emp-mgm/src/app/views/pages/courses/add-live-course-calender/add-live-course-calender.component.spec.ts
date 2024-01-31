import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLiveCourseCalenderComponent } from './add-live-course-calender.component';

describe('AddLiveCourseCalenderComponent', () => {
  let component: AddLiveCourseCalenderComponent;
  let fixture: ComponentFixture<AddLiveCourseCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLiveCourseCalenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLiveCourseCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
