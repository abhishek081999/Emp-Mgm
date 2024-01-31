import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceAndLeaveRoutingModule } from './attendance-and-leave-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AttendanceAndLeaveComponent } from './attendance-and-leave.component';
import { AttendanceDashboardComponent } from './attendance-dashboard/attendance-dashboard.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { DeviceInfoService } from 'src/app/services/device.info.service';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalSetAttendanceComponent } from './modal-set-attendance/modal-set-attendance.component';
import { AllRequestsComponent } from './all-requests/all-requests.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';
import { LeaveDatePickerComponent } from './leave-date-picker/leave-date-picker.component';
import { PolicyComponent } from './policy/policy.component';
import { PolicyListComponent } from './policy-list/policy-list.component';
import { LeaveBalanceComponent } from './leave-balance/leave-balance.component';
import { AttendancesettingsComponent } from './attendancesettings/attendancesettings.component';
import { RegularizeAttendanceModalComponent } from './regularize-attendance-modal/regularize-attendance-modal.component';
import { ManagerwiseAttendanceReportComponent } from './managerwise-attendance-report/managerwise-attendance-report.component';
import { AttendanceRosterComponent } from './attendance-roster/attendance-roster.component';


@NgModule({
  declarations: [
    AttendanceAndLeaveComponent,
    AttendanceDashboardComponent,
    ModalSetAttendanceComponent,
    AllRequestsComponent,
    AttendanceReportComponent,
    LeaveDatePickerComponent,
    PolicyComponent,
    LeaveDatePickerComponent,
    PolicyListComponent,
    LeaveBalanceComponent,
    AttendancesettingsComponent,
    RegularizeAttendanceModalComponent,
    ManagerwiseAttendanceReportComponent,
    AttendanceRosterComponent
  ],
  providers: [DeviceInfoService],
  imports: [
    CommonModule,
    AttendanceAndLeaveRoutingModule,
    FormsModule,
    FeahterIconModule,
    PipesModule,
    FullCalendarModule,
    NgSelectModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatDialogModule,
    NgbModule,
    ReactiveFormsModule

  ]
})
export class AttendanceAndLeaveModule { }
