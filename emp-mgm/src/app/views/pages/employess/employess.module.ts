import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployessRoutingModule } from './employess-routing.module';
import { EmployessComponent } from './employess.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbDropdownModule, NgbModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ClipboardModule } from 'ngx-clipboard';
import { DepartmentComponent } from './department/department.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DesignationComponent } from './designation/designation.component';
import { TeamComponent } from './team/team.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { OrgChartComponent } from './org-chart/org-chart.component';
import { EmployeeRegistrationComponent } from './employee-registration/employee-registration.component';
import { CreateOnboardingsettingComponent } from './create-onboardingsetting/create-onboardingsetting.component';
import { OnboardingTasklistComponent } from './onboarding-tasklist/onboarding-tasklist.component';
import { OffboardingTasklistComponent } from './offboarding-tasklist/offboarding-tasklist.component';


@NgModule({
  declarations: [EmployessComponent, EmployeeListComponent, DepartmentComponent, DesignationComponent, TeamComponent, EmployeeDetailsComponent, OrgChartComponent, EmployeeRegistrationComponent, CreateOnboardingsettingComponent, OnboardingTasklistComponent, OffboardingTasklistComponent,],
  imports: [
    CommonModule,
    EmployessRoutingModule,
    FormsModule,
    FeahterIconModule,
    PipesModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ClipboardModule,
    NgSelectModule,
    MatExpansionModule,
    NgbModule,
    DragDropModule,
                        
  ]
})
export class EmployessModule { }
