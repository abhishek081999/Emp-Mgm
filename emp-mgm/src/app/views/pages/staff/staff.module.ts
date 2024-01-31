import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';
import { StaffComponent } from './staff.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgbAccordionModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [StaffComponent, RoleManagementComponent],
  imports: [
    CommonModule,
    StaffRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FeahterIconModule,
    NgbTooltipModule,
    FormsModule,
    NgbAccordionModule,
    MatCheckboxModule
  ]
})
export class StaffModule { }
