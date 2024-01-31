import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Answerquiz } from 'src/app/model/answerquiz.model';
import { Course } from 'src/app/model/course.model';
import { CourseData } from 'src/app/model/coursedata.model';
import { Instructor } from 'src/app/model/instructor.model';
import { Package } from 'src/app/model/package.model';
import { RegisterCourse } from 'src/app/model/registercourse.model';
import { User } from 'src/app/model/user.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { ExportService } from 'src/app/services/export.service';
import { RegisterCourseService } from 'src/app/services/register-course.service';

@Component({
  selector: 'app-course-registration-list',
  templateUrl: './course-registration-list.component.html',
  styleUrls: ['./course-registration-list.component.scss'],
  providers: [DatePipe]
})
export class CourseRegistrationListComponent implements OnInit {

  allRegisteredCourse: RegisterCourse[];
  allIns: Instructor[];
  allStudents: User[];
  allCourseData: Array<CourseData> = [];
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "start date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  quiz: Array<Answerquiz> = [];
  codefilter: string = ''
  statusfilter: string = ''
  displayedColumns: string[];
  dataSource: MatTableDataSource<CourseData>;
  startDate: string = null
  endDate: string = null

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isinstructor: boolean;
  allPackage: Package[];
  allcourse: Course[]
  constructor(
    private registerdCourseService: RegisterCourseService,
    private exportService: ExportService,
    private alertNotificationService: AlertNotificationsService,
    private courseService: courseService,
    private datePipe: DatePipe,
    private modalService: NgbModal) { }
  coursecodes: any[] = []
  ngOnInit() {
    this.displayedColumns = ['id', 'name', 'phone', 'whatsapp_number', 'telegram_number', 'coursecode', 'coursename', 'coursetype', 'startdate', 'registration_date', 'expiry_date', 'status',
      'insignia', '_id'];
    this.startDate = moment().subtract(3, 'months').startOf('month').format('YYYY-MM-DD')
    this.endDate = moment().endOf('month').format('YYYY-MM-DD')
    this.courseService.getAllCourse().toPromise()
      .then(res => {
        this.allcourse = res as Course[];
        var codes = []
        this.allcourse.forEach(e => {
          if (e.approved) {
            codes.push({ id: e.coursecode, date: e.coursestartdate })
          }
        })
        this.coursecodes = this.coursecodes.concat(codes.reverse())
        this.filter();
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  isLoading: boolean
  totalproductprice: number = 0
  totalbookedamount = 0;
  totaldue = 0;
  totalpaymentreceived = 0;
  totalgst = 0;
  calculateamount() {
    this.totalbookedamount = this.dataSource.filteredData.filter(f => f.bookedamount).map(e => e.bookedamount).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totaldue = this.dataSource.filteredData.filter(f => f.due).map(e => e.due).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalpaymentreceived = this.dataSource.filteredData.filter(f => f.paymentreceived).map(e => e.paymentreceived).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalproductprice = this.dataSource.filteredData.filter(f => f.productsprice).map(e => e.productsprice).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalgst = this.dataSource.filteredData.filter(f => f.gst).map(e => e.gst).reduce((acc, value) => Number(acc) + Number(value), 0)
  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('Course Registration', this.dataSource.filteredData)
    }
  }
  displayData: CourseData[] = []
  filter() {
    this.isLoading = true
    this.registerdCourseService.getCourseRegistrationList(this.startDate, this.endDate, this.codefilter, this.statusfilter).toPromise()
      .then(res => {
        this.displayData = res as any[]
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.displayData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.allCourseData.length;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.calculateamount()
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exp: string = null
  changeexpiry(content, reg) {
    this.alertNotificationService.alertCustomMsg("Do you want to change Expiry date?")
      .then(result => {
        if (result.isConfirmed) {
          if (reg.expiry_date) {
            this.exp = this.datePipe.transform(reg.expiry_date, 'yyyy-MM-dd')
          }
          this.modalService.open(content, { centered: true }).result.then((result) => {
            if (result == 'Save') {
              var data = {
                _id: reg._id,
                expiry_date: this.exp,
              }
              this.registerdCourseService.setExpiry(data).toPromise()
                .then(res => {
                  this.exp = null;
                  this.alertNotificationService.toastAlertSuccess('Expiry Date Changed')
                  this.filter();
                }).catch(err => this.alertNotificationService.alertError(err))
            }
          }).catch((res) => { this.exp = null });
        }
      })
  }

}
