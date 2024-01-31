import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './students.component';
import { StudentsListComponent } from './students-list/students-list.component';
import { CourseRegistrationListComponent } from './course-registration-list/course-registration-list.component';
import { MarksComponent } from './marks/marks.component';
import { CertificateComponent } from './certificate/certificate.component';
import { TemporaryBannedComponent } from './temporary-banned/temporary-banned.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StudentActivitiesComponent } from './student-activities/student-activities.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';


@NgModule({
  declarations: [
    StudentsComponent,
    StudentsListComponent,
    CourseRegistrationListComponent,
    MarksComponent,
    CertificateComponent,
    TemporaryBannedComponent,
    StudentActivitiesComponent, StudentProfileComponent],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    FormsModule,
    MatTableModule,
    NgbModule,
    MatSortModule,
    MatPaginatorModule,
    FeahterIconModule,
    NgSelectModule,
    MatCheckboxModule
  ]
})
export class StudentsModule { }
