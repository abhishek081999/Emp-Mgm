import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructorRoutingModule } from './instructor-routing.module';
import { InstructorComponent } from './instructor.component';
import { InstructorListComponent } from './instructor-list/instructor-list.component';
import { InstructorProfileComponent } from './instructor-profile/instructor-profile.component';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbDropdownModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ClipboardModule } from 'ngx-clipboard';


@NgModule({
  declarations: [InstructorComponent, InstructorListComponent, InstructorProfileComponent],
  imports: [
    CommonModule,
    InstructorRoutingModule,
    FormsModule,
    NgbAlertModule,
    FeahterIconModule,
    PipesModule,
    NgbDropdownModule,
    NgbTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgbPaginationModule,
    ClipboardModule
  ]
})
export class InstructorModule { }
