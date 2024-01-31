import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';
import { CreateJobsComponent } from './create-jobs/create-jobs.component';
import { JoblistsComponent } from './joblists/joblists.component';
import { JobapplicationsComponent } from './jobapplications/jobapplications.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgbAlertModule, NgbDropdownModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    JobsComponent,
    CreateJobsComponent,
    JoblistsComponent,
    JobapplicationsComponent
  ],
  imports: [
    CommonModule,
    JobsRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    PipesModule,
    QuillModule.forRoot(), // ngx-quill
    FeahterIconModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgSelectModule,
    NgbAlertModule,
    NgbPaginationModule
  ]
})
export class JobsModule { }
