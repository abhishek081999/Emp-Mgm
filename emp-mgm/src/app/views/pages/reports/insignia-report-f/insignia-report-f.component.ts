import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { SellsService } from 'src/app/services/sells.service';
import { roundOff } from 'src/app/utility/roundOff';

@Component({
  selector: 'app-insignia-report-f',
  templateUrl: './insignia-report-f.component.html',
  styleUrls: ['./insignia-report-f.component.scss']
})
export class InsigniaReportFComponent implements OnInit {

  constructor(
    private sellsService: SellsService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
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
  startDate: string = null
  endDate: string = null
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  async ngOnInit() {
    this.displayedColumns = ['employee_code', 'range_1', 'range_2', 'range_3', 'range_4', 'range_5', 'range_6', 'total', 'booked_amount', 'payment_received', 'due', 'average_order_value'];
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

  async submit() {
    this.isLoading = true
    await this.sellsService.insigniaReport6(this.startDate, this.endDate).toPromise()
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
  total_range_1 = 0;
  total_range_2 = 0;
  total_range_3 = 0;
  total_range_4 = 0;
  total_range_5 = 0;
  total_total = 0;
  total_booked_amount = 0;
  total_payment_received = 0;
  total_due = 0;
  total_range_6 = 0;
  total_average_order_value = 0;
  calculate() {
    if (this.dataSource) {
      this.total_range_1 = this.dataSource.filteredData.filter(f => f.range_1).map(e => e.range_1).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_range_2 = this.dataSource.filteredData.filter(f => f.range_2).map(e => e.range_2).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_range_3 = this.dataSource.filteredData.filter(f => f.range_3).map(e => e.range_3).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_range_4 = this.dataSource.filteredData.filter(f => f.range_4).map(e => e.range_4).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_range_5 = this.dataSource.filteredData.filter(f => f.range_5).map(e => e.range_5).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_range_6 = this.dataSource.filteredData.filter(f => f.range_6).map(e => e.range_6).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_total = this.dataSource.filteredData.filter(f => f.total).map(e => e.total).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_booked_amount = this.dataSource.filteredData.filter(f => f.booked_amount).map(e => e.booked_amount).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_payment_received = this.dataSource.filteredData.filter(f => f.payment_received).map(e => e.payment_received).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_due = this.dataSource.filteredData.filter(f => f.due).map(e => e.due).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_average_order_value = roundOff(this.total_booked_amount / this.total_total);
    } else {
      this.total_range_1 = 0;
      this.total_range_2 = 0;
      this.total_range_3 = 0;
      this.total_range_4 = 0;
      this.total_range_5 = 0;
      this.total_range_6 = 0;
      this.total_total = 0;
      this.total_booked_amount = 0;
      this.total_payment_received = 0;
      this.total_due = 0;
    }

  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('INSG Range ECwise Report', this.dataSource.filteredData)
    }
    else {
      this.alertNotificationService.alertInfo('INSG Range ECwise Report is Empty')
    }
  }



}
