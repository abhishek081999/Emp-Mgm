import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Employee, Team } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';
import { SellsService } from 'src/app/services/sells.service';
import { roundOff } from 'src/app/utility/roundOff';

@Component({
  selector: 'app-insignia-report-j',
  templateUrl: './insignia-report-j.component.html',
  styleUrls: ['./insignia-report-j.component.scss']
})
export class InsigniaReportJComponent implements OnInit {
  constructor(
    private sellsService: SellsService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    private employeeService: EmployeeService
  ) { }
  isLoading = false
  isavailable = true
  allData: any[] = []
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "start date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  startDate
  endDate
  team
  allTeams: Team[] = []
  allEmployee: Employee[] = []
  employee
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  async ngOnInit() {
    this.displayedColumns = ['teamname', 'employee_id', 'seat_booked', 'partially_converted', 'converted', 'active', 'inactive', 'total', 'conversion_rate', 'bookedamount', 'paymentreceived', 'due'];
    await this.employeeService.getAllEmployees('all', Departments.Sales, null).toPromise()
      .then(res => this.allEmployee = res)
      .catch(err => this.alertNotificationService.alertError(err));

    await this.employeeService.getAllTeams('display', Departments.Sales).toPromise()
      .then(res => {
        var teams = res[0]['teams'];
        this.allTeams = teams && teams.length > 0 ? teams : [];
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  submit() {
    this.isLoading = true
    this.sellsService.insigniaReport10(this.startDate, this.endDate, this.team, this.employee).toPromise()
      .then(res => {
        this.allData = res as any[];
        this.dataSource = new MatTableDataSource(this.allData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.allData.length;
        this.isavailable = this.allData.length > 0;
        this.isLoading = false
        this.calculate();
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  applyFilter(event: Event) {
    try {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      this.calculate();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } catch (error) {
      this.alertNotificationService.alertInfo('Select Date')
    }
  }

  total_seat_booked = 0
  total_partially_converted = 0
  total_converted = 0
  total_inactive = 0
  total_active = 0
  total_total = 0
  total_conversion_rate = 0
  totalbookedamount = 0
  totalpaymentreceived = 0
  totaldue = 0
  calculate() {
    if (this.dataSource) {
      this.total_seat_booked = this.dataSource.filteredData.filter(f => f.seat_booked).map(e => e.seat_booked).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_partially_converted = this.dataSource.filteredData.filter(f => f.partially_converted).map(e => e.partially_converted).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_converted = this.dataSource.filteredData.filter(f => f.converted).map(e => e.converted).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_inactive = this.dataSource.filteredData.filter(f => f.inactive).map(e => e.inactive).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_active = this.dataSource.filteredData.filter(f => f.active).map(e => e.active).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_total = this.dataSource.filteredData.filter(f => f.total).map(e => e.total).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_conversion_rate = roundOff(this.total_converted / this.total_total);
      this.totalbookedamount = this.dataSource.filteredData.filter(f => f.bookedamount).map(e => e.bookedamount).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.totalpaymentreceived = this.dataSource.filteredData.filter(f => f.paymentreceived).map(e => e.paymentreceived).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.totaldue = this.dataSource.filteredData.filter(f => f.due).map(e => e.due).reduce((acc, value) => Number(acc) + Number(value), 0);
    } else {
      this.total_seat_booked = 0
      this.total_partially_converted = 0
      this.total_converted = 0
      this.total_inactive = 0
      this.total_active = 0
      this.total_total = 0
      this.total_conversion_rate = 0
      this.totalbookedamount = 0
      this.totalpaymentreceived = 0
      this.totaldue = 0
    }
  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('INSIGNIA Sales Report', this.dataSource.filteredData)
    }
    else {
      this.alertNotificationService.alertInfo('INSIGNIA Sales Report is Empty')
    }
  }

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }
}
