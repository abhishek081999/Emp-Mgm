import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Department, Employee } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {

  isLoading: boolean
  displayedColumns: string[];
  dataSource: MatTableDataSource<Department>;
  departments: Department[] = [];
  new_dept: Department = {
    dept_head: '',
    name: ''
  }
  employees: Employee[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isEdit = false;
  constructor(
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService) { }


  ngOnInit(): void {
    this.displayedColumns = ['name', 'dept_head', 'active_emp', 'team_count', 'options']
    this.refresh()
  }
  refresh() {
    this.refreshDepartment();
    this.employeeService.getAllEmployees('all', null, null).toPromise()
      .then(res => {
        this.employees = res;
        this.employees = this.employees.filter(e => e.isActive && e.employeeType == EmployeeType.Full_Time.toString());
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  refreshDepartment() {
    this.employeeService.getAllDepartment('display').toPromise()
      .then(res => {
        this.departments = res;
        this.dataSource = new MatTableDataSource(this.departments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  submit() {
    this.alertNotificationService.alertChanges()
      .then(result => {
        if (result.isConfirmed) {
          this.employeeService.addDepartment(this.new_dept).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Saved Successfully")
              this.new_dept = new Department();
              this.refreshDepartment();
              this.isEdit = false;
            }).catch(err => this.alertNotificationService.alertError(err));
        }
      })
  }

  export() {
    this.exportService.exportonesheet('Department', this.departments)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteDepartment(id) {
    this.alertNotificationService.alertDelete()
      .then(result => {
        if (result.isConfirmed) {
          this.employeeService.deleteDepartment(id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Deleted Successfully")
              this.refreshDepartment();
            }).catch(err => this.alertNotificationService.alertError(err));
        }
      })
  }

  editDepartment(dept) {
    this.new_dept = dept;
    this.isEdit = true;
  }

  cancelEdit() {
    this.new_dept = new Department();
    this.isEdit = false
  }

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }
}
