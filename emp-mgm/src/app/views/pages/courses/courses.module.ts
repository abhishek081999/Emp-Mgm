import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './courses.component';
import { AddRecordedCourseComponent } from './add-recorded-course/add-recorded-course.component';
import { AddLiveCourseComponent } from './add-live-course/add-live-course.component';
import { CourseListComponent } from './course-list/course-list.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AddQuestionSetComponent } from './add-question-set/add-question-set.component';
import { QuestionSetListComponent } from './question-set-list/question-set-list.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { FeedbacksComponent } from './feedbacks/feedbacks.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { CourseListTableComponent } from './course-list-table/course-list-table.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { AddLiveCourseCalenderComponent } from './add-live-course-calender/add-live-course-calender.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ClipboardModule } from 'ngx-clipboard';
import { ChangeScheduleComponent } from './change-schedule/change-schedule.component';
import { CreateWebinarComponent } from './create-webinar/create-webinar.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClassScheduleComponent } from './class-schedule/class-schedule.component';
import { SearchCoursesComponent } from './search-courses/search-courses.component';
import { ModalForPostponeComponent } from './modal-for-postpone/modal-for-postpone.component';
import { PostponeScheduleComponent } from './postpone-schedule/postpone-schedule.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { TrainerWebinarComponent } from './trainer-webinar/trainer-webinar.component';


@NgModule({
  declarations: [
    CoursesComponent, 
    AddRecordedCourseComponent, 
    AddLiveCourseComponent, 
    CourseListComponent, 
    ScheduleComponent, 
    AddQuestionSetComponent, 
    QuestionSetListComponent,
    ReviewsComponent, 
    FeedbacksComponent, 
    SubscriptionsComponent, 
    CourseListTableComponent, 
    CourseDetailsComponent, 
    AddLiveCourseCalenderComponent, ChangeScheduleComponent, CreateWebinarComponent, ClassScheduleComponent, SearchCoursesComponent, ModalForPostponeComponent, PostponeScheduleComponent, TrainerWebinarComponent],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgbModule,
    FeahterIconModule,
    FormsModule,
    NgSelectModule,
    FullCalendarModule,
    ClipboardModule,
    DragDropModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatDialogModule
  ]
})
export class CoursesModule { }
