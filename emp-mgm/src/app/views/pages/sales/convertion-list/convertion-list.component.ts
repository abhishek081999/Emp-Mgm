import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Course } from 'src/app/model/course.model';
import { Employee } from 'src/app/model/employee.model';
import { Insignia } from 'src/app/model/insignia.model';
import { ProductsDisplay } from 'src/app/model/product.model';
import { Sellslist } from 'src/app/model/sales.model';
import { User } from 'src/app/model/user.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';
import { InsigniaService } from 'src/app/services/insignia.service';
import { PackageService } from 'src/app/services/package.service';
import { SellsService } from 'src/app/services/sells.service';
import { UserService } from 'src/app/services/user.service';
import { InvesmentorService } from 'src/app/services/invesmentor.service';
import { Invesmentor } from 'src/app/model/invesmentor.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-convertion-list',
  templateUrl: './convertion-list.component.html',
  styleUrls: ['./convertion-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ConvertionListComponent implements OnInit {

  constructor(
    private sellsService: SellsService,
    private userService: UserService,
    private packageService: PackageService,
    private courseService: courseService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    private insigniaService: InsigniaService,
    private employeeService: EmployeeService,
    private invesmentorService: InvesmentorService,
    private route: ActivatedRoute
  ) { }

  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Sellslist>;
  sellsList: Sellslist[] = [];
  allStudent: User[] = [];
  allproduct: ProductsDisplay[] = [];
  allEmployee: Employee[] = []
  allCourse: Course[] = []
  allinsignia: Insignia[] = []
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  srtRange;
  toRange;
  studentfilter;
  empfilter;
  serCdfilter;
  stsfilter;
  filtermode;
  filterSts = ['Active', 'Inactive', 'Refunded', 'Closed'];
  filterpaymode = ['mode1', 'mode2', 'mode3']
  allInvesmentors: Invesmentor[] = []

  expandedElement: Sellslist | null;
  ngOnInit() {
    this.displayedColumns = ['orderID', 'sales_rep', 'student_invid', 'phone', 'service_code', 'service_name', 'batch_date', 'order_date',
      'payment_mode', 'total_amount', 'payment_received', 'total_additional_charges', 'total_gst', 'total_due', 'coupon_code', 'status'];
    this.srtRange = moment().startOf('month').subtract(2, 'months').format('YYYY-MM-DD')
    this.toRange = moment().endOf('month').format('YYYY-MM-DD')
    this.refresh();
    this.route.queryParamMap.subscribe(query => {
      this.studentfilter = query.get('studentfilter');
    })

  }
  isLoading: boolean
  servicecodes = []
  async refresh() {
    this.isLoading = true
    await this.packageService.getallPackage().toPromise()
      .then(res => this.allproduct = res)
      .catch(err => this.alertNotificationService.alertError(err));

    await this.courseService.getAllCourse().toPromise()
      .then(res => this.allCourse = res)
      .catch(err => this.alertNotificationService.alertError(err));

    await this.userService.getStudents().toPromise()
      .then(res => this.allStudent = res)
      .catch(err => this.alertNotificationService.alertError(err));

    await this.employeeService.getAllEmployees('all', Departments.Sales, null).toPromise()
      .then(res => this.allEmployee = res)
      .catch(err => this.alertNotificationService.alertError(err));

    await this.insigniaService.getInsigniaList().toPromise()
      .then(res => this.allinsignia = res)
      .catch(err => this.alertNotificationService.alertError(err));

    await this.invesmentorService.getInvesmentorList().toPromise()
      .then(res => this.allInvesmentors = res)
      .catch(err => this.alertNotificationService.alertError(err));
    this.allproduct.forEach(e => {
      if (e.approve) {
        this.servicecodes.push({ serviceCode: e.productid, name: e.name })
      }
    })

    this.allCourse.forEach(e => {
      if (e.approved) {
        this.servicecodes.push({ serviceCode: e.coursecode, name: e.short_name })
      }
    })

    this.allinsignia.forEach(e => {
      if (e.approved) {
        this.servicecodes.push({ serviceCode: e.code, name: e.name })
      }
    })

    this.allInvesmentors.forEach(e => {
      if (e.approved) {
        this.servicecodes.push({ serviceCode: e.code, name: e.name })
      }
    })
    this.servicecodes = [...this.servicecodes];
    this.filter()
  }

  filter() {
    this.isLoading = true
    this.sellsService.getConversionList(this.srtRange, this.toRange, this.stsfilter, this.filtermode, this.studentfilter, this.empfilter, this.serCdfilter).toPromise()
      .then(res => {
        this.sellsList = res as []
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.sellsList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.sellsList.length;
        this.calculateamount()
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  filtersearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  totalbookedamount = 0;
  totaldue = 0;
  totalpaymentreceived = 0;
  totalgst = 0;
  total_additional_charges
  calculateamount() {
    this.totalbookedamount = this.dataSource.filteredData.filter(f => f.total_amount).map(e => e.total_amount).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totaldue = this.dataSource.filteredData.filter(f => f.total_due).map(e => e.total_due).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalpaymentreceived = this.dataSource.filteredData.filter(f => f.payment_received).map(e => e.payment_received).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalgst = this.dataSource.filteredData.filter(f => f.total_gst).map(e => e.total_gst).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.total_additional_charges = this.dataSource.filteredData.filter(f => f.total_additional_charges).map(e => e.total_additional_charges).reduce((acc, value) => Number(acc) + Number(value), 0)
  }

  print1() {
    var data = this.dataSource.filteredData
    if (data.length > 0) {
      this.exportService.exportonesheet('Conversion List', data)
    }
    else {
      this.alertNotificationService.alertInfo('Employee Conversion List is Empty')
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.calculateamount();
  }

  StaffSearchFn(term: string, item: User) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

  gotoorder(order) {
    window.open(`/admin/orders/${order.orderID}`, 'blank');
  }

}