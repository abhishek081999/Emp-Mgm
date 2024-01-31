import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { SellsService } from 'src/app/services/sells.service';
import { roundOff } from 'src/app/utility/roundOff';

@Component({
  selector: 'app-insignia-report-c',
  templateUrl: './insignia-report-c.component.html',
  styleUrls: ['./insignia-report-c.component.scss']
})
export class InsigniaReportCComponent implements OnInit {

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
    this.displayedColumns = ['employee_code','bcmb_active_count', 'bcmb_inactive_count', 'bcmb_count', 'insignia_opted', 'insignia_opted_conv', 'advance_opted', 'advance_opted_conv', 'product_opted', 'product_opted_conv'];
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
    await this.sellsService.insigniaReport3(this.startDate, this.endDate).toPromise()
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
  total_insignia_opted = 0;
  total_bcmb_active_count = 0;
  total_bcmb_inactive_count = 0;
  total_insignia_opted_conv = 0;
  total_advance_opted = 0;
  total_advance_opted_conv = 0;
  total_product_opted = 0;
  total_product_opted_conv = 0;

  calculate() {
    if (this.dataSource) {
      this.total_bcmb_active_count = this.dataSource.filteredData.filter(f => f.bcmb_active_count).map(e => e.bcmb_active_count).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_bcmb_inactive_count = this.dataSource.filteredData.filter(f => f.bcmb_inactive_count).map(e => e.bcmb_inactive_count).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_bcmb_count = this.dataSource.filteredData.filter(f => f.bcmb_count).map(e => e.bcmb_count).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_insignia_opted = this.dataSource.filteredData.filter(f => f.insignia_opted).map(e => e.insignia_opted).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_insignia_opted_conv = roundOff(this.total_insignia_opted / this.total_bcmb_active_count);
      this.total_advance_opted = this.dataSource.filteredData.filter(f => f.advance_opted).map(e => e.advance_opted).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_advance_opted_conv = roundOff(this.total_advance_opted / this.total_bcmb_active_count);
      this.total_product_opted = this.dataSource.filteredData.filter(f => f.product_opted).map(e => e.product_opted).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_product_opted_conv = roundOff(this.total_product_opted / this.total_bcmb_active_count);
    } else {
      this.total_bcmb_count = 0;
      this.total_insignia_opted = 0;
      this.total_insignia_opted_conv = 0;
      this.total_advance_opted = 0;
      this.total_advance_opted_conv = 0;
      this.total_product_opted = 0;
      this.total_product_opted_conv = 0;
      this.total_bcmb_active_count = 0;
      this.total_bcmb_inactive_count = 0;
    }

  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('BCMB to INSG ECwise Report', this.dataSource.filteredData)
    }
    else {
      this.alertNotificationService.alertInfo('BCMB to INSG ECwise Report is Empty')
    }
  }

}
