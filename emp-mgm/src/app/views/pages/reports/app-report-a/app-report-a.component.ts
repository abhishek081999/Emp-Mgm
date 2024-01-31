import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { SellsService } from 'src/app/services/sells.service';
import { roundOff } from 'src/app/utility/roundOff';

@Component({
  selector: 'app-app-report-a',
  templateUrl: './app-report-a.component.html',
  styleUrls: ['./app-report-a.component.scss']
})
export class AppReportAComponent implements OnInit {

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
  startDate
  endDate

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    this.displayedColumns = ['date', 'student_signup', 'invesmentor_free_trial', 'payments', 'net_payment_received'];
    this.refresh();
  }

  refresh(){
    this.isLoading = true
    this.sellsService.appReport1(this.startDate, this.endDate).toPromise()
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
      this.alertNotificationService.alertInfo('Select Date');
    }
  }

  total_student_signup = 0
  total_invesmentor_free_trial = 0
  total_payments = 0
  total_net_payment_received = 0
  calculate() {
    if (this.dataSource) {
      this.total_student_signup = this.dataSource.filteredData.filter(f => f.student_signup).map(e => e.student_signup).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_invesmentor_free_trial = this.dataSource.filteredData.filter(f => f.invesmentor_free_trial).map(e => e.invesmentor_free_trial).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_payments = this.dataSource.filteredData.filter(f => f.payments).map(e => e.payments).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_net_payment_received = this.dataSource.filteredData.filter(f => f.net_payment_received).map(e => e.net_payment_received).reduce((acc, value) => Number(acc) + Number(value), 0);
    } else {
      this.total_student_signup = 0
      this.total_invesmentor_free_trial = 0
      this.total_payments = 0
      this.total_net_payment_received = 0
    }
  }

  export() {
    if (this.dataSource) {
      var data = [this.dataSource.filteredData];
      data.forEach(e => {
        e['date'] = e['date'] ? new Date(e['date']) : null
      })
      this.exportService.exportonesheet('App Report', this.dataSource.filteredData)
    }
    else {
      this.alertNotificationService.alertInfo('App Report is Empty')
    }
  }


}
