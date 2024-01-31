import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ReportsService } from 'src/app/services/reports.service';
import * as moment from 'moment';

@Component({
  selector: 'app-email-log',
  templateUrl: './email-log.component.html',
  styleUrls: ['./email-log.component.scss']
})
export class EmailLogComponent implements OnInit {
  isLoading = false;
  displayedColumns: string[];

  constructor(
    private reportService: ReportsService,
    private alertNotificationService: AlertNotificationsService,

  ) { }
  emailLogger;
  startDate = null;
  endDate = null;
  dataLength;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  async ngOnInit() {
    this.displayedColumns = ['status', 'params', 'messageid', 'templateId', 'to', 'response', 'sentAt', 'deliveredAt']
    this.isLoading = true;
    this.startDate = moment().subtract(1, 'days').format('YYYY-MM-DD')
    this.endDate = moment().format('YYYY-MM-DD')
    this.filter();

  }
  async filter() {
    this.isLoading = true;
    this.reportService.getEmailLog(this.startDate, this.endDate).toPromise()
      .then(r => {
        this.emailLogger = r;
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(this.emailLogger);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.emailLogger.length;
      }).catch(err => this.alertNotificationService.alertError(err));
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
