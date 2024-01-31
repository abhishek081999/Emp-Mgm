import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddLiveCourseCalenderComponent } from './add-live-course-calender/add-live-course-calender.component';
import { AddLiveCourseComponent } from './add-live-course/add-live-course.component';
import { AddQuestionSetComponent } from './add-question-set/add-question-set.component';
import { AddRecordedCourseComponent } from './add-recorded-course/add-recorded-course.component';
import { ClassScheduleComponent } from './class-schedule/class-schedule.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { CourseListTableComponent } from './course-list-table/course-list-table.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CoursesComponent } from './courses.component';
import { FeedbacksComponent } from './feedbacks/feedbacks.component';
import { QuestionSetListComponent } from './question-set-list/question-set-list.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SearchCoursesComponent } from './search-courses/search-courses.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { PostponeScheduleComponent } from './postpone-schedule/postpone-schedule.component';
import { ModalForPostponeComponent } from './modal-for-postpone/modal-for-postpone.component';
import { TrainerWebinarComponent } from './trainer-webinar/trainer-webinar.component';

const routes: Routes = [
  {
    path: '',
    component: CoursesComponent,
    children: [
      {
        path: 'add-recorded-course',
        component: AddRecordedCourseComponent
      },
      {
        path: 'edit-recorded-course/:id',
        component: AddRecordedCourseComponent
      },
      {
        path: 'add-live-course-calender',
        component: AddLiveCourseCalenderComponent
      },
      {
        path: 'courses-directory',
        component: SearchCoursesComponent
      },
      {
        path: 'edit-live-course-calender/:id',
        component: AddLiveCourseCalenderComponent
      },
      {
        path: 'add-live-course',
        component: AddLiveCourseComponent
      },
      {
        path: 'edit-live-course/:id',
        component: AddLiveCourseComponent
      },
      // {
      //   path: 'add-course-bundle',
      //   component: AddCourseBundleComponent
      // },
      // {
      //   path: 'edit-course-bundle/:id',
      //   component: AddCourseBundleComponent
      // },
      {
        path: 'course-list',
        component: CourseListComponent
      },
      {
        path: 'course-list/:code',
        component: CourseDetailsComponent
      },
      {
        path: 'course-list-table',
        component: CourseListTableComponent
      },
      {
        path: 'schedule',
        component: ScheduleComponent
      },
      {
        path: 'class-schedule',
        component: ClassScheduleComponent
      },
      {
        path: 'create-question-set',
        component: AddQuestionSetComponent
      },
      {
        path: 'edit-question-set/:id',
        component: AddQuestionSetComponent
      },
      {
        path: 'question-sets',
        component: QuestionSetListComponent
      },
      {
        path: 'reviews',
        component: ReviewsComponent
      },
      {
        path: 'feedbacks',
        component: FeedbacksComponent
      },
      {
        path: 'subscriptions',
        component: SubscriptionsComponent
      },
      {
        path: 'postpone-schedule',
        component: PostponeScheduleComponent
      },
      {
        path: 'postpone-schedule/sid',
        component: ModalForPostponeComponent
      },
      {
        path: 'instructor-schedule',
        component: TrainerWebinarComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
