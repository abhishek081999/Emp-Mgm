import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Languages } from 'src/app/Enums/staticdata';
import { courseschedule, Course } from 'src/app/model/course.model';
import { RegisterCourse } from 'src/app/model/registercourse.model';
import { Regstucount } from 'src/app/model/regstucount.model';
import { Reviewcount } from 'src/app/model/reviewcount.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { RegisterCourseService } from 'src/app/services/register-course.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  allschedule: courseschedule[];
  languagefilter: any;
  languages = Languages
  constructor(
    private courseservice: courseService,
    private alertNotificationService: AlertNotificationsService,
    private registerCourseService: RegisterCourseService,
    private router: Router,
    private employeeService: EmployeeService
  ) { }

  searchq: String = '';
  imageurl = environment.imageUrl;
  pagefilter: String = '';
  allCourse: Course[] = [];
  allregistercourse: RegisterCourse[];
  studentscount: Regstucount[];
  reviewscount: Reviewcount[];
  alllist = []
  alllistfinal = []

  totalSize: number
  currentPage: number = 1
  pageSize: number = 10

  payload
  ngOnInit() {
    this.payload = this.employeeService.getUserPayload()
    this.refreshlist();
  }

  onDelete(course) {
    if (course.lesson) {
      var id = course._id;
      var insid = course.submittedby
      this.alertNotificationService.alertDelete()
        .then(result => {
          if (result.isConfirmed) {
            this.courseservice.deleteCourse(course._id).toPromise()
              .then(res => {
                if (course.coursetype != "Paid Recorded Class" && course.coursetype != "Free Recorded Class") {
                  var s = this.allschedule.filter(e => e.courseid == id && e.instructorid == insid)[0]
                  if (s) {
                    this.courseservice.deleteSchedule(s._id).toPromise()
                      .then(res => console.log('schedule deleted'))
                      .catch(err => this.alertNotificationService.alertError(err))
                  }
                }

                this.refreshlist();
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    }
  }

  isLoading = false
  async refreshlist() {
    this.isLoading = true
    this.alllist = []
    this.courseservice.getallschedule().toPromise()
      .then(res => this.allschedule = res as courseschedule[])
      .catch(err => this.alertNotificationService.alertError(err))

    await this.courseservice.getAllCourse().toPromise()
      .then(res => {
        this.allCourse = res as Course[];
        this.alllist = [...this.allCourse.reverse()]
        this.totalSize = this.alllist.length
        this.filter()
      }).catch(err => this.alertNotificationService.alertError(err))

    await this.registerCourseService.getstudentscount().toPromise()
      .then(res => this.studentscount = res as Regstucount[])
      .catch(err => this.alertNotificationService.alertError(err))

    await this.courseservice.getreviewscount().toPromise()
      .then(res => this.reviewscount = res as Reviewcount[])
      .catch(err => this.alertNotificationService.alertError(err))

    for (let c of this.allCourse) {
      var r = this.reviewscount.filter((e) => e._id == c.coursecode.split('-')[0])[0]
      if (r) {
        c.rating = r.rating;
        c.numberofrating = r.students
      }
      else {
        c.rating = 0;
        c.numberofrating = 0
      }
      var s = this.studentscount.filter((e) => e._id == c._id)[0]
      if (s)
        c.numberofstudents = s.count
      else
        c.numberofstudents = 0
    }
    this.isLoading = false
  }

  feature = {
    numberofstudents: 0,
    approved: true,
    rating: 0,
    coursecode: ''
  }


  onApprove(c) {
    if (c.lesson) {
      this.feature.coursecode = '';
      if (c.coursecode != '') {
        var count = this.allCourse.filter(e => e.coursecode.startsWith(c.coursecode.toString()) && e.approved == true).length
        count++;
        this.feature.coursecode = c.coursecode.toString() + count;
      }
      //console.log(this.feature)
      this.alertNotificationService.alertApprove()
        .then(result => {
          if (result.isConfirmed) {
            this.courseservice.updateCourseFeature(this.feature, c._id).toPromise()
              .then(res => {
                this.refreshlist()
                this.feature.coursecode = '';
                this.alertNotificationService.toastAlertSuccess('Course Approved Successfully')
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    }
  }



  editCourse(course) {
    if (course.coursetype == 'Paid Recorded Class' || course.coursetype == 'Free Recorded Class') {
      this.router.navigateByUrl('/admin/courses/edit-recorded-course/' + course._id)
    }
    else
      this.router.navigateByUrl('/admin/courses/edit-live-course-calender/' + course._id)
  }

  duplicateCourse(course) {
    if (course.coursetype == 'Paid Recorded Class' || course.coursetype == 'Free Recorded Class') {
      this.router.navigate(['/admin/courses/add-recorded-course'], { queryParams: { code: course._id } })
    }
    else
      this.router.navigate(['/admin/courses/add-live-course-calender'], { queryParams: { code: course._id } })
  }

  duplicateCourse1(course) {
    if (course.coursetype == 'Paid Recorded Class' || course.coursetype == 'Free Recorded Class') {
      this.router.navigate(['/admin/courses/add-recorded-course'], { queryParams: { code: course._id, new: 'batch' } })
    }
    else
      this.router.navigate(['/admin/courses/add-live-course-calender'], { queryParams: { code: course._id, new: 'batch' } })
  }

  filter() {
    this.alllistfinal = [...this.alllist]
    if (this.pagefilter) {
      if (this.pagefilter == "approved") {
        this.alllistfinal = this.alllistfinal.filter(e => e.approved);
      }
      else if (this.pagefilter == "Mycourses") {
        this.alllistfinal = this.alllistfinal.filter(e => e.submittedby == this.payload.profileid);
      }
      else if (this.pagefilter == "Upcoming") {
        this.alllistfinal = this.alllistfinal.filter(e => e.upcoming);
      }
      else {
        this.alllistfinal = this.alllistfinal.filter(e => !e.approved);
      }
    }
    if (this.languagefilter) {
      this.alllistfinal = this.alllistfinal.filter(l => l.courselanguage == this.languagefilter);
    }
    if (this.searchq) {
      this.searchq = this.searchq.toLowerCase()
      this.alllistfinal = this.alllistfinal.filter((e) => e.coursecategory.toString().toLowerCase().indexOf(this.searchq) > -1 || e.coursecode.toLowerCase().indexOf(this.searchq) > -1 || e.coursename.toLowerCase().indexOf(this.searchq) > -1 || e.teachername.toString().toLowerCase().indexOf(this.searchq) > -1 || e.coursetype.toString().toLowerCase().indexOf(this.searchq) > -1 || e.courselanguage.toString().toLowerCase().indexOf(this.searchq) > -1);
    }
    if (this.totalSize != this.alllistfinal.length) {
      this.currentPage = 1
    }
    this.totalSize = this.alllistfinal.length
  }

  pagechange() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }


}
