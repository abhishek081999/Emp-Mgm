import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceAndLeaveComponent } from './attendance-and-leave.component';
import { AttendanceDashboardComponent } from './attendance-dashboard/attendance-dashboard.component';
import { AllRequestsComponent } from './all-requests/all-requests.component';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';
import { PolicyComponent } from './policy/policy.component';
import { PolicyListComponent } from './policy-list/policy-list.component';
import { LeaveBalanceComponent } from './leave-balance/leave-balance.component';
import { LeaveDatePickerComponent } from './leave-date-picker/leave-date-picker.component';
import { AttendancesettingsComponent } from './attendancesettings/attendancesettings.component';
import { ManagerwiseAttendanceReportComponent } from './managerwise-attendance-report/managerwise-attendance-report.component';
import { AttendanceRosterComponent } from './attendance-roster/attendance-roster.component';

const routes: Routes = [
  {
    path: '',
    component: AttendanceAndLeaveComponent,
    children: [
      {
        path: '',
        redirectTo: 'attendance-dashboard',
        pathMatch: 'full'
      },
      {
        path: 'attendance-leave',
        component: AttendanceDashboardComponent,
      },
      {
        path: 'policy',
        component: PolicyComponent,
      },
      {
        path: 'Requests',
        component: AllRequestsComponent,
      },
      {
        path: 'Report',
        component: AttendanceReportComponent,
      },
      {
        path: 'Manager-Wise-Report',
        component: ManagerwiseAttendanceReportComponent,
      },
      {
        path: 'leave-balance',
        component: LeaveBalanceComponent,
      },
      {
        path: 'policy-list',
        component: PolicyListComponent,
      },
      {
        path: 'edit-policy/:id',
        component: PolicyComponent
      },
      {
        path: 'leave-apply',
        component: LeaveDatePickerComponent,
      },
      {
        path: 'attendancesettings',
        component: AttendancesettingsComponent,
      },
      {
        path: 'attendance-roster',
        component: AttendanceRosterComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceAndLeaveRoutingModule { }
