import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificateComponent } from './certificate/certificate.component';
import { CourseRegistrationListComponent } from './course-registration-list/course-registration-list.component';
import { MarksComponent } from './marks/marks.component';
import { StudentActivitiesComponent } from './student-activities/student-activities.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { StudentsListComponent } from './students-list/students-list.component';
import { StudentsComponent } from './students.component';
import { TemporaryBannedComponent } from './temporary-banned/temporary-banned.component';

const routes: Routes = [
  {
    path: '',
    component: StudentsComponent,
    children: [
      {
        path: 'students-list',
        component: StudentsListComponent
      },
      {
        path: 'students-profile/:id',
        component: StudentProfileComponent
      },
      {
        path: 'students-activities',
        component: StudentActivitiesComponent
      },
      {
        path: 'course-registration-list',
        component: CourseRegistrationListComponent
      },
      {
        path: 'marks',
        component: MarksComponent
      },
      {
        path: 'certificates',
        component: CertificateComponent
      },
      {
        path: 'ban-students',
        component: TemporaryBannedComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }
