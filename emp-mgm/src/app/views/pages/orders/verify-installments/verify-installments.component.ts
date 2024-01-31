import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Employee } from 'src/app/model/employee.model';
import { OrderInstallments } from 'src/app/model/orders.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';
import { OrdersService } from 'src/app/services/orders.service';
import { roundOff } from 'src/app/utility/roundOff';

@Component({
  selector: 'app-verify-installments',
  templateUrl: './verify-installments.component.html',
  styleUrls: ['./verify-installments.component.scss']
})
export class VerifyInstallmentsComponent implements OnInit {

  allData: Array<OrderInstallments> = [];
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<OrderInstallments>;
  allEmployee: Employee[] = []
  empfilter
  startDate
  endDate

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private orderService: OrdersService,
    private alertNotificationService: AlertNotificationsService,
    private router: Router,
    private exportService: ExportService,
    private employeeService: EmployeeService
  ) { }

  isavailable = true
  isLoading = false
  ngOnInit() {
    this.displayedColumns = ["orderID", "sales_rep", "invid", "txnid", "payment_method", "payment_date", "installment_amount", "gst", "additional_charges", "net_payment_accounts", "net_payment_ec", "options"];
    this.employeeService.getAllEmployees('all', Departments.Sales, null).toPromise()
      .then(res => this.allEmployee = res)
      .catch(err => this.alertNotificationService.alertError(err));
    this.refreshlist()
  }

  async refreshlist() {
    this.isLoading = true
    await this.orderService.getPendingInsVerifications(this.startDate, this.endDate, this.empfilter).toPromise()
      .then(res => {
        this.allData = res as OrderInstallments[]
        this.allData.forEach(e => {
          e.installment_date = e.installment_date ? new Date(e.installment_date) : e.installment_date;
          e.payment_date = e.payment_date ? new Date(e.payment_date) : e.payment_date;
          e.settlementDate = e.settlementDate ? new Date(e.settlementDate) : e.settlementDate;
        });
      }).catch(err => this.alertNotificationService.alertError(err));

    this.isavailable = this.allData.length > 0;
    this.isLoading = false
    this.dataSource = new MatTableDataSource(this.allData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = this.allData.length;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goToOrder(order: OrderInstallments) {
    this.router.navigate(['/admin/orders', order.orderID]);
  }

  verifyPayment(oi: OrderInstallments) {
    this.alertNotificationService.alertApprove()
      .then(result => {
        if (result.isConfirmed) {
          this.orderService.verifyPayment({ orderInsID: oi._id }).toPromise()
            .then(res => {
              this.refreshlist()
              this.alertNotificationService.toastAlertSuccess("Payment Verified Successfully");
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  getNetAmount(o: OrderInstallments) {
    return o.is_Paid ? roundOff(o.installment_amount - o.additional_charges - o.sgst - o.cgst - o.igst) : 0;
  }

  export(){
    this.exportService.exportonesheet("Pending Verification List", this.allData)
  }

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }
}
