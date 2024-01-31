import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Department, Employee, Policy } from 'src/app/model/employee.model';
import { ExportService } from 'src/app/services/export.service';
import { sortNullValues } from 'src/app/utility/sortNullValues';


@Component({
  selector: 'app-leave-balance',
  templateUrl: './leave-balance.component.html',
  styleUrls: ['./leave-balance.component.scss']
})
export class LeaveBalanceComponent implements OnInit {
  reason;
  nameFilter: any;
  isavailable: boolean;
  getAllleavebalance: any;
  change_balance: any;
  policyNameFilter: string;
  userDetails
  constructor(
    private attendanceService: AttendanceService,
    private alertNotificationService: AlertNotificationsService,
    private employeeService: EmployeeService,
    private modalService: NgbModal,
    private exportService: ExportService
  ) { }

  dataSource: MatTableDataSource<any>;
  dataSource1: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isLoading = false;
  dataLength;
  displayedColumns: string[];
  departments: Department[] = [];
  DepartmentFilter = null;
  managerFilter = null;
  employees: Employee[] = [];
  policies: Policy[] = [];

  leaveBalance = {
    policy_id: '',
    employee_id: '',
    amount: 0
  }
  ngOnInit() {
    this.userDetails = this.employeeService.getUserPayload();
    this.displayedColumns = ['employee_name', 'policy_name', 'balance', 'department', 'manager_name', 'option'];
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
    await this.attendanceService.getPolicylist().toPromise()
      .then(res => {
        this.policies = res;
        this.policies = this.policies.filter(e => e.is_active);
      }).catch(err => this.alertNotificationService.alertError(err));
    this.filter()
  }

  filter() {
    this.isLoading = true
    let nameFilter = null;
    if (this.nameFilter) {
      nameFilter = [this.nameFilter]
    }
    this.attendanceService.getleavebalance(nameFilter, this.policyNameFilter, this.DepartmentFilter, this.managerFilter).toPromise()
      .then(res => {
        this.getAllleavebalance = res
        this.isavailable = this.getAllleavebalance.length > 0;
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.getAllleavebalance);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.getAllleavebalance.length;
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  addLeaveBalance(component) {
    this.modalService.open(component, { size: 'md', scrollable: true, centered: true, }).result
      .then(resp => {
        if (resp == 'Save') {
          this.alertNotificationService.alertCustomMsg('Are you sure you want to add/remove leave balance?')
            .then(res => {
              if (res.isConfirmed) {
                this.attendanceService.updateleavebalance(this.leaveBalance).toPromise()
                  .then(res => {
                    this.alertNotificationService.toastAlertSuccess('Leave Balance Added Successfully');
                    this.leaveBalance = {
                      employee_id: '',
                      policy_id: '',
                      amount: 0
                    };
                    this.refresh();
                  }).catch(err => this.alertNotificationService.alertError(err));
              }
            })
        }
      }).catch(err => { console.log(err) });
  }

  balanceHistory = [];
  history(component, leaveBalance) {
    this.balanceHistory = [];
    if (leaveBalance.history && Array.isArray(leaveBalance.history)) {
      this.balanceHistory = leaveBalance.history
      this.balanceHistory = sortNullValues(this.balanceHistory, 'transaction_date', 'date', 'desc');
    }
    this.dataSource1 = new MatTableDataSource(this.balanceHistory);
    this.modalService.open(component, { size: 'lg', scrollable: true, centered: true, }).result
      .then(resp => {
      }).catch(err => console.log(err));
  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('Leave Balance', this.dataSource.filteredData)
    } else {
      this.alertNotificationService.alertInfo('No Data Present')
    }
  }

  historyExport() {
    if (this.dataSource1) {
      this.exportService.exportonesheet('Leave Balance History', this.dataSource1)
    } else {
      this.alertNotificationService.alertInfo('No Data Present')
    }
  }

  applyFilter(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  filtersearch(event) {
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

}
