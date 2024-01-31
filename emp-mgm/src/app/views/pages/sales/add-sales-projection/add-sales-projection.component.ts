import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { SalesProjectionCommit } from 'src/app/model/salesprojection.model';
import { Employee, Team } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { ExportService } from 'src/app/services/export.service';
import { PackageService } from 'src/app/services/package.service';
import { SellsService } from 'src/app/services/sells.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { roundOff } from 'src/app/utility/roundOff';
import { FullMonths, LeadLanguages } from 'src/app/Enums/staticdata';
import { calcNetAmount } from 'src/app/utility/calcGST';
import { InvesmentorService } from 'src/app/services/invesmentor.service';
import { Invesmentor } from 'src/app/model/invesmentor.model';
import { LeadsService } from 'src/app/services/leads.service';
import { getLeadLevel, leadLevel } from 'src/app/model/leads.model';

@Component({
  selector: 'app-add-sales-projection',
  templateUrl: './add-sales-projection.component.html',
  styleUrls: ['./add-sales-projection.component.scss']
})
export class AddSalesProjectionComponent implements OnInit {
  isLoading: boolean;
  months = FullMonths;
  Year = null
  Month = null
  Staff_ID = null
  years = ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032"];
  allCommits: SalesProjectionCommit[] = []
  servicetype
  selectMonth = ''
  selectYear = ''
  selectStaff = ''
  filterQuery = "";
  rowsOnPage = 5;
  sortBy = "";
  sortOrder = "asc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<SalesProjectionCommit>;
  allCourse = [];
  allEmployee = [];
  // allProduct = [];
  allInsignia = [];
  allInvesmentor: Invesmentor[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selection = new SelectionModel<SalesProjectionCommit>(true, []);
  newProjectionLists: SalesProjectionCommit[] = []
  insigniaSeriesList = [{ name: "Insignia Series 1", price: 15998 },
  { name: "Insignia Series 2", price: 26496 },
  { name: "Insignia Series 3", price: 25997 },
  { name: "Insignia Series 4", price: 35495 },
  { name: "Insignia Series 5", price: 17498 },
  { name: "Insignia Series 6", price: 27496 },
  { name: "Insignia Series 7", price: 25995 },
  { name: "Insignia Series 8", price: 22497 },
  { name: "Insignia Series 9", price: 55416 },
  { name: "Insignia Series 10", price: 68932 },
  { name: "Insignia Personalized", price: 15998 }]

  courseShortCodes = [{ name: 'INTD', price: 5499 },
  { name: 'DRVT', price: 6499 },
  { name: 'FORX', price: 4999 },
  { name: 'FUND', price: 3999 },
  { name: 'CDCR', price: 4499 },
  { name: 'BCMB', price: 4999 },
  { name: 'MUFD', price: 3499 },
  { name: 'NIFT', price: 3499 }];
  errorList = [];
  errMsg = ''
  allTeams: Team[] = []
  constructor(
    private sellsService: SellsService,
    private alertNotificationService: AlertNotificationsService,
    private employeeService: EmployeeService,
    private invesmentorService: InvesmentorService,
    private exportService: ExportService,
    private courseService: courseService,
    private leadService: LeadsService) { }
  allLevel: getLeadLevel[] = [];
  ngOnInit(): void {
    this.displayedColumns = ['select', "Staff_ID", "Month", "ServiceName", "Fees", "Counts", "Booked_Rev", "Net_Payment_Recv", "Payment_Recv", "Admin_Approved", "id"]
    this.employeeService.getAllEmployees('all', Departments.Sales, null).toPromise()
      .then(res => this.allEmployee = res)
      .catch(err => this.alertNotificationService.alertError(err));
    this.employeeService.getAllTeams('display', Departments.Sales).toPromise()
      .then(res => {
        var teams = res[0]['teams'];
        this.allTeams = teams && teams.length > 0 ? teams : [];
      }).catch(err => this.alertNotificationService.alertError(err))
    this.leadService.getLevel().toPromise()
      .then(res => {
        this.allLevel = res as getLeadLevel[];
      }).catch(err => this.alertNotificationService.alertError(err))
    var today = new Date()
    if (today.getDate() > 15) {
      this.Month = this.months[today.getMonth() + 1];
      this.Year = (today.getFullYear() + 1).toString();
    } else {
      this.Month = this.months[today.getMonth()];
      this.Year = (today.getFullYear()).toString();
    }
    this.selectMonth = this.months[today.getMonth()];
    this.selectYear = (today.getFullYear()).toString();
    this.refreshCourse();
    this.refreshInvesmentor();
    this.refresh()
  }

  selectStatus = '';
  teamFilter = null;
  async refresh() {
    this.isLoading = true
    let staff = null
    if(this.teammem && this.teammem.length>0){
      staff = this.teammem;
    }
    if (this.selectStaff) {
      staff = [this.selectStaff];
    }
    await this.sellsService.getCommitProjection(this.selectMonth, this.selectYear, staff, this.selectStatus, this.teamFilter).toPromise()
      .then(res => {
        this.allCommits = res
        this.dataSource = new MatTableDataSource(this.allCommits);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.calculateamount();
      }).catch(err => this.alertNotificationService.alertError(err));
    this.isLoading = false
  }
  Lang
  LeadLevelDrop: leadLevel[] = []
  Level
  alllang = LeadLanguages
  teammem = [];
  onChange() {
    if (this.Lang) {
      this.LeadLevelDrop = [];
      var obj = this.allLevel.find(f => this.Lang == f._id);
      this.LeadLevelDrop = obj ? obj.levels : [];
      if (this.LeadLevelDrop.length == 0) {
        this.Level = null;
      }
    }
    if(this.Lang && this.Level){
      if (Array.isArray(this.Level.employee)){
        this.teammem = this.Level.employee
      }
    }
  }

  refreshCourse() {
    var srtRange = moment(`${this.Month} - ${this.Year}`, 'MMMM - YYYY').add(1, 'days').startOf('month').format('YYYY-MM-DD');
    var toRange = moment(`${this.Month} - ${this.Year}`, 'MMMM - YYYY').add(1, 'days').endOf('month').format('YYYY-MM-DD');
    this.courseService.getClassSchedule(srtRange, toRange, null, null).toPromise()
      .then(res => {
        this.allCourse = res
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  // refreshProduct() {
  //   this.productService.getallProduct().toPromise()
  //     .then(res => {
  //       this.allProduct = res
  //     }).catch(err => this.alertNotificationService.alertError(err))
  // }

  refreshInvesmentor() {
    this.invesmentorService.getInvesmentorList().toPromise()
      .then(res => {
        this.allInvesmentor = res;
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  isAddBasicCourseLive = false;
  addBasicCoursesLive() {
    this.allCourse.forEach(e => {
      if (e.course_level == 'Basic') {
        var projection = new SalesProjectionCommit();
        projection.Fees = e.min_selling_price ? e.min_selling_price : 0;
        projection.Counts = 0;
        projection.Booked_Rev = 0;
        projection.Instructors = e.instructor;
        projection.Payment_Recv = 0;
        projection.ServiceCode = e.course_code;
        projection.ServiceName = e.course_name;
        projection.Service_ID = e._id;
        projection.Start_Day = e.start_date;
        this.newProjectionLists.push(projection);
        this.errorList.push(false);
      }
    })
    this.isAddBasicCourseLive = true;
  }

  isAddAdvanceCourseLive = false
  addAdvanceCoursesLive() {
    this.allCourse.forEach(e => {
      if (e.course_level == 'Advance') {
        var projection = new SalesProjectionCommit();
        projection.Fees = e.min_selling_price ? e.min_selling_price : 0;
        projection.Counts = 0;
        projection.Booked_Rev = 0;
        projection.Instructors = e.instructor;
        projection.Payment_Recv = 0;
        projection.ServiceCode = e.course_code;
        projection.ServiceName = e.course_name;
        projection.Service_ID = e._id;
        projection.Start_Day = e.start_date;
        this.newProjectionLists.push(projection);
        this.errorList.push(false);
      }
    })
    this.isAddAdvanceCourseLive = true;
  }

  isAddCourseRecorded = false;
  addCoursesRecorded() {
    this.courseShortCodes.forEach(e => {
      var projection = new SalesProjectionCommit();
      projection.Fees = e.price ? e.price : 0;
      projection.Counts = 0;
      projection.Booked_Rev = 0;
      projection.Instructors = null;
      projection.Payment_Recv = 0;
      projection.ServiceCode = `Rec ${e.name}`;
      projection.ServiceName = `Rec ${e.name}`;
      projection.Service_ID = null;
      projection.Start_Day = null;
      this.newProjectionLists.push(projection);
      this.errorList.push(false);
    })
    this.isAddCourseRecorded = true
  }

  // isAddProduct = false;
  // addProduct() {
  //   this.allProduct.forEach(e => {
  //     if (e.type != 'Market Research') {
  //       var projection = new SalesProjectionCommit();
  //       projection.Fees = e.min_selling_price ? e.min_selling_price : 0;
  //       projection.Counts = 0;
  //       projection.Booked_Rev = 0;
  //       projection.Instructors = null;
  //       projection.Payment_Recv = 0;
  //       projection.ServiceCode = e.productid;
  //       projection.ServiceName = e.name;
  //       projection.Service_ID = e._id;
  //       projection.Start_Day = null;
  //       this.newProjectionLists.push(projection);
  //       this.errorList.push(false);
  //     }
  //   })
  //   this.isAddProduct = true;
  // }
  // isAddMarketResearch = false;
  // addMarketResearch() {
  //   this.allProduct.forEach(e => {
  //     if (e.type == 'Market Research') {
  //       var projection = new SalesProjectionCommit();
  //       projection.Fees = e.min_selling_price ? e.min_selling_price : 0;
  //       projection.Counts = 0;
  //       projection.Booked_Rev = 0;
  //       projection.Instructors = null;
  //       projection.Payment_Recv = 0;
  //       projection.ServiceCode = e.productid;
  //       projection.ServiceName = e.name;
  //       projection.Service_ID = e._id;
  //       projection.Start_Day = null;
  //       this.newProjectionLists.push(projection);
  //       this.errorList.push(false);
  //     }
  //   })
  //   this.isAddMarketResearch = true;
  // }

  isAddInvesmentor = false;
  addInvesmentor() {
    this.allInvesmentor.forEach(e => {
      if (e.short_code != 'Trial') {
        var projection = new SalesProjectionCommit();
        projection.Fees = e.min_selling_price ? e.min_selling_price : 0;
        projection.Counts = 0;
        projection.Booked_Rev = 0;
        projection.Instructors = null;
        projection.Payment_Recv = 0;
        projection.ServiceCode = e.name;
        projection.ServiceName = e.code;
        projection.Service_ID = e._id;
        projection.Start_Day = null;
        this.newProjectionLists.push(projection);
        this.errorList.push(false);
      }
    })
    this.isAddInvesmentor = true
  }

  isAddInsignia = false;
  addInsignia() {
    this.insigniaSeriesList.forEach(e => {
      var projection = new SalesProjectionCommit();
      projection.Fees = e.price ? e.price : 0;
      projection.Counts = 0;
      projection.Booked_Rev = 0;
      projection.Instructors = null;
      projection.Payment_Recv = 0;
      projection.ServiceCode = e.name;
      projection.ServiceName = e.name;
      projection.Service_ID = null;
      projection.Start_Day = null;
      this.newProjectionLists.push(projection);
      this.errorList.push(false);
    })
    this.isAddInsignia = true;
  }

  isAddOthers = false;
  addOthers() {
    var projection = new SalesProjectionCommit();
    projection.Fees = 0;
    projection.Counts = 0;
    projection.Booked_Rev = 0;
    projection.Instructors = null;
    projection.Payment_Recv = 0;
    projection.ServiceCode = 'Others';
    projection.ServiceName = 'Other Sales';
    projection.Service_ID = null;
    projection.Start_Day = null;
    this.newProjectionLists.push(projection);
    this.errorList.push(false);
    this.isAddOthers = true;
  }

  isAddPendingPayment = false;
  addPendingPayment() {
    var projection = new SalesProjectionCommit();
    projection.Fees = 0;
    projection.Counts = 0;
    projection.Booked_Rev = 0;
    projection.Instructors = null;
    projection.Payment_Recv = 0;
    projection.ServiceCode = 'Pending Payment Collection';
    projection.ServiceName = 'Pending Payment Collection';
    projection.Service_ID = null;
    projection.Start_Day = null;
    this.newProjectionLists.push(projection);
    this.errorList.push(false);
    this.isAddPendingPayment = true;
  }

  removeService(i) {
    this.newProjectionLists.splice(i, 1);
  }

  bookedAmountCalc(p: SalesProjectionCommit) {
    p.Counts = p.Counts ? Number(p.Counts) : 0;
    p.Fees = p.Fees ? Number(p.Fees) : 0;
    p.Booked_Rev = p.Counts * p.Fees;
    p.Payment_Recv = 0;
  }

  validatePaymentReceive(p: SalesProjectionCommit, i) {
    var pay = roundOff(p.Booked_Rev * 0.80);
    if (pay > p.Payment_Recv) {
      this.errorList[i] = true
      this.errMsg = `Payment Receive for ${p.ServiceName} should be greater than 80% of Booking Amount(${pay})`
    }
  }

  submitForm(f: NgForm) {
    this.alertNotificationService.alertCustomMsg('Are you sure you want to Submit?')
      .then(result => {
        if (result.isConfirmed) {
          var projections = [];
          this.newProjectionLists.forEach(e => {
            if (e.Payment_Recv != 0) {
              e.Month = this.Month;
              e.Year = this.Year;
              e.Staff_ID = this.Staff_ID;
              projections.push(e)
            }
          })
          this.sellsService.CommitProjection(projections).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Saved Successfully");
              this.refresh()
              this.cancelEdit(f);
            }).catch(err => this.alertNotificationService.alertError(err));
        }
      })
  }

  isedit = false
  onEdit(row) {
    document.documentElement.scrollTop = 0;
    this.isedit = true
    this.Month = row.Month;
    this.Staff_ID = row.Staff_ID;
    this.Year = row.Year;
    this.newProjectionLists.push(row)
  }

  onApprove() {
    this.alertNotificationService.alertCustomMsg('Do you want to approve ' + this.selection.selected.length + ' rows?')
      .then(result => {
        if (result.isConfirmed) {
          var ids = this.selection.selected.filter(f => !f.Admin_Approved).map(e => e._id)
          if (ids && ids.length > 0) {
            this.sellsService.bulkprojectionapprove(ids).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Approved Successfully')
                this.refresh()
                this.selection.clear()
              }).catch(err => this.alertNotificationService.alertError(err))
          } else {
            this.alertNotificationService.toastAlertSuccess('Approved Successfully')
            this.selection.clear()
          }
        }
      })
  }

  onDelete() {
    this.alertNotificationService.alertCustomMsg('Do you want to delete ' + this.selection.selected.length + ' rows?')
      .then(result => {
        if (result.isConfirmed) {
          var ids = this.selection.selected.map(e => e._id)
          this.sellsService.bulkprojectiondelete(ids).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Deleted Successfully')
              this.refresh()
              this.selection.clear()
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }


  export() {
    var data = this.dataSource.filteredData
    if (data.length > 0) {
      this.exportService.exportonesheet('Sales Projection Report', data);
    }
    else {
      this.alertNotificationService.alertInfo('Sales Projection Report is Empty');
    }
  }

  applyFilter(event: Event) {
    try {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource) {
        this.calculateamount();
      }
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } catch (error) {
      console.log(error)
    }
  }

  getName(id) {
    return this.allEmployee.find(e => e.invid == id)?.fullName;
  }

  getPageData() {
    if (this.dataSource)
      return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
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

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

  cancelEdit(f: NgForm) {
    //f.resetForm();
    this.newProjectionLists = []
    this.Staff_ID = null;
    this.isedit = false;
    var today = new Date()
    if (today.getDate() > 15) {
      this.Month = this.months[today.getMonth() + 1];
      this.Year = (today.getFullYear() + 1).toString();
    } else {
      this.Month = this.months[today.getMonth()];
      this.Year = (today.getFullYear()).toString();
    }
  }

  totalCommit_Counts = 0
  totalFees = 0
  totalCommit_Booked_Rev = 0
  totalCommit_Payment_Recv = 0

  calculateamount() {
    this.totalCommit_Counts = this.dataSource.filteredData.filter(f => f.Counts).map(e => e.Counts).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalFees = this.dataSource.filteredData.filter(f => f.Fees).map(e => e.Fees).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalCommit_Booked_Rev = this.dataSource.filteredData.filter(f => f.Booked_Rev).map(e => e.Booked_Rev).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalCommit_Payment_Recv = this.dataSource.filteredData.filter(f => f.Payment_Recv).map(e => e.Payment_Recv).reduce((acc, value) => Number(acc) + Number(value), 0)
  }

  getNetAmount(num) {
    return calcNetAmount(num);
  }
}
