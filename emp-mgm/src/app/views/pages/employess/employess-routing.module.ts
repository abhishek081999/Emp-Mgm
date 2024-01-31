import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentComponent } from './department/department.component';
import { DesignationComponent } from './designation/designation.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeRegistrationComponent } from './employee-registration/employee-registration.component';
import { EmployessComponent } from './employess.component';
import { OrgChartComponent } from './org-chart/org-chart.component';
import { TeamComponent } from './team/team.component';
import { CreateOnboardingsettingComponent } from './create-onboardingsetting/create-onboardingsetting.component';
import { OnboardingTasklistComponent } from './onboarding-tasklist/onboarding-tasklist.component';
import { OffboardingTasklistComponent } from './offboarding-tasklist/offboarding-tasklist.component';

const routes: Routes = [
  {
    path:'',
    component: EmployessComponent,
    children:[
      {
        path:'',
        redirectTo: 'employee-list',
        pathMatch: 'full'
      },
      {
        path: 'employee-list',
        component: EmployeeListComponent
      },
      {
        path: 'employee-registration',
        component: EmployeeRegistrationComponent
      },
      {
        path: 'department',
        component: DepartmentComponent
      },
      {
        path: 'designation',
        component: DesignationComponent
      },
      {
        path: 'team',
        component: TeamComponent
      },
      {
        path: 'create-onboarding-setting',
        component: CreateOnboardingsettingComponent
      },
      {
        path: 'onboarding-task',
        component: OnboardingTasklistComponent
      },
      {
        path: 'org-chart',
        component: OrgChartComponent
      },
      {
        path: 'offboarding-task',
        component:OffboardingTasklistComponent
      },
      {
        path: ':id',
        component: EmployeeDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployessRoutingModule { }
