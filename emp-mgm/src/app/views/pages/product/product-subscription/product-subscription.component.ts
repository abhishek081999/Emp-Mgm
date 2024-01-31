import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from 'src/app/model/employee.model';
import { ProductsDisplay } from 'src/app/model/product.model';
import { ProductSubscriptionView } from 'src/app/model/productpurchase.model';
import { User } from 'src/app/model/user.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';
import { PackageService } from 'src/app/services/package.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-product-subscription',
  templateUrl: './product-subscription.component.html',
  styleUrls: ['./product-subscription.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProductSubscriptionComponent implements OnInit {
  constructor(
    private productService: PackageService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    private userService: UserService,
    private employeeService: EmployeeService
  ) { }

  filterQuery = "";
  rowsOnPage = 5;
  sortBy = "purchasedate";
  sortOrder = "asc";
  today = Date();
  dataLength;
  allproductpurchase: ProductSubscriptionView[] = []
  displayedColumns: string[];
  dataSource: MatTableDataSource<ProductSubscriptionView>;
  payload;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  expandedElement: ProductSubscriptionView | null;
  isavailable = true
  allStudent: User[] = []
  allProduct: ProductsDisplay[] = []
  studentFilter = '';
  productFilter = '';
  staffFilter = '';
  allStaff: Employee[] = []
  displayData: ProductSubscriptionView[] = []
  isLoading = false;
  statusFilter = '';

  async ngOnInit() {
    this.isLoading = true;
    this.displayedColumns = ['last_staff_id', 'studentinvid', 'product_code', 'total_revenue', 'net_revenue', 'gst', 'total_due', 'last_purchase', 'number_of_purchase', 'expiry_date', 'status'];

    await this.productService.getallproSubsView().toPromise()
      .then(res => this.allproductpurchase = res)
      .catch(err => this.alertNotificationService.alertError(err));

    await this.userService.getStudents().toPromise()
      .then(res => this.allStudent = res)
      .catch(err => this.alertNotificationService.alertError(err));
    this.allStudent = this.allStudent.reverse();

    await this.employeeService.getAllEmployees('display', Departments.Sales, null).toPromise()
      .then(res => this.allStaff = res)
      .catch(err => this.alertNotificationService.alertError(err));

    await this.productService.getallProduct().toPromise()
      .then(res => this.allProduct = res)
      .catch(err => this.alertNotificationService.alertError(err));

    this.allproductpurchase.forEach(e => {
      e.expiry_date = e.expiry_date ? new Date(e.expiry_date) : e.expiry_date;
      e.last_purchase = e.last_purchase ? new Date(e.last_purchase) : e.last_purchase;
    })
    this.filter()
    this.isLoading = false;
  }

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

  filter() {
    this.displayData = [...this.allproductpurchase];
    if (this.studentFilter) {
      this.displayData = this.displayData.filter(e => e.studentinvid == this.studentFilter)
    }
    if (this.productFilter) {
      this.displayData = this.displayData.filter(e => e.product_code == this.productFilter)
    }
    if (this.staffFilter) {
      this.displayData = this.displayData.filter(e => e.last_staff_id == this.staffFilter)
    }
    if (this.statusFilter) {
      this.displayData = this.displayData.filter(e => e.status == this.statusFilter)
    }
    this.dataSource = new MatTableDataSource(this.displayData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = this.displayData.length;
    this.isavailable = this.displayData.length > 0;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('Products Purchase', this.dataSource.filteredData)
    } else {
      this.alertNotificationService.alertInfo('No Data to Export.')
    }
  }

  exportDetails(row) {
    var data = []
    if (row.purchase_history && row.purchase_history.length > 0) {
      row.purchase_history.forEach(e => {
        data.push({
          revenue: e.price,
          net_revenue: e.net_revenue,
          purchasedate: e.pruchasedate ? new Date(e.pruchasedate) : e.pruchasedate,
          due: e.due,
          coupon: e.coupon,
          gst: e.gst,
          isexpired: e.isexpired,
          expiry_date: e.expiry_date ? new Date(e.expiry_date) : e.expiry_date,
          student_name: row.studentname,
          student_invid: row.studentinvid,
          product_name: row.product_name,
          product_code: row.product_code,
          staff_name: e.staff_name,
          staff_id: e.staff_id
        })
      })
      this.exportService.exportonesheet("Product Subscription", data);
    } else {
      this.alertNotificationService.alertInfo("No Product Subscription Found.");
    }
  }

}
