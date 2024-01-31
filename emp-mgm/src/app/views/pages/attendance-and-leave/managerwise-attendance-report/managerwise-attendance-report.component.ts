import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Department, Employee, ManagerWiseAttendanceReport } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';

@Component({
  selector: 'app-managerwise-attendance-report',
  templateUrl: './managerwise-attendance-report.component.html',
  styleUrls: ['./managerwise-attendance-report.component.scss']
})
export class ManagerwiseAttendanceReportComponent implements OnInit {

  constructor(
    private attendanceService: AttendanceService,
    private alertNotificationService: AlertNotificationsService,
    private employeeService: EmployeeService,
    private exportService: ExportService
  ) { }
  isLoading = false;
  dataSource: MatTableDataSource<ManagerWiseAttendanceReport>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  getAllAttendanceReport;
  dataLength;
  displayedColumns: string[];
  departments: Department[] = [];
  employees: Employee[] = [];
  DepartmentFilter = null;
  nameFilter = null
  managerFilter = null;
  async ngOnInit() {
    this.displayedColumns = ['manager_name', 'department_name', 'attendance_pending', 'shift_roster_pending', 'regularise_pending', 'leave_pending'];

    this.refresh()
  }
  async refresh() {
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
    this.isLoading = true;
    
    this.attendanceService.getManagerwisePendingReport(this.DepartmentFilter,this.managerFilter ).toPromise()
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
  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }
  export() {
    var data = [];
    if (this.dataSource) {
      data = this.dataSource.filteredData;
    } else {
      this.alertNotificationService.alertInfo("No Data Found to Export");
      return;
    }
    var title = 'Manager Wise Attendance Report';
    this.exportService.exportonesheet(title, data);
  }
}
