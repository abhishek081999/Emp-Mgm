import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstructorListComponent } from './instructor-list/instructor-list.component';
import { InstructorProfileComponent } from './instructor-profile/instructor-profile.component';
import { InstructorComponent } from './instructor.component';

const routes: Routes = [
  {
    path: '',
    component: InstructorComponent,
    children: [
      {
        path:'',
        redirectTo: 'instructor-list',
        pathMatch: 'full'
      },
      {
        path: 'instructor-list',
        component: InstructorListComponent
      },
      {
        path: 'instructor-list/:id',
        component: InstructorProfileComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule { }
