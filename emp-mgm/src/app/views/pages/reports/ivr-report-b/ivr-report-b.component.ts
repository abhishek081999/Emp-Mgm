import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Department, Employee, Team } from 'src/app/model/employee.model';
import { FreshdeskAgents } from 'src/app/model/zoomAccount.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';
import { SelectionModel } from '@angular/cdk/collections';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from 'src/app/services/reports.service';
import * as moment from 'moment';


@Component({
  selector: 'app-ivr-report-b',
  templateUrl: './ivr-report-b.component.html',
  styleUrls: ['./ivr-report-b.component.scss']
})
export class IvrReportBComponent implements OnInit {

  constructor(
    private reportsServices: ReportsService,
    private alertNotificationService: AlertNotificationsService,
    private employeeService: EmployeeService,
    private exportService: ExportService
  ) { }

  selection = new SelectionModel<any>(true);
  dataSource: MatTableDataSource<FreshdeskAgents>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  getAllIVRReports;
  isLoading = false;
  dataLength;

  displayedColumns: string[];
  employee
  team
  allTeams: Team[] = []
  departments: Department[] = [];
  employees: Employee[];


  department
  month
  year

  yearList = []
  monthList = [{
    name: 'January',
    num: 1
  }, {
    name: 'February',
    num: 2
  }, {
    name: 'March',
    num: 3
  }, {
    name: 'April',
    num: 4
  }, {
    name: 'May',
    num: 5
  }, {
    name: 'June',
    num: 6
  }, {
    name: 'July',
    num: 7
  }, {
    name: 'August',
    num: 8
  }, {
    name: 'September',
    num: 9
  }, {
    name: 'October',
    num: 10
  }, {
    name: 'November',
    num: 11
  }, {
    name: 'December',
    num: 12
  }]

  async ngOnInit() {
    this.displayedColumns = ['team_name', 'team_lead_name', 'staff_name', 'dept_name', 'month', 'agent_number', 'total_call', 'total_duration',
      'incoming_count', 'incoming_duration', 'outgoing_count', 'outgoing_duration'];

    for (var i = 2020; i <= new Date().getFullYear(); i++) {
      this.yearList.push(i)
    }
    this.refresh()
  }
  async refresh() {
    this.isLoading = true;
    await this.employeeService.getAllTeams('display', null).toPromise()
      .then(res => {
        if (res && res.length > 0) {
          res.forEach(e => {
            var teams = e['teams'];
            this.allTeams = [...this.allTeams, ...teams && teams.length > 0 ? teams : []];
          })
        }

      }).catch(err => this.alertNotificationService.alertError(err))


    await this.employeeService.getAllEmployees('all', null, null).toPromise()
      .then(res => {
        this.employees = res;
        this.employees = this.employees.filter(e => e.isActive);
      }).catch(err => this.alertNotificationService.alertError(err));

    await this.employeeService.getAllDepartment('all').toPromise()
      .then(res => {
        this.departments = res as Department[];
      }).catch(err => this.alertNotificationService.alertError(err))
      
    this.filter()
  }




  filter() {
    this.isLoading = true
    this.reportsServices.getivrreportB(this.month, this.year, this.team, this.employee, this.department).toPromise()
      .then(res => {
        this.getAllIVRReports = res
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.getAllIVRReports);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.getAllIVRReports.length;
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
    var title = ' IVR Report-1';
    this.exportService.exportonesheet(title, data);
  }


  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

  getDuration(time) {
    try {
      if (time > 0) {
        return moment.duration(time, 'seconds').humanize(false);
      }
      return '0 sec';
    } catch (error) {
      return '';
    }
  }

}
