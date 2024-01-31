import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Course } from 'src/app/model/course.model';
import { ProductsDisplay } from 'src/app/model/product.model';
import { Review, ReviewDisplay } from 'src/app/model/review.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { ExportService } from 'src/app/services/export.service';
import { PackageService } from 'src/app/services/package.service';


@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  userDetails: any;
  courses: Array<Course> = [];
  reviews: Array<Review> = [];
  allData: Array<ReviewDisplay> = []
  allDatafinal: Array<ReviewDisplay> = []
  today = new Date();
  constructor(
    private alertNotificationService: AlertNotificationsService,
    private courseservice: courseService,
    private exportService: ExportService,
    private modalService: NgbModal,
    private productService: PackageService
  ) { }

  pagefilter: string = '';
  pagefilter1: string = '';
  pagefilter2: string = '';

  totalSize: number
  currentPage: number = 1
  pageSize: number = 20



  ngOnInit() {
    this.refresh()
  }

  isLoading: boolean
  allProduct: ProductsDisplay[] = []
  async refresh() {
    this.isLoading = true
    this.allData = []
    this.allDatafinal = []
    await this.courseservice.getAllCourse().toPromise()
      .then(res => {
        this.courses = res as Course[];
        this.courses.forEach(e => {
          if (e.approved) {
            this.codes.push({ cid: e._id, code: e.coursecode, pid: '' })
          }
        })
        this.codes = [...this.codes]
      })
      .catch(err => this.alertNotificationService.alertError(err))

    await this.courseservice.getallreviews().toPromise()
      .then(res => this.allData = res as ReviewDisplay[])
      .catch(err => this.alertNotificationService.alertError(err))

    await this.productService.getallProduct().toPromise()
      .then(res => {
        this.allProduct = res;
        this.allProduct.forEach(e => {
          if (e.approve) {
            this.codes.push({ cid: '', pid: e._id, code: e.productid })
          }
        })
        this.codes = [...this.codes]
        this.isLoading = false
        this.filter()
      }).catch(err => this.alertNotificationService.alertError(err))

    this.totalSize = this.allData.length
    this.filter()
    this.isLoading = false
  }

  approve(id) {
    this.alertNotificationService.alertApprove()
      .then(result => {
        if (result.isConfirmed) {
          this.courseservice.approvereview(id).toPromise()
            .then(res => {
              this.refresh()
              this.alertNotificationService.toastAlertSuccess('Review Approved')
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }
  modalRef: NgbModalRef
  addreview(content) {
    this.modalRef = this.modalService.open(content, { centered: true, size: 'lg' })
    this.modalRef.result.then(res => this.refresh())
  }

  print() {
    this.exportService.exportonesheet('Course Review', this.allData)
  }

  delete(id) {
    this.alertNotificationService.alertDelete()
      .then(result => {
        if (result.isConfirmed) {
          this.courseservice.deletereview(id).toPromise()
            .then(res => {
              this.refresh()
              this.alertNotificationService.toastAlertSuccess('Review Deleted')
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  filter() {

    this.allDatafinal = [...this.allData]

    if (this.pagefilter1 == '34') {
      this.allDatafinal = this.allDatafinal.filter((e) => e.teacherrating >= 3 && e.teacherrating <= 4);
    } else if (this.pagefilter1 == '3') {
      this.allDatafinal = this.allDatafinal.filter((e) => e.teacherrating < 3);
    } else if (this.pagefilter1 == '4'){
      this.allDatafinal = this.allDatafinal.filter((e) => e.teacherrating > 4);
    }

    if (this.pagefilter2 == '34') {
      this.allDatafinal = this.allDatafinal.filter((e) => e.rating >= 3 && e.rating <= 4);
    } else if (this.pagefilter2 == '3') {
      this.allDatafinal = this.allDatafinal.filter((e) => e.rating < 3);
    } else if (this.pagefilter2 == '4') {
      this.allDatafinal = this.allDatafinal.filter((e) => e.rating > 4);
    }

    if (this.pagefilter) {
      this.pagefilter = this.pagefilter.toLowerCase()
      this.allDatafinal = this.allDatafinal.filter((e) => ((e.code && e.code.toLowerCase().indexOf(this.pagefilter) > -1) || (e.name && e.name.toLowerCase().indexOf(this.pagefilter) > -1) || (e.student_name && e.student_name.toLowerCase().indexOf(this.pagefilter) > -1) || (e.student_invid && e.student_invid.toLowerCase().indexOf(this.pagefilter) > -1)))
    }


    if (this.totalSize != this.allDatafinal.length) {
      this.currentPage = 1
    }
    this.totalSize = this.allDatafinal.length
  }

  pagechange() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  codes = []
  review: Review = {
    _id: '',
    courseid: '',
    name: '',
    registrationid: '',
    studentid: '',
    rating: 0,
    review: '',
    teacherrating: 0,
    date: this.today,
    verified: false,
    coursecode: '',
    productid: ''
  };

  feedback: string = '';
  reviewname: string = '';
  reviewcoursecode;
  sturating: number = 0
  tearating: number = 0

  onSubmit(f: NgForm) {
    this.review.review = this.feedback.toString();
    this.review.name = this.reviewname;
    this.review.coursecode = this.reviewcoursecode.code;
    this.review.rating = this.sturating
    this.review.teacherrating = this.tearating
    this.review.courseid = this.reviewcoursecode.cid;
    this.review.productid = this.reviewcoursecode.pid;
    this.post(f)
  }

  post(f: NgForm) {
    this.alertNotificationService.alertCustomMsg('Do You Want to Submit?')
      .then(result => {
        if (result.isConfirmed) {
          this.courseservice.addcoursereview(this.review).toPromise()
            .then(res => {
              f.resetForm()
              this.alertNotificationService.toastAlertSuccess('Review Added Successfully')
              this.modalRef.close('Saved')
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

}
