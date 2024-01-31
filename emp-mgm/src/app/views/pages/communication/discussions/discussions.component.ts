import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Answer } from 'src/app/model/answer.model';
import { Course } from 'src/app/model/course.model';
import { Discussion } from 'src/app/model/discussion.model';
import { Instructor } from 'src/app/model/instructor.model';
import { ProductsDisplay } from 'src/app/model/product.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { DiscussionService } from 'src/app/services/discussion.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { PackageService } from 'src/app/services/package.service';
import { ReplyBoxComponent } from '../reply-box/reply-box.component';

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.scss']
})
export class DiscussionsComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private discussionService: DiscussionService,
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService,
    private courseService: courseService,
    private instructorService: InstructorService,
    private modalService: NgbModal,
    private productService: PackageService
  ) { }



  courses = [];
  alldiscussions: Discussion[];
  discussionsfilter: Discussion[];
  employee: any;
  userid: string;
  isadmin = false;
  isinstructor = false;


  allcourse: Course[] = []
  allproduct: ProductsDisplay[] = []
  allIns: Instructor[] = [];
  pagefilter1: string;
  pagefilter: string;

  totalSize: number
  currentPage: number = 1
  pageSize: number = 20
  filterlist = []

  ngOnInit() {
    this.refresh()
  }
  setint
  ngAfterViewInit() {
    this.setint = setInterval(() => {
      this.refreshDiscussion();
    }, 60000)
  }

  ngOnDestroy() {
    if (this.setint) {
      clearInterval(this.setint);
    }
  }

  refresh() {
    this.employee = this.employeeService.getUserPayload()
    this.userid = this.employee._id

    this.courseService.getAllCourse().toPromise()
      .then(res => {
        this.allcourse = res as Course[]
        this.allcourse = this.allcourse.filter(e => e.approved).reverse();
        this.allcourse.forEach(e => this.filterlist.push({ _id: e._id, code: e.coursecode }))
        this.filterlist = [...this.filterlist]
      }).catch(err => this.alertNotificationService.alertError(err))

    this.productService.getallProduct().toPromise()
      .then(res => {
        this.allproduct = res;
        this.allproduct.forEach(e => this.filterlist.push({ _id: e._id, code: e.productid }))
        this.filterlist = [...this.filterlist]
      }).catch(err => this.alertNotificationService.alertError(err))

    this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.allIns = res as Instructor[];
        this.allIns = this.allIns.filter(e => e.approved).reverse()
      }).catch(err => this.alertNotificationService.alertError(err))

    this.refreshDiscussion();
  }

  delete(dis: Discussion) {
    this.alertNotificationService.alertDelete()
      .then(result => {
        if (result.isConfirmed) {
          this.discussionService.deleteDiscussion(dis._id).toPromise()
            .then(res => this.refreshDiscussion())
            .catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }


  isshown = false;
  refreshingdiscussion = false

  refreshDiscussion() {
    this.refreshingdiscussion = true
    this.discussionService.getAllDiscussion().toPromise()
      .then(res => {
        this.alldiscussions = res as Discussion[];
        this.totalSize = this.alldiscussions.length
        this.courselist();
        this.refreshingdiscussion = false
        this.filter()
      }).catch(err => { this.refreshingdiscussion = false; this.alertNotificationService.alertError(err) })
  }

  courselist() {
    for (var rc of this.alldiscussions) {
      if (!this.courses.includes(rc.coursename)) {
        this.courses.push(rc.coursename);
      }
    }
  }

  getcode(dist: Discussion) {
    var c = ''
    if (dist.courseid) {
      c = this.allcourse.filter(e => e._id == dist.courseid)[0]?.coursecode
    } else if (dist.productid) {
      c = this.allproduct.filter(e => e._id == dist.productid)[0]?.productid
    }
    return c
  }

  export(dis: Discussion) {
    var data = 'Question Title: ' + dis.qtitle;
    data += '\r\nQuestion Description: ' + dis.qdetails;
    data += '\r\nCourse Name: ' + dis.coursename;
    data += '\r\nAsked By: ' + dis.askby + '(' + dis.askbyroll + ')';
    data += '\r\nDate (MM/DD/YYYY): ' + new Date(dis.date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var reply = dis.reply as Answer[];
    for (var r of reply) {
      data += '\r\n[' + new Date(r.date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + '] ' + r.submittedby + ': ' + r.details
    }
    var blob = new Blob([data], { type: 'text/plain' });
    var a = document.createElement('a')
    a.download = dis.coursename + '_' + dis.askbyroll + '.txt';
    a.href = window.URL.createObjectURL(blob);
    a.click()
  }

  getinstructorname(id) {
    return this.allIns.filter(e => e._id == id)[0]?.fullName;
  }
  getinstructorid(id) {
    return this.allIns.filter(e => e._id == id)[0]?.invid;
  }

  filter() {
    this.discussionsfilter = [...this.alldiscussions];
    if (this.pagefilter) {
      this.discussionsfilter = this.discussionsfilter.filter((e) => e.courseid == this.pagefilter || e.productid == this.pagefilter);
    }
    if (this.pagefilter1) {
      this.discussionsfilter = this.discussionsfilter.filter((e) => e.instructor_id && e.instructor_id == this.pagefilter1);
    }
    if (this.totalSize != this.discussionsfilter.length) {
      this.currentPage = 1
    }
    this.totalSize = this.discussionsfilter.length
  }
  data = {
    id: null,
    username: null,
    adminshow: null,
    studentshow: null,
    instructorshow: null,
    email: null
  }

  replyBox(dis: Discussion) {
    dis.adminshow = true;
    var ins = this.allIns.filter(e => e._id == dis.instructor_id)[0]
    var email = ins ? ins.email : ''
    var insshow = dis.instructor_id == this.employee.profileid;
    if (insshow) {
      dis.instructorshow = insshow;
    }
    this.discussionService.updateunreadDiscussion(dis, dis._id).toPromise()
      .then(res => { console.log('Discussion Updated') })
      .catch(err => this.alertNotificationService.alertError(err))

    const modalRef = this.modalService.open(ReplyBoxComponent, { centered: true, scrollable: true, size: 'xl' })
    modalRef.componentInstance.data = {
      id: dis._id,
      username: this.employee.name,
      adminshow: true,
      studentshow: false,
      instructorshow: insshow,
      email: email
    }
  }

  pagechange() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }


}
