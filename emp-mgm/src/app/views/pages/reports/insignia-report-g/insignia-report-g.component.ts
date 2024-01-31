import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { SellsService } from 'src/app/services/sells.service';
@Component({
  selector: 'app-insignia-report-g',
  templateUrl: './insignia-report-g.component.html',
  styleUrls: ['./insignia-report-g.component.scss']
})
export class InsigniaReportGComponent implements OnInit {

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
  year
  month
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
  async ngOnInit() {
    this.displayedColumns = ['coursecode', 'batch_start', 'instructor', 'bcmb_count','bcmb_active_count', 'range_1', 'range_2', 'range_3', 'range_4', 'range_5', 'range_6', 'total',];
    for (var i = 2020; i <= new Date().getFullYear(); i++) {
      this.yearList.push(i)
    }
    this.yearList.reverse();
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
    await this.sellsService.insigniaReport7(this.month, this.year).toPromise()
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
  total_bcmb_count = 0;
  total_bcmb_active_count = 0;
  total_range_1 = 0;
  total_range_2 = 0;
  total_range_3 = 0;
  total_range_4 = 0;
  total_range_5 = 0;
  total_range_6 = 0;
  total_total = 0;

  calculate() {
    if (this.dataSource) {
      this.total_bcmb_count = this.dataSource.filteredData.filter(f => f.bcmb_count).map(e => e.bcmb_count).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_bcmb_active_count = this.dataSource.filteredData.filter(f => f.bcmb_active_count).map(e => e.bcmb_active_count).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_range_1 = this.dataSource.filteredData.filter(f => f.range_1).map(e => e.range_1).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_range_2 = this.dataSource.filteredData.filter(f => f.range_2).map(e => e.range_2).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_range_3 = this.dataSource.filteredData.filter(f => f.range_3).map(e => e.range_3).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_range_4 = this.dataSource.filteredData.filter(f => f.range_4).map(e => e.range_4).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_range_5 = this.dataSource.filteredData.filter(f => f.range_5).map(e => e.range_5).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_range_6 = this.dataSource.filteredData.filter(f => f.range_6).map(e => e.range_6).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_total = this.dataSource.filteredData.filter(f => f.total).map(e => e.total).reduce((acc, value) => Number(acc) + Number(value), 0);
    } else {
      this.total_bcmb_count = 0;
      this.total_bcmb_active_count = 0;
      this.total_range_1 = 0;
      this.total_range_2 = 0;
      this.total_range_3 = 0;
      this.total_range_4 = 0;
      this.total_range_5 = 0;
      this.total_range_6 = 0;
      this.total_total = 0;
    }

  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('INSG Range Batchwise Report', this.dataSource.filteredData)
    }
    else {
      this.alertNotificationService.alertInfo('INSG Range Batchwise Report is Empty')
    }
  }


}
