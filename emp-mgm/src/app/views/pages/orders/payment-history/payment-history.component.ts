import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Employee } from 'src/app/model/employee.model';
import { Orders } from 'src/app/model/orders.model';
import { Payment } from 'src/app/model/payment.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {

  filterQuery = "";
  rowsOnPage = 5;
  sortBy = "paymentdate";
  sortOrder = "asc";
  today = Date();
  dataLength;
  payments: Payment[] = []
  displayedColumns: string[];
  dataSource: MatTableDataSource<Payment>;
  payload;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  allEmployee: Employee[] = []
  empfilter
  startDate
  endDate
  isLoading = false
  constructor(
    private orderService: OrdersService,
    private exportService: ExportService,
    private alertNotificationService: AlertNotificationsService,
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.displayedColumns = ["orderID", "sales_rep", "invoice_number", "txnid", "payment_method", "student_invid", "phone", "item_code", "item_name", "installment_amount", "net_received_accounts", "net_received_ec", "additional_charges", "cgst", "sgst", "igst", "total_gst", "coupon_code", "payment_date", "gstin", "_id"]
    this.startDate = moment().startOf('month').subtract(2, 'months').format('YYYY-MM-DD')
    this.endDate = moment().endOf('month').format('YYYY-MM-DD')
    this.employeeService.getAllEmployees('all', Departments.Sales, null).toPromise()
      .then(res => this.allEmployee = res)
      .catch(err => this.alertNotificationService.alertError(err));
    this.filter()
  }

  filter() {
    this.isLoading = true
    this.orderService.getPaymentHistory(this.startDate, this.endDate, this.empfilter).toPromise()
      .then(res => {
        this.payments = res as Payment[]
        this.dataSource = new MatTableDataSource(this.payments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.payments.length;
        this.payments.forEach(e => {
          e.installment_date = new Date(e.installment_date);
          e.payment_date = new Date(e.payment_date);
        })
        this.isLoading = false
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('Payment History', this.dataSource.filteredData)
    }
  }

  getInvoice(payment: Payment) {
    this.orderService.getInvoice(payment._id).toPromise()
      .then(res => {
        const blob = res as Blob;
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = payment.invoice_number.replace(/\//gi, '-') + '.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

  goToOrder(payment: Payment) {
    window.open(`/admin/orders/${payment.orderID}`, 'blank')
  }
}
