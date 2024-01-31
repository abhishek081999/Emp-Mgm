import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecordedCourseComponent } from './add-recorded-course.component';

describe('AddRecordedCourseComponent', () => {
  let component: AddRecordedCourseComponent;
  let fixture: ComponentFixture<AddRecordedCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRecordedCourseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRecordedCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
