import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Course } from 'src/app/model/course.model';
import { Lesson } from 'src/app/model/lesson.model';
import { Lessonsection } from 'src/app/model/lessonsection.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit, OnDestroy {

  totalcourse = 0;
  constructor(
    private route: ActivatedRoute,
    private courseservice: courseService,
    private employeeService: EmployeeService,
    private _sanitizer: DomSanitizer,
    private alertNotificationService: AlertNotificationsService,
  ) {
    this.videolink = this._sanitizer.bypassSecurityTrustResourceUrl('');
  }

  ngOnDestroy(): void {
    if (this.pmap)
      this.pmap.unsubscribe()
  }




  code;
  course = new Course();
  courselessons: Array<Lesson> = [];
  videolink;

  payload;
  imageurl = environment.imageUrl;

  pmap: Subscription
  ngOnInit() {
    this.payload = this.employeeService.getUserPayload()
    this.pmap = this.route.paramMap.subscribe(params => {
      this.code = params.get('code');
      this.refresh()
    });
  }

  refresh() {
    this.courseservice.getCoursebycode(this.code).toPromise()
      .then(res => {
        this.course = res as Course;
        this.courselessons = this.course.lesson as Lesson[];
        for (var l of this.courselessons) {
          for (var s of l.section)
            if (s.type != 'Title') {
              this.totalcourse++;
            }
        }
        if (this.course.introvideo)
          this.videolink = this._sanitizer.bypassSecurityTrustResourceUrl(String(this.course.introvideo));
      }).catch(err => this.alertNotificationService.alertError(err))
  }
  setvideo(lesson: Lessonsection) {
    if (lesson.type == "Video") {
      this.videolink = this._sanitizer.bypassSecurityTrustResourceUrl(String(lesson.url));
      document.documentElement.scrollTop = 0;
    }
    if (lesson.type == "Document") {
      var link = document.createElement('a');
      link.href = this.imageurl + lesson.file
      link.download = String(lesson.title);
      link.click();
    }

    if (lesson.type == "Quiz") {
      window.open(lesson.url.toString(), '_blank')
    }

    if (lesson.type == "Webinar") {

      var now = new Date()
      var webinartime = new Date(lesson.start_time)
      var maxtime = new Date(lesson.end_time)
      now.setMinutes(now.getMinutes() + 15)
      webinartime.setMinutes(webinartime.getMinutes() + 15)
      if (now.getTime() >= webinartime.getTime() && now.getTime() <= maxtime.getTime()) {
        // sessionStorage.setItem('usd54a5dsbasd', lesson.url.toString());
        // sessionStorage.setItem('p4ad4sa5d4ad4', lesson.password.toString())
        // sessionStorage.setItem('url', "https://invesmate.com/admin/dashboard")
        // window.open("https://invesmate.com/liveclassteacher?w=" + lesson.url.toString() + '&p=' + btoa(lesson.password.toString() + '.' + this.payload._id), '_blank');
        // window.open(lesson.url, '_blank');
      }
      else if (now > maxtime) {
        this.alertNotificationService.alertInfo('Class Ended')
      }
      else {
        this.alertNotificationService.alertInfo("Class Not Started Yet. You will access it before 15 minutes of start time");
      }
    }

  }

  rating(r): number {
    return Number(r)
  }


}
