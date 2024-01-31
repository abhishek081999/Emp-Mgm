import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLiveCourseComponent } from './add-live-course.component';

describe('AddLiveCourseComponent', () => {
  let component: AddLiveCourseComponent;
  let fixture: ComponentFixture<AddLiveCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLiveCourseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLiveCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
