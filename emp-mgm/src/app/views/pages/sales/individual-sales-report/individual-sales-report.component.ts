import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from 'src/app/model/employee.model';
import { Sellsreport } from 'src/app/model/sales.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';
import { SellsService } from 'src/app/services/sells.service';
import { roundOff } from 'src/app/utility/roundOff';

@Component({
  selector: 'app-individual-sales-report',
  templateUrl: './individual-sales-report.component.html',
  styleUrls: ['./individual-sales-report.component.scss']
})
export class IndividualSalesReportComponent implements OnInit {

  constructor(
    private sellsService: SellsService,
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
  ) { }

  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Sellsreport>;
  sellsReportfinal = [];
  allEmployee: Employee[] = []
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

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
  ngOnInit() {
    this.displayedColumns = ['employeeid', 'employeename', 'role', 'month', 'year', 'bookedamount', 'paymentreceived', 'gst', 'due'];
    for (var i = 2020; i <= new Date().getFullYear(); i++) {
      this.yearList.push(i)
    }
    this.yearList.reverse();
    this.refresh();
  }
  isLoading: boolean
  month
  year
  async refresh() {
    await this.employeeService.getAllEmployees('all', Departments.Sales, null).toPromise()
      .then(res => this.allEmployee = res)
      .catch(err => this.alertNotificationService.alertError(err));
  }

  onchange() {
    this.isLoading = true
    this.sellsService.getsellsReport(this.employee, this.month, this.year).toPromise()
      .then(res => {
        this.sellsReportfinal = res as any[]
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.sellsReportfinal);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.sellsReportfinal.length;
        this.calculateamount()
      }).catch(err => this.alertNotificationService.alertError(err))
  }


  totalbookedamount = 0;
  totaldue = 0;
  totalpaymentreceived = 0;
  totalgst = 0;
  calculateamount() {
    this.totalbookedamount = this.dataSource.filteredData.filter(f => f.bookedamount).map(e => e.bookedamount).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totaldue = this.dataSource.filteredData.filter(f => f.due).map(e => e.due).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalpaymentreceived = this.dataSource.filteredData.filter(f => f.paymentreceived).map(e => e.paymentreceived).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalgst = this.dataSource.filteredData.filter(f => f.gst).map(e => e.gst).reduce((acc, value) => roundOff(Number(acc) + Number(value)), 0)
  }

  employee: string = ''
  export() {
    var data = this.sellsReportfinal.filter((e) => e.employeeid == this.employee)
    if (data.length > 0) {
      this.exportService.exportonesheet(this.employee + 'Sales Report', data)
    }
    else {
      this.alertNotificationService.alertInfo('Staff Sales Report is Empty')
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
      this.alertNotificationService.alertInfo('Select Staff ID')
    }
  }

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }
}