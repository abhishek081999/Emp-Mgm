import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateJobsComponent } from './create-jobs/create-jobs.component';
import { JobapplicationsComponent } from './jobapplications/jobapplications.component';
import { JoblistsComponent } from './joblists/joblists.component';
import { JobsComponent } from './jobs.component';

const routes: Routes = [
  {
    path: '',
    component: JobsComponent,
    children: [
      {
        path: 'create-job',
        component: CreateJobsComponent
      },
      {
        path: 'edit-job/:id',
        component: CreateJobsComponent
      },
      {
        path: 'joblists',
        component: JoblistsComponent
      },
      {
        path: 'jobapplications',
        component: JobapplicationsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule { }
