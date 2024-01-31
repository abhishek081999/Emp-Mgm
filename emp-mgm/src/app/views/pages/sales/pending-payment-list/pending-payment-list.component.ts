import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { SellsService } from 'src/app/services/sells.service';

@Component({
  selector: 'app-pending-payment-list',
  templateUrl: './pending-payment-list.component.html',
  styleUrls: ['./pending-payment-list.component.scss']
})
export class PendingPaymentListComponent implements OnInit {

  constructor(
    private sellsService: SellsService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService) { }

  ngOnInit(): void {
    this.displayedColumns = ["sales_rep", "invid", "telephone", "orderID", "service_code", "service_name", "payment_mode",
      "total_amount", "installment_number", "installment_amount", "installment_date"]
    this.refresh();
  }
  rowsOnPage = 10;
  sortBy = "start date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isLoading = true
  allPendingData= []
  refresh() {
    this.isLoading = true;
    this.sellsService.pendingpaymentlists('all').toPromise()
      .then(res => {
        this.allPendingData = res
        this.dataSource = new MatTableDataSource(this.allPendingData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        this.calculateamount()
      }).catch(err => this.alertNotificationService.alertError(err))
  }
  totalinstallment_amount = 0

  calculateamount() {
    this.totalinstallment_amount = this.dataSource.filteredData.filter(e => e.installment_amount).map(m => m.installment_amount).reduce((acc, value) => Number(acc) + Number(value), 0)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.calculateamount()
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('Payment Dues', this.dataSource.filteredData);
    }
    else {
      this.alertNotificationService.alertInfo('No Data To Export')
    }
  }

  gotoorder(order) {
    window.open(`/admin/orders/${order.orderID}`, 'blank');
  }
}
