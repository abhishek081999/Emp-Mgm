import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseListTableComponent } from './course-list-table.component';

describe('CourseListTableComponent', () => {
  let component: CourseListTableComponent;
  let fixture: ComponentFixture<CourseListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseListTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
