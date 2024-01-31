import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from 'src/app/model/employee.model';
import { SalesProjectionDisp } from 'src/app/model/salesprojection.model';
import { User } from 'src/app/model/user.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';
import { SellsService } from 'src/app/services/sells.service';

@Component({
  selector: 'app-individual-sales-projection',
  templateUrl: './individual-sales-projection.component.html',
  styleUrls: ['./individual-sales-projection.component.scss'],
})
export class IndividualSalesProjectionComponent implements OnInit {


  constructor(
    private sellsService: SellsService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    private employeeService: EmployeeService,
  ) { }

  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "start date";
  sortOrder = "desc";
  today = new Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<SalesProjectionDisp>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  allSalesProjection: SalesProjectionDisp[] = []
  isLoading: boolean;
  selectMonth = 1
  selectYear = ''
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
  allStaff: Employee[] = [];
  selectStaff = ''
  ngOnInit(): void {
    this.displayedColumns = ["Team_Lead_ID", "Staff_ID", "Month", "ServiceName", "Fees", "Commit_Counts", "Commit_Booked_Rev", "Commit_Payment_Recv",
      "Pro_Rata_Booked_Rev", "Pro_Rata_Payment_Recv", "Actual_Counts", "Actual_Booked_Rev", "Actual_Payment_Recv", "Converted", "Partially_Converted", "Seat_Booked", "Defecit_or_Surplus_Count", "Defecit_or_Surplus_Payment"]
    this.refresh();
    this.selectMonth = this.today.getMonth() + 1;
    this.selectYear = this.today.getFullYear().toString();
  }

  async refresh() {
    this.employeeService.getAllEmployees('all', Departments.Sales, null).toPromise()
      .then(res => {
        this.allStaff = res
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  onchange() {
    this.isLoading = true
    this.sellsService.getIndiCommitProjection(this.selectMonth, this.selectYear, this.selectStaff).toPromise()
      .then(res => {
        this.allSalesProjection = res;
        this.dataSource = new MatTableDataSource(this.allSalesProjection);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.allSalesProjection.length;
        this.calculateamount()
        this.isLoading = false
      }).catch(err => this.alertNotificationService.alertError(err));

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
      if (this.dataSource) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.calculateamount();
      }
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }

    } catch (error) {
      this.alertNotificationService.alertInfo('Select Staff')
    }
  }

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }
}
