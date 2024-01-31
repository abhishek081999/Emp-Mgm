import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Team } from 'src/app/model/employee.model'
import { SalesProjectionDisp } from 'src/app/model/salesprojection.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { SellsService } from 'src/app/services/sells.service';


@Component({
  selector: 'app-sales-projection',
  templateUrl: './sales-projection.component.html',
  styleUrls: ['./sales-projection.component.scss'],
  providers: [DatePipe]
})
export class SalesProjectionComponent implements OnInit {

  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "start date";
  sortOrder = "desc";
  today = new Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<SalesProjectionDisp>;
  teamname = ''
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  allSalesProjection: SalesProjectionDisp[] = []
  isLoading: boolean;
  allTeams: Team[] = []
  selectMonth = 1
  selectYear = ''
  constructor(
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    private sellsService: SellsService
  ) { }
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
  years = ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032"];
  ngOnInit(): void {
    this.displayedColumns = ["Team_Lead_ID", "Staff_ID", "Month", "ServiceName", "Fees", "Commit_Counts", "Commit_Booked_Rev", "Commit_Payment_Recv",
      "Pro_Rata_Booked_Rev", "Pro_Rata_Payment_Recv", "Actual_Counts", "Actual_Booked_Rev", "Actual_Payment_Recv", "Converted", "Partially_Converted", "Seat_Booked", "Defecit_or_Surplus_Count", "Defecit_or_Surplus_Payment"]
    this.refresh();
    this.selectMonth = this.today.getMonth() + 1;
    this.selectYear = this.today.getFullYear().toString();
  }

  async refresh() {
    await this.employeeService.getAllTeams('display', Departments.Sales).toPromise()
      .then(res => {
        var teams = res[0]['teams'];
        this.allTeams = teams && teams.length > 0 ? teams : [];
      }).catch(err => this.alertNotificationService.alertError(err))

  }

  onchange() {
    this.isLoading = true
    this.sellsService.getTeamCommitProjection(this.selectMonth, this.selectYear, this.teamname).toPromise()
      .then(res => {
        this.allSalesProjection = res
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.allSalesProjection);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.allSalesProjection.length;
        this.calculateamount()
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  totalCommit_Counts = 0
  totalFees = 0
  totalCommit_Booked_Rev = 0
  totalCommit_Payment_Recv = 0
  totalActual_Counts = 0
  totalActual_Booked_Rev = 0
  totalActual_Payment_Recv = 0
  totalDefecit_or_Surplus_Payment = 0
  totalDefecit_or_Surplus_Count = 0
  totalPro_Rata_Payment_Recv = 0
  totalPro_Rata_Booked_Rev = 0
  totalConverted = 0
  totalPartially_Converted = 0
  totalSeat_Booked = 0

  calculateamount() {
    this.totalCommit_Counts = this.dataSource.filteredData.filter(f => f.Commit_Counts).map(e => e.Commit_Counts).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalFees = this.dataSource.filteredData.filter(f => f.Fees).map(e => e.Fees).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalCommit_Booked_Rev = this.dataSource.filteredData.filter(f => f.Commit_Booked_Rev).map(e => e.Commit_Booked_Rev).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalCommit_Payment_Recv = this.dataSource.filteredData.filter(f => f.Commit_Payment_Recv).map(e => e.Commit_Payment_Recv).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalActual_Counts = this.dataSource.filteredData.filter(f => f.Actual_Counts).map(e => e.Actual_Counts).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalActual_Booked_Rev = this.dataSource.filteredData.filter(f => f.Actual_Booked_Rev).map(e => e.Actual_Booked_Rev).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalActual_Payment_Recv = this.dataSource.filteredData.filter(f => f.Actual_Payment_Recv).map(e => e.Actual_Payment_Recv).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalDefecit_or_Surplus_Payment = this.dataSource.filteredData.filter(f => f.Defecit_or_Surplus_Payment).map(e => e.Defecit_or_Surplus_Payment).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalDefecit_or_Surplus_Count = this.dataSource.filteredData.filter(f => f.Defecit_or_Surplus_Count).map(e => e.Defecit_or_Surplus_Count).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalPro_Rata_Payment_Recv = this.dataSource.filteredData.filter(f => f.Pro_Rata_Payment_Recv).map(e => e.Pro_Rata_Payment_Recv).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalPro_Rata_Booked_Rev = this.dataSource.filteredData.filter(f => f.Pro_Rata_Booked_Rev).map(e => e.Pro_Rata_Booked_Rev).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalConverted = this.dataSource.filteredData.filter(f => f.Converted).map(e => e.Converted).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalPartially_Converted = this.dataSource.filteredData.filter(f => f.Partially_Converted).map(e => e.Partially_Converted).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalSeat_Booked = this.dataSource.filteredData.filter(f => f.Seat_Booked).map(e => e.Seat_Booked).reduce((acc, value) => Number(acc) + Number(value), 0)
  }

  export() {
    var data = this.dataSource.filteredData
    if (data.length > 0) {
      this.exportService.exportonesheet('Sales Projection Report', data);
    }
    else {
      this.alertNotificationService.alertInfo('Sales Projection Report is Empty');
    }
  }

  applyFilter(event: Event) {
    try {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
      this.calculateamount();
    } catch (error) {
      this.alertNotificationService.alertInfo('Select Team')
    }
  }
}
