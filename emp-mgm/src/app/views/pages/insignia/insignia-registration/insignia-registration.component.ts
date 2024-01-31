import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Course } from 'src/app/model/course.model';
import { Insignia, InsigniaItem, InsigniaRegistrationDisp } from 'src/app/model/insignia.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { ExportService } from 'src/app/services/export.service';
import { InsigniaService } from 'src/app/services/insignia.service';
import { RegisterCourseService } from 'src/app/services/register-course.service';
import { roundOff } from 'src/app/utility/roundOff';

@Component({
  selector: 'app-insignia-registration',
  templateUrl: './insignia-registration.component.html',
  styleUrls: ['./insignia-registration.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class InsigniaRegistrationComponent implements OnInit {

  allRegisteredInsignia: InsigniaRegistrationDisp[] = [];
  allInsignia: Insignia[] = []
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "start date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  codefilter: string = ''
  statusfilter: string = ''
  displayedColumns: string[];
  dataSource: MatTableDataSource<InsigniaRegistrationDisp>;
  startDate: string = null
  endDate: string = null
  expandedElement: InsigniaItem | null;
  batchSource: MatTableDataSource<any>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  allLiveCourse = []
  allAvailableBatch = []
  allRecordedCourse = []
  displayedColumns1 = ['id', 'coursetype', 'coursecode', 'coursename', 'coursestartdate', 'courselanguage', 'teachername', 'registration_count', 'short_code'];
  constructor(
    private insigniaService: InsigniaService,
    private exportService: ExportService,
    private courseservice: courseService,
    private alertNotificationService: AlertNotificationsService,
    private modalService: NgbModal,
    private registerCourseService: RegisterCourseService
  ) { }
  insigniacodes: any[] = []
  allCourse: Course[] = []
  ngOnInit() {
    this.displayedColumns = ['invid', 'student_name', 'phone', 'whatsapp_number', 'telegram_number', 'code', 'name', 'reg_date', 'onboarding_date', 'bookedamount', 'paymentreceived', 'gst', 'due', 'couponcode', 'status'];
    this.refreshlist();
    this.insigniaService.getInsigniaList().toPromise()
      .then(res => {
        this.allInsignia = res;
        var codes = []
        this.allInsignia.forEach(e => {
          if (e.approved) {
            codes.push({ id: e.code })
          }
        })
        this.insigniacodes = this.insigniacodes.concat(codes.reverse())
      }).catch(err => this.alertNotificationService.alertError(err))

    this.courseservice.getAllCourse().toPromise()
      .then(res => {
        this.allCourse = res as Course[];
        this.allRecordedCourse = this.allCourse.filter(e => (e.coursetype == 'Paid Recorded Class' || e.coursetype == 'Free Recorded Class') && e.approved)
        this.allRecordedCourse.forEach(e => {
          this.allAvailableBatch.push({
            _id: e._id,
            coursename: e.coursename,
            coursecode: e.coursecode,
            coursestartdate: e.coursestartdate,
            coursetype: e.coursetype,
            courselanguage: e.courselanguage,
            teachername: e.teachername,
            short_code: e.short_code,
            max_student: e.max_student,
            registration_count: 0
          })
        })
      }).catch(err => this.alertNotificationService.alertError(err))

    var twoMonthOldDate = new Date();
    twoMonthOldDate.setMonth(twoMonthOldDate.getMonth() - 2);
    var oneYearAfterDate = new Date();
    oneYearAfterDate.setFullYear(oneYearAfterDate.getFullYear() + 1);
    this.courseservice.getClassSchedule(twoMonthOldDate, oneYearAfterDate, null, null).toPromise()
      .then(res => {
        this.allLiveCourse = res;
        this.allLiveCourse.forEach(e => {
          this.allAvailableBatch.push({
            _id: e._id,
            coursename: e.course_name,
            coursecode: e.course_code,
            coursestartdate: e.start_date,
            coursetype: e.coursetype,
            courselanguage: e.course_language,
            teachername: e.instructor,
            short_code: e.short_code,
            max_student: e.max_student,
            registration_count: e.registration_count
          })
        })
      }).catch(err => this.alertNotificationService.alertError(err))

  }

  isLoading: boolean
  async refreshlist() {
    this.isLoading = true
    await this.insigniaService.allinsigniaregistrationdisp().toPromise()
      .then(res => {
        this.allRegisteredInsignia = res
        this.isLoading = false
      }).catch(err => this.alertNotificationService.alertError(err));
    this.filter()

  }


  totalbookedamount = 0;
  totaldue = 0;
  totalpaymentreceived = 0;
  totalgst = 0;
  calculateamount() {
    this.totalbookedamount = this.dataSource.filteredData.filter(f => f.bookedamount).map(e => e.bookedamount).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totaldue = this.dataSource.filteredData.filter(f => f.due).map(e => e.due).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalpaymentreceived = this.dataSource.filteredData.filter(f => f.paymentreceived).map(e => e.paymentreceived).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalgst = this.dataSource.filteredData.filter(f => f.gst).map(e => e.gst).reduce((acc, value) => Number(acc) + Number(value), 0)
  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('Insignia Registration', this.dataSource.filteredData)
    }
  }
  displayData: InsigniaRegistrationDisp[] = []
  filter() {
    this.displayData = [...this.allRegisteredInsignia]
    if (this.codefilter) {
      this.displayData = this.displayData.filter(e => e.code == this.codefilter)
    }
    if (this.statusfilter) {
      this.displayData = this.displayData.filter(e => e.status == this.statusfilter)
    }
    if (this.startDate && this.endDate) {
      this.displayData = this.displayData.filter((e) => moment(e.reg_date).isBetween(this.startDate, this.endDate, "days", "[]"))
    } else if (this.startDate || this.endDate) {
      this.displayData = this.displayData.filter((e) => (this.startDate && this.startDate == moment(e.reg_date).format('YYYY-MM-DD')) || (this.endDate && this.endDate == moment(e.reg_date).format('YYYY-MM-DD')))
    }
    this.dataSource = new MatTableDataSource(this.displayData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = this.allRegisteredInsignia.length;
    this.calculateamount()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.calculateamount()
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.batchSource.filter = filterValue.trim().toLowerCase();
  }

  allBatch = []
  batch = new Course();
  bac
  changebatch(reg: InsigniaRegistrationDisp, i, content) {
    this.alertNotificationService.alertCustomMsg("Do you want to change batch of this course?")
      .then(result => {
        if (result.isConfirmed) {
          var currentBatch = this.allCourse.find(e => e.coursecode == i._id);
          if (currentBatch) {
            this.allBatch = this.allAvailableBatch.filter(e => e.short_code == currentBatch.short_code)
          } else {
            this.allBatch = [...this.allAvailableBatch];
          }
          this.batchSource = new MatTableDataSource(this.allBatch);
          this.modalService.open(content, { size: 'xl', centered: true }).result.then((result) => {
            if (result) {
              this.batch = result;
              var data = {
                reg_id: i.reg_id,
                course_id: this.batch._id,
                course_name: this.batch.coursename,
                start_date: this.batch.coursestartdate,
                course_code: this.batch.coursecode,
                ins_reg_id: reg._id
              }
              this.registerCourseService.batchchange(data).toPromise()
                .then(res => {
                  this.batch = new Course();
                  this.alertNotificationService.toastAlertSuccess('Batch Changed')
                  this.refreshlist()
                }).catch(err => this.alertNotificationService.alertError(err))
            }
          }).catch((res) => { this.batch = new Course(); });
        }
      })
  }

  temporaryBanned(reg: InsigniaRegistrationDisp) {
    this.alertNotificationService.alertCustomMsg(`Do you want to ${reg.temporarybanned ? 'ban' : 'active'} this registration?`)
      .then(resp => {
        if (resp.isConfirmed) {
          var data = {
            reg_id: reg._id,
            temporarybanned: reg.temporarybanned
          }
          this.insigniaService.updateTempBanned(data).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Succesfully Updated');
              this.refreshlist();
            }).catch(err => this.alertNotificationService.alertError(err));
        }
        else {
          reg.temporarybanned = !reg.temporarybanned;
        }
      })
  }

  selectbatch(reg: InsigniaRegistrationDisp, b, content) {
    var ins = this.allInsignia.find(e => e._id == reg.insignia_id);
    var item = ins.bundle.find(e => e.id == b.code);
    this.alertNotificationService.alertCustomMsg("Do you want to select batch of this course?")
      .then(result => {
        if (result.isConfirmed) {
          var s = b.code
          console.log(s);
          this.allBatch = this.allAvailableBatch.filter((e) => e.coursecode.startsWith(s)).reverse()
          this.batchSource = new MatTableDataSource(this.allBatch);

          this.modalService.open(content, { size: 'xl', centered: true }).result.then((result) => {
            if (result) {
              this.batch = result;
              var data = {
                courseid: this.batch._id.toString(),
                coursename: this.batch.coursename,
                coursecode: this.batch.coursecode,
                studentid: reg.student_id,
                startingdate: new Date(this.batch.coursestartdate),
                expirydate: new Date(reg.exp_date),
                isexpired: false,
                registrationcost: item.itemPrice,
                products: [],
                productscost: 0,
                temporarybanned: false,
                date: new Date(reg.reg_date),
                coursetype: this.batch.coursetype,
                paymentmode: reg.paymentmode,
                paymentcomplete: reg.payment_complete,
                payments: {
                  firstinsamount: item.itemPrice,
                  firstinsdate: new Date(reg.reg_date),
                  firstinsgst: this.CalculateGST(item.itemPrice)
                },
                invoice: '',
                insignia_id: reg.insignia_id,
                gst: this.CalculateGST(item.itemPrice)
              }
              this.insigniaService.registercoursebatch(data, reg._id).toPromise()
                .then(res => {
                  this.batch = new Course();
                  this.alertNotificationService.toastAlertSuccess('Batch Selected Successfully')
                  this.refreshlist()
                }).catch(err => this.alertNotificationService.alertError(err))
            }
          }).catch((res) => { this.batch = new Course(); });
        }
      })

  }


  CourseSearchFn(term: string, item: Course) {
    term = term.toLowerCase();
    return (item.coursecode && item.coursecode.toLowerCase().indexOf(term) > -1) ||
      (item.coursename && item.coursename.toLowerCase().indexOf(term) > -1) ||
      (item.short_code && item.short_code.toLowerCase().indexOf(term) > -1) ||
      (item.coursestartdate && item.coursestartdate.toString().indexOf(term) > -1);
  }

  isnotregistered(r: InsigniaRegistrationDisp) {
    return r.items.filter(e => e._id).map(e => e._id).length < r.items.length
  }

  CalculateGST(courseprice: number) {
    return roundOff(courseprice - (courseprice / 1.18))
  }

}


