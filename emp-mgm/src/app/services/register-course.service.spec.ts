import { TestBed, inject } from '@angular/core/testing';

import { RegisterCourseService } from './register-course.service';

describe('RegisterCourseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisterCourseService]
    });
  });

  it('should be created', inject([RegisterCourseService], (service: RegisterCourseService) => {
    expect(service).toBeTruthy();
  }));
});
