import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductpurchaseHistory } from 'src/app/model/package.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { PackageService } from 'src/app/services/package.service';
import * as moment from 'moment';
import { ProductsDisplay } from 'src/app/model/product.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/model/employee.model';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-product-purchase',
  templateUrl: './product-purchase.component.html',
  styleUrls: ['./product-purchase.component.scss'],
  providers: [DatePipe]
})
export class ProductPurchaseComponent implements OnInit {

  constructor(
    private packageService: PackageService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private userService: UserService,
    private employeeService: EmployeeService) { }

  filterQuery = "";
  rowsOnPage = 5;
  sortBy = "purchasedate";
  sortOrder = "asc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<ProductpurchaseHistory>;
  payload;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  allproductview: ProductpurchaseHistory[] = []
  isavailable = true
  allStaff: Employee[] = []
  allStudent: User[] = []
  allProduct: ProductsDisplay[] = []
  studentFilter = '';
  productFilter = '';
  staffFilter = '';
  displayData: ProductpurchaseHistory[] = []
  statusFilter = '';
  isLoading = false

  async ngOnInit() {
    this.isLoading = true
    this.displayedColumns = ['studentid', 'product_name', 'pruchasedate', 'expiry_date', 'status', 'id'];

    await this.packageService.getallProPurchaseHis().toPromise()
      .then(res => this.allproductview = res)
      .catch(err => this.alertNotificationService.alertError(err));

    await this.userService.getStudents().toPromise()
      .then(res => this.allStudent = res)
      .catch(err => this.alertNotificationService.alertError(err));

    this.allStudent = this.allStudent.reverse();


    await this.packageService.getallProduct().toPromise()
      .then(res => this.allProduct = res)
      .catch(err => this.alertNotificationService.alertError(err));

    this.allproductview.forEach(e => {
      e.expiry_date = e.expiry_date ? new Date(e.expiry_date) : e.expiry_date;
      e.pruchasedate = e.pruchasedate ? new Date(e.pruchasedate) : e.pruchasedate;
    })

    this.filter()
    this.isLoading = false
  }

  filter() {
    this.displayData = [...this.allproductview];
    if (this.studentFilter) {
      this.displayData = this.displayData.filter(e => e.studentinvid == this.studentFilter)
    }
    if (this.productFilter) {
      this.displayData = this.displayData.filter(e => e.product_code == this.productFilter)
    }
    if (this.staffFilter) {
      this.displayData = this.displayData.filter(e => e.staff_id == this.staffFilter)
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

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

  exp: string = null
  changeexpiry(content, pph: ProductpurchaseHistory) {
    this.alertNotificationService.alertCustomMsg("Do you want to change Expiry date?")
      .then(result => {
        if (result.isConfirmed) {
          if (pph.expiry_date) {
            this.exp = this.datePipe.transform(pph.expiry_date, 'yyyy-MM-dd')
          }
          this.modalService.open(content, { centered: true }).result.then((result) => {
            if (result == 'Save') {
              var data = {
                expiry_date: this.exp,
                validity: pph.validity,
                pruchasedate: pph.pruchasedate
              }
              pph.expiry_date = new Date(this.exp);
              pph.validity = moment(this.exp).diff(pph.pruchasedate, 'days');
              pph.isexpired = false;
              this.packageService.updateproexpiry(pph._id, data).toPromise()
                .then(res => { this.exp = null; this.alertNotificationService.toastAlertSuccess('Purchase History Updated') })
                .catch(err => this.alertNotificationService.alertError(err))
            }
          }).catch((res) => { this.exp = null });
        }
      })
  }

}
