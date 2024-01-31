import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ShortMonths } from 'src/app/Enums/staticdata';
import { Coupon } from 'src/app/model/coupon.model';
import { Employee } from 'src/app/model/employee.model';
import { User } from 'src/app/model/user.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {

  constructor(
    private CourseService: courseService,
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService
  ) { }

  newcoupon: any = {
    _id: '',
    couponcode: '',
    numberofuse: 0,
    expirydate: new Date(),
    forfirsttime: false,
    type: '',
    minimumbal: 0,
    price: 0,
    isexpired: false,
    user: [],
    startdate: new Date(),
    prefixcode: '',
    staffids: [] || '',
    month: '',
    approve: false
  }

  filterQuery = "";
  rowsOnPage = 5;
  sortBy = "expirydate";
  sortOrder = "asc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Coupon>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  coupons: Array<Coupon> = []
  allcoupons: any[] = []
  serverErrorMessages: ''
  selection = new SelectionModel<Coupon>(true, []);
  allEmployee: Employee[] = []
  allInstructor: Employee[] = []
  allBA: Employee[] = []
  allAP: Employee[] = []
  allAdmin: Employee[] = []
  allUser: Employee[] = []
  allStaff: Employee[] = []
  allMonth = ShortMonths
  year = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

  ngOnInit() {
    this.displayedColumns = ['select', 'couponcode', 'staffid', 'staffname', 'month', 'year', 'startdate', 'expirydate', 'type', 'numberofuse', 'minimumbal', 'price', 'approve', 'id'];
    this.refresh()
  }
  isLoading: boolean
  async refresh() {
    this.isLoading = true
    await this.employeeService.getAllEmployees('all', null, null).toPromise()
      .then(res => this.allUser = res)
      .catch(err => this.alertNotificationService.alertError(err));

    if (this.allUser.length > 0) {
      this.allEmployee = this.allUser.filter((e) => e.invid && e.invid.startsWith('E'))
      this.allBA = this.allUser.filter((e) => e.invid && e.invid.startsWith('BA'))
      this.allAP = this.allUser.filter((e) => e.invid && e.invid.startsWith('AP'))
      this.allAdmin = this.allUser.filter((e) => e.invid && e.role == 'admin')
      this.allInstructor = this.allUser.filter((e) => e.invid && e.role == 'instructor')
    }

    await this.CourseService.getallcoupons().toPromise()
      .then(res => {
        this.coupons = JSON.parse(JSON.stringify(res));
        this.allcoupons = JSON.parse(JSON.stringify(res))
      }).catch(err => this.alertNotificationService.alertError(err));

    this.allcoupons.forEach((e) => {
      var user = this.allUser.filter((f) => e.staffid && f.invid == e.staffid)[0]
      e.staffname = user ? user.fullName : null;
      e.month = e.month && this.year.indexOf(e.month) < 12 ? this.allMonth[this.year.indexOf(e.month)] : null;
      e.year = e.year ? 2020 + this.year.indexOf(e.year) : null;
    })

    this.dataSource = new MatTableDataSource(this.allcoupons.reverse());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = false
  }
  allnewcoupons: Coupon[] = []
  postCoupon(f: NgForm) {
    this.alertNotificationService.alertCustomMsg('Do you sure you want to Submit?')
      .then(result => {
        if (result.isConfirmed) {
          if (!this.isedit) {
            this.allnewcoupons = []
            var staffids = this.newcoupon.staffids as string[]
            //console.log(staffids,this.newcoupon.staffids)
            staffids.forEach((e) => {
              if (e.toString() != '0') {
                var cou = new Coupon();
                cou.approve = false;
                cou.expirydate = new Date(this.newcoupon.expirydate);
                cou.startdate = new Date(this.newcoupon.startdate);
                cou.forfirsttime = false;
                cou.isexpired = false;
                cou.minimumbal = Number(this.newcoupon.minimumbal);
                cou.month = this.newcoupon.month;
                cou.year = this.year[new Date(this.newcoupon.startdate).getFullYear() - 2020]
                cou.numberofuse = Number(this.newcoupon.numberofuse);
                cou.prefixcode = this.newcoupon.prefixcode;
                cou.price = Number(this.newcoupon.price);
                cou.staffid = e;
                cou.type = this.newcoupon.type;
                cou.user = [];
                cou.couponcode = this.gencoupon(cou, e);
                this.allnewcoupons.push(cou)
              }
            })

            this.CourseService.addcoupon(this.allnewcoupons).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Coupon Added Successfully')
                f.resetForm()
                this.refresh()
              }).catch(err => this.alertNotificationService.alertError(err))
          }
          else {
            var cou = new Coupon();
            cou._id = this.newcoupon._id;
            cou.approve = this.newcoupon.approve;
            cou.expirydate = new Date(this.newcoupon.expirydate);
            cou.startdate = new Date(this.newcoupon.startdate);
            cou.forfirsttime = this.newcoupon.forfirsttime;
            cou.isexpired = this.newcoupon.isexpired;
            cou.minimumbal = Number(this.newcoupon.minimumbal);
            cou.month = this.newcoupon.month;
            cou.year = this.year[new Date(this.newcoupon.startdate).getFullYear() - 2020]
            cou.numberofuse = Number(this.newcoupon.numberofuse);
            cou.prefixcode = this.newcoupon.prefixcode;
            cou.price = Number(this.newcoupon.price);
            cou.staffid = this.newcoupon.staffids;
            cou.type = this.newcoupon.type;
            cou.user = this.newcoupon.user;
            cou.couponcode = this.gencoupon(cou, cou.staffid);

            this.CourseService.updatecoupon(cou).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Coupon Updated Successfully')
                f.resetForm()
                this.refresh()
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        }
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  onDelete(id) {
    this.alertNotificationService.alertDelete()
      .then(result => {
        if (result.isConfirmed) {
          this.CourseService.deletecoupon(id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Deleted Successfully')
              this.refresh()
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  isedit = false
  onEdit(coupon) {
    document.documentElement.scrollTop = 0;
    this.isedit = true
    this.newcoupon._id = coupon._id,
      this.newcoupon.couponcode = coupon.couponcode,
      this.newcoupon.numberofuse = coupon.numberofuse,
      this.newcoupon.expirydate = new Date(coupon.expirydate),
      this.newcoupon.forfirsttime = coupon.forfirsttime,
      this.newcoupon.type = coupon.type,
      this.newcoupon.minimumbal = coupon.minimumbal,
      this.newcoupon.price = coupon.price,
      this.newcoupon.isexpired = coupon.isexpired,
      this.newcoupon.user = coupon.user,
      this.newcoupon.startdate = new Date(coupon.startdate),
      this.newcoupon.prefixcode = coupon.prefixcode,
      this.newcoupon.staffids = coupon.staffid,
      this.newcoupon.month = this.year[this.allMonth.indexOf(coupon.month)],
      this.newcoupon.approve = coupon.approve
    this.staffchange()
  }

  onApprove() {
    this.alertNotificationService.alertCustomMsg('Do you want to approve ' + this.selection.selected.length + ' coupons?')
      .then(result => {
        if (result.isConfirmed) {
          console.log(this.selection.selected)
          var ids = this.selection.selected.map(e => e._id)
          this.CourseService.bulkcouponapprove(ids).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Approved Successfully')
              this.refresh()
              this.selection.clear()
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  staffchange() {
    switch (this.newcoupon.prefixcode) {
      case 'EM':
        this.newcoupon.staffids = this.isedit ? '' : [];
        this.allStaff = [...this.allEmployee];
        break;
      case 'AP':
        this.newcoupon.staffids = this.isedit ? '' : [];
        this.allStaff = [...this.allAP];
        break;
      case 'BA':
        this.newcoupon.staffids = this.isedit ? '' : [];
        this.allStaff = [...this.allBA];
        break;
      case 'SP':
        this.newcoupon.staffids = this.isedit ? '' : [];
        this.allStaff = [...this.allAdmin];
        break;
      case 'IN':
        this.newcoupon.staffids = this.isedit ? '' : [];
        this.allStaff = [...this.allInstructor];
        break;
      default: break;
    }
  }

  gencoupon(coupon, staffid: string) {
    //console.log(coupon,staffid)
    var type = coupon.type == 'fixed' ? 'F' : 'P'
    var id = ''
    switch (coupon.prefixcode) {
      case 'SP': id = coupon.prefixcode + (Number(staffid.substring(1)) - 1000); break;
      case 'IN': id = coupon.prefixcode + (Number(staffid.substring(1)) - 1000); break;
      default: id = staffid; break;
    }
    var code = coupon.month + coupon.year + type + coupon.price + id;
    return code.trim()
  }

  export() {
    this.exportService.exportonesheet('Coupons', this.allcoupons.reverse());
  }

  getPageData() {
    if (this.dataSource)
      return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData)).filter(e => !e.approve);
    return []
  }

  isEntirePageSelected() {
    return this.getPageData().every((row) => this.selection.isSelected(row));
  }

  isAllSelected() {
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.filteredData.length;
      return numSelected === numRows;
    }
    return false
  }

  masterToggle() {
    this.isEntirePageSelected() ?
      this.selection.deselect(...this.getPageData()) :
      this.selection.select(...this.getPageData());
  }


  checkboxLabel(row?, i?): string {
    if (!row) {
      return `${this.isEntirePageSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${i}`;
  }

  StaffSearchFn(term: string, item: User) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

}