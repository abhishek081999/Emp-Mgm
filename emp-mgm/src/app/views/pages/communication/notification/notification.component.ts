import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Course } from 'src/app/model/course.model';
import { Notifications } from 'src/app/model/notifications.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  today = new Date(); 
  progressvalue: number;
  serverErrorMessages: any;
  searchq
  constructor(
    private notificationService: NotificationService,
    private courseService: courseService,
    private alertNotificationService: AlertNotificationsService) { }

  allnotification: Array<Notifications> = []
  notification: Notifications = {
    title: null,
    desc: null,
    img: "",
    for: null,
    url: ""
  };
  filesToUpload: File;
  fd = new FormData();
  allcourse: Course[] = []
  coursecodes = [
    {
      id: 'all',
      date: null
    },{
      id: 'playstore',
      date: null
    }]

  totalSize: number
  currentPage: number = 1
  pageSize: number = 20
  isLoading: boolean

  ngOnInit() {
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
      }).catch(err => this.alertNotificationService.alertError(err))
    this.refreshList();
  }

  imagechange = false


  handelFileInput(event) {
    this.imagechange = true
    this.filesToUpload = <File>event.target.files[0];
  }


  postnotification(notificationForm: NgForm) {
    this.alertNotificationService.alertCustomMsg("Are You sure to proceed furthur?")
      .then(result => {
        if (result.isConfirmed) {
          this.fd = new FormData();
          if (this.imagechange) {
            this.fd.append("file", this.filesToUpload, this.filesToUpload['name']);
          }
          this.fd.append("title", this.notification.title)
          this.fd.append("desc", this.notification.desc)
          this.fd.append("for", this.notification.for)
          this.fd.append("url", this.notification.url)
          this.notificationService.postNotification(this.fd).toPromise()
            .then(res => {
              notificationForm.resetForm()
              this.alertNotificationService.toastAlertSuccess("Submitted Successfully");
              this.refreshList();
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  filteredData: Notifications[] = []
  filter() {
    if (this.searchq) {
      this.filteredData = this.allnotification.filter(e =>
        e.for.toLowerCase().includes(this.searchq.toLowerCase()) ||
        e.desc.toLowerCase().includes(this.searchq.toLowerCase()) ||
        e.title.toLowerCase().includes(this.searchq.toLowerCase()))
    } else {
      this.filteredData = [...this.allnotification]
    }
    if (this.totalSize != this.filteredData.length) {
      this.currentPage = 1
    }
    this.totalSize = this.filteredData.length
  }

  clearform() {
    this.notification.title = "";
    this.notification.desc = "";
    this.notification.for = ""
    this.notification.img = "";
    this.notification._id = "";
    this.notification.approved = false
  }

  refreshList() {
    this.isLoading = true
    this.notificationService.getAllNotification().toPromise()
      .then(res => {
        this.allnotification = res as Notifications[];
        this.totalSize = this.allnotification.length;
        this.filter()
        this.isLoading = false
      }).catch(err => { this.isLoading = false; this.alertNotificationService.alertError(err) })
  }

  onDelete(id) {
    this.alertNotificationService.alertDelete()
      .then(result => {
        if (result.isConfirmed) {
          this.notificationService.deleteNotification(id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Deleted Successfully.")
              this.refreshList();
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  async onApprove(noti: Notifications) {
    this.alertNotificationService.alertApprove()
      .then(result => {
        if (result.isConfirmed) {
          noti.approved = true
          this.notificationService.approveNotification(noti._id).toPromise()
            .then(res => {
              this.refreshList()
              this.alertNotificationService.toastAlertSuccess("Approved Successfully.")
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  pagechange() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

}
