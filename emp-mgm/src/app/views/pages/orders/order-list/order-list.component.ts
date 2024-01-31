import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Employee } from 'src/app/model/employee.model';
import { Orders } from 'src/app/model/orders.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {



  allData: Array<Orders> = [];
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Orders>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private orderService: OrdersService,
    private alertNotificationService: AlertNotificationsService,
    private router: Router,
    private employeeService: EmployeeService
  ) { }
  allEmployee: Employee[] = []
  empfilter
  startDate
  endDate
  isavailable = true
  isLoading = false
  ngOnInit() {
    this.displayedColumns = ["orderID", "status", "sales_rep", "student_name", "items", "payment_mode", "order_date", "total_amount", "payment_received", "total_due",];
    this.startDate = moment().subtract(3, 'months').startOf('month').format('YYYY-MM-DD');
    this.endDate = moment().endOf('month').format('YYYY-MM-DD');
    this.employeeService.getAllEmployees('all', Departments.Sales, null).toPromise()
      .then(res => this.allEmployee = res)
      .catch(err => this.alertNotificationService.alertError(err));
    this.refreshlist();
  }

  async refreshlist() {
    this.isLoading = true

    await this.orderService.getAllOrders(this.startDate, this.endDate, this.empfilter).toPromise()
      .then(res => {
        this.allData = res as Orders[]
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

  goToOrder(order: Orders) {
    this.router.navigate(['/admin/orders', order.orderID]);
  }

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }
}
