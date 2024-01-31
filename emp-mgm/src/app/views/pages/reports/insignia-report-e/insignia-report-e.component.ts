import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { SellsService } from 'src/app/services/sells.service';
import { roundOff } from 'src/app/utility/roundOff';

@Component({
  selector: 'app-insignia-report-e',
  templateUrl: './insignia-report-e.component.html',
  styleUrls: ['./insignia-report-e.component.scss']
})
export class InsigniaReportEComponent implements OnInit {

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
    this.displayedColumns = ['leadowner', 'demo_count', 'insignia_count', 'insignia_count_conv', 'course_count', 'course_count_conv', 'product_count', 'product_count_conv'];
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
    await this.sellsService.insigniaReport5(this.startDate, this.endDate).toPromise()
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
  total_demo_count = 0;
  total_insignia_count = 0;
  total_insignia_count_conv = 0;
  total_course_count = 0;
  total_course_count_conv = 0;
  total_product_count = 0;
  total_product_count_conv = 0;

  calculate() {
    if (this.dataSource) {
      this.total_demo_count = this.dataSource.filteredData.filter(f => f.demo_count).map(e => e.demo_count).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_insignia_count = this.dataSource.filteredData.filter(f => f.insignia_count).map(e => e.insignia_count).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_insignia_count_conv = roundOff(this.total_insignia_count / this.total_demo_count);
      this.total_course_count = this.dataSource.filteredData.filter(f => f.course_count).map(e => e.course_count).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_course_count_conv = roundOff(this.total_course_count / this.total_demo_count);
      this.total_product_count = this.dataSource.filteredData.filter(f => f.product_count).map(e => e.product_count).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_product_count_conv = roundOff(this.total_product_count / this.total_demo_count);
    } else {
      this.total_demo_count = 0;
      this.total_insignia_count = 0;
      this.total_insignia_count_conv = 0;
      this.total_course_count = 0;
      this.total_course_count_conv = 0;
      this.total_product_count = 0;
      this.total_product_count_conv = 0;
    }

  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('Demo Convertion Report', this.dataSource.filteredData)
    }
    else {
      this.alertNotificationService.alertInfo('Demo Convertion Report is Empty')
    }
  }


}
