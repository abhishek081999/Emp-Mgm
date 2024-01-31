import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Employee, Team } from 'src/app/model/employee.model';
import { FreshLeadAssignCount } from 'src/app/model/leads.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';
import { LeadsService } from 'src/app/services/leads.service';

@Component({
  selector: 'app-fresh-lead-assign-count',
  templateUrl: './fresh-lead-assign-count.component.html',
  styleUrls: ['./fresh-lead-assign-count.component.scss']
})
export class FreshLeadAssignCountComponent implements OnInit {
  startdate = null
  enddate = null
  team = null
  leadOwner = null
  employeesDrop: Employee[] = [];
  teamsDrop: Team[] = [];
  constructor(
    private leadService: LeadsService,
    private alertNotificationService: AlertNotificationsService,
    private employeeService: EmployeeService,
    private exportService: ExportService,
  ) {
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<FreshLeadAssignCount>;
  isLoading
  dataLength;
  displayedColumns: string[];
  frsLeadCount: FreshLeadAssignCount[] = [];
  async ngOnInit() {
    this.isLoading = true;
    this.displayedColumns = ['employee_name', 'fresh_lead_count', 'date', 'team_lead_name', 'team_name'];
    await this.employeeService.getAllEmployees('all', null, null).toPromise()
      .then(res => {
        this.employeesDrop = res;
        this.employeesDrop = this.employeesDrop.filter(e => e.isActive);
      }).catch(err => this.alertNotificationService.alertError(err));
    await this.employeeService.getAllTeams('all', Departments.Sales).toPromise()
      .then(res => {
        this.teamsDrop = res as Team[];
      }).catch(err => this.alertNotificationService.alertError(err))
    this.filter()
  }
  async filter() {
    this.isLoading = true
    await this.leadService.getFreshLeadAssignCount(this.startdate, this.enddate, this.team, this.leadOwner).toPromise()
      .then(res => {
        this.frsLeadCount = res as FreshLeadAssignCount[];
        console.log(this.frsLeadCount);
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.frsLeadCount);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.frsLeadCount.length;
        this.calculateamount()
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }
  Export() {
    var data = [];
    if (this.dataSource) {
      data = this.dataSource.filteredData;
    } else {
      this.alertNotificationService.alertInfo("No Data Found to Export");
      return;
    }
    var title = 'Fresh Lead Assign Count';
    this.exportService.exportonesheet(title, data);
  }

  totalassigncount = 0;
  calculateamount() {
    this.totalassigncount = this.dataSource.filteredData
      .filter((f) => f.fresh_lead_count)
      .map((e) => e.fresh_lead_count)
      .reduce((acc, value) => Number(acc) + Number(value), 0);
  }
}
