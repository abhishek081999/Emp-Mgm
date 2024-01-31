import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRegistrationListComponent } from './course-registration-list.component';

describe('CourseRegistrationListComponent', () => {
  let component: CourseRegistrationListComponent;
  let fixture: ComponentFixture<CourseRegistrationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseRegistrationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseRegistrationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
