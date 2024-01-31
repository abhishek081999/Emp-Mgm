import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { getLeadLevel } from 'src/app/model/leads.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { SellsService } from 'src/app/services/sells.service';
import { roundOff } from 'src/app/utility/roundOff';

@Component({
  selector: 'app-insignia-report-a',
  templateUrl: './insignia-report-a.component.html',
  styleUrls: ['./insignia-report-a.component.scss']
})
export class InsigniaReportAComponent implements OnInit {

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
    this.displayedColumns = ['employee_code', 'insignia_count', 'bcmb_student', 'bcmb_student_conv', 'other_source', 'other_source_conv', 'bookedamount', 'paymentreceived', 'due'];
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
    await this.sellsService.insigniaReport1(this.startDate, this.endDate).toPromise()
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
  total_insignia_count = 0;
  total_bcmb_student = 0;
  total_bcmb_student_conv = 0;
  total_other_source = 0;
  total_other_source_conv = 0;
  total_bookedamount = 0;
  total_paymentreceived = 0;
  total_due = 0;

  calculate() {
    if (this.dataSource) {
      this.total_insignia_count = this.dataSource.filteredData.filter(f => f.insignia_count).map(e => e.insignia_count).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_bcmb_student = this.dataSource.filteredData.filter(f => f.bcmb_student).map(e => e.bcmb_student).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_bcmb_student_conv = roundOff(this.total_bcmb_student / this.total_insignia_count);
      this.total_other_source = this.dataSource.filteredData.filter(f => f.other_source).map(e => e.other_source).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_other_source_conv = roundOff(this.total_other_source / this.total_insignia_count);
      this.total_bookedamount = this.dataSource.filteredData.filter(f => f.bookedamount).map(e => e.bookedamount).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_paymentreceived = this.dataSource.filteredData.filter(f => f.paymentreceived).map(e => e.paymentreceived).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_due = this.dataSource.filteredData.filter(f => f.due).map(e => e.due).reduce((acc, value) => Number(acc) + Number(value), 0);
    } else {
      this.total_insignia_count = 0;
      this.total_bcmb_student = 0;
      this.total_bcmb_student_conv = 0;
      this.total_other_source = 0;
      this.total_other_source_conv = 0;
      this.total_bookedamount = 0;
      this.total_paymentreceived = 0;
      this.total_due = 0;
    }

  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('INSG From BCMB Report', this.dataSource.filteredData)
    }
    else {
      this.alertNotificationService.alertInfo('INSG From BCMB Report is Empty')
    }
  }


}
