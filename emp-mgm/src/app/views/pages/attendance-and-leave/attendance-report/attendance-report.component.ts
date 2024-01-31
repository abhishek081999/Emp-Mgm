import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { AttendanceReport, Department, Employee } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.scss']
})
export class AttendanceReportComponent implements OnInit {
  startDateAttendance = null
  endDateAttendance = null
  nameFilter = null

  constructor(
    private attendanceService: AttendanceService,
    private alertNotificationService: AlertNotificationsService,
    private employeeService: EmployeeService,
    private exportService: ExportService
  ) { }

  dataSource: MatTableDataSource<AttendanceReport>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  getAllAttendanceReport;
  isLoading = false;
  dataLength;

  displayedColumns: string[];
  departments: Department[] = [];
  DepartmentFilter = null;
  managerFilter = null;
  employees: Employee[] = [];



  async ngOnInit() {
    this.displayedColumns = ['employee_name', 'department', 'attendance_count', 'shift_count', 'leave_count', 'working_days', 'month', 'manager_name',];
    this.startDateAttendance = moment().startOf('month').format('YYYY-MM-DD');
    this.endDateAttendance = moment().startOf('day').format('YYYY-MM-DD');
    this.refresh()
  }


  async refresh() {
    this.isLoading = true;
    await this.employeeService.getAllDepartment('all').toPromise()
      .then(res => {
        this.departments = res as Department[];
      }).catch(err => this.alertNotificationService.alertError(err))


    await this.employeeService.getAllEmployees('all', null, null).toPromise()
      .then(res => {
        this.employees = res;
        this.employees = this.employees.filter(e => e.isActive);
      }).catch(err => this.alertNotificationService.alertError(err));
    this.filter()
  }




  filter() {
    if (!this.startDateAttendance && !this.endDateAttendance) {
      this.alertNotificationService.alertInfo("Please select start and end date")
    }
    var sdate = new Date(this.startDateAttendance)
    var edate = new Date(this.endDateAttendance)
    if (sdate.getMonth() != edate.getMonth()) {
      this.alertNotificationService.alertInfo("The start date and end date should be in the same month")
      return;
    }
    this.isLoading = true
    let nameFilter = null;
    if (this.nameFilter) {
      nameFilter = [this.nameFilter]
    }
    this.attendanceService.getAttendanceReport(this.startDateAttendance, this.endDateAttendance, this.DepartmentFilter, nameFilter, this.managerFilter).toPromise()
      .then(res => {
        this.getAllAttendanceReport = res
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.getAllAttendanceReport);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.getAllAttendanceReport.length;
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  filtersearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  export() {
    var data = [];
    if (this.dataSource) {
      data = this.dataSource.filteredData;
    } else {
      this.alertNotificationService.alertInfo("No Data Found to Export");
      return;
    }
    var title = 'Attendance Report';
    this.exportService.exportonesheet(title, data);
  }


  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

}
