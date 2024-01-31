import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeType } from 'src/app/Enums/staticdata';
import { Department, Designation, Employee, Team } from 'src/app/model/employee.model';
import { Roles } from 'src/app/model/roles.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  EmpType = EmployeeType
  EmpTypeFilter = null;
  departments: Department[] = [];
  DepartmentFilter = null;
  DesignationDrop;
  TeamsDrop;
  RoleFilter = null;
  DesignationFilter = null;
  teamFilter = null;
  allRoles: Roles[] = [];

  employees: Array<Employee> = [];
  employeeList: Array<Employee> = [];
  pagefilter: string = ''
  pagefilter1: string = ''
  today = Date();
  dataLength;
  displayedColumns: string[];

  totalSize: number = 1000
  currentPage: number = 1
  pageSize: number = 12
  isBackPress = false;
  constructor(
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  teams: Team[] = [];
  designations: Designation[] = [];

  ngOnInit() {
    this.route.queryParamMap.subscribe(query => {
      this.currentPage = query.has('page') ? Number(query.get('page')) : 1;
      this.statusfilter = query.get('status');
      this.pagefilter = query.has('q') ? query.get('q').replace('+', ' ') : null;
      this.EmpTypeFilter = query.get('type');
      this.DepartmentFilter = query.get('department');
      this.RoleFilter = query.get('role');
      this.DesignationFilter = query.get('designation');
      this.teamFilter = query.get('team');
    })
    if(this.currentPage != 1){
      this.isBackPress = true
    }
    this.refresh();
  }
  isLoading: boolean
  async refresh() {
    this.isLoading = true
    await this.employeeService.getAllEmployees('display', null, null).toPromise()
      .then(res => {
        this.employees = res as Employee[];
      }).catch(err => this.alertNotificationService.alertError(err))

    this.employeeService.getAllTeams('all', null).toPromise()
      .then(res => {
        this.teams = res as Team[];
        if (this.DepartmentFilter) {
          this.TeamsDrop = this.teams.filter(e => e.department_id == this.DepartmentFilter);

        }

      }).catch(err => this.alertNotificationService.alertError(err))

    this.employeeService.getAllDesignation('all').toPromise()
      .then(res => {
        this.designations = res as Designation[];

        if (this.DepartmentFilter) {
          this.DesignationDrop = this.designations.filter(e => e.department_id == this.DepartmentFilter);

        }
      }).catch(err => this.alertNotificationService.alertError(err))

    this.employeeService.getallrole().toPromise()
      .then(res => {
        this.allRoles = res as Roles[]
      }).catch(err => this.alertNotificationService.alertError(err))

    this.employeeService.getAllDepartment('all').toPromise()
      .then(res => {
        this.departments = res as Department[];
      }).catch(err => this.alertNotificationService.alertError(err))
    this.filter()
    this.isLoading = false
  }

  print() {
    this.exportService.exportonesheet('Employees', this.employees);
  }

  statusfilter

  filter() {
    this.employeeList = [...this.employees];
    const queryParams = {};
    if (this.EmpTypeFilter) {
      this.employeeList = this.employeeList.filter(e => e.employeeType == this.EmpTypeFilter);
      queryParams['type'] = this.EmpTypeFilter;
    }

    if (this.DepartmentFilter) {
      this.employeeList = this.employeeList.filter(e => e.department_id == this.DepartmentFilter);

      this.TeamsDrop = this.teams.filter(e => e.department_id == this.DepartmentFilter);
      this.DesignationDrop = this.designations.filter(e => e.department_id == this.DepartmentFilter);
      queryParams['department'] = this.DepartmentFilter;
    }
    if (this.teamFilter) {
      this.employeeList = this.employeeList.filter(e => e.team_id == this.teamFilter);
      queryParams['team'] = this.teamFilter;

    }
    if (this.DesignationFilter) {
      this.employeeList = this.employeeList.filter(e => e.designation_id == this.DesignationFilter);
      queryParams['designation'] = this.DesignationFilter;

    }
    if (this.RoleFilter) {
      this.employeeList = this.employeeList.filter(e => e.role == this.RoleFilter);
      queryParams['role'] = this.RoleFilter;
    }

    if (this.statusfilter) {
      if (this.statusfilter == 'active') {
        this.employeeList = this.employeeList.filter(e => e.isActive);
      } else if (this.statusfilter == 'inactive') {
        this.employeeList = this.employeeList.filter(e => !e.isActive);
      } else if (this.statusfilter == 'resigned') {
        this.employeeList = this.employeeList.filter(e => e.isResigned);
      }
      queryParams['status'] = this.statusfilter;
    }

    if (this.pagefilter) {
      this.pagefilter = this.pagefilter.toLowerCase()
      this.employeeList = this.employeeList.filter((e) => (e.fullName && e.fullName?.toString()?.toLowerCase()?.indexOf(this.pagefilter) > -1) || (e.telephone && e.telephone?.toLowerCase()?.indexOf(this.pagefilter) > -1) || (e.city && e.city?.toLowerCase()?.indexOf(this.pagefilter) > -1) || (e.email && e.email.toString().toLowerCase().indexOf(this.pagefilter) > -1) || (e.invid && e.invid.toString().toLowerCase().indexOf(this.pagefilter) > -1));
      queryParams['q'] = this.pagefilter.replace(' ', '+');
    }

    if (this.totalSize != this.employeeList.length && !this.isBackPress) {
      this.currentPage = 1
    }
    if(this.isBackPress){
      this.isBackPress = false;
    }
    queryParams['page'] = this.currentPage
    this.totalSize = this.employeeList.length
    this.currentPage = Number(this.currentPage)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
    });

  }

  pagechange() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage
      },
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
    });
  }

}
