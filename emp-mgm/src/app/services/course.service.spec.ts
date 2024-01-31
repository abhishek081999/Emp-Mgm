import { TestBed } from '@angular/core/testing';

import { courseService } from './course.service';

describe('CourseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: courseService = TestBed.get(courseService);
    expect(service).toBeTruthy();
  });
});
