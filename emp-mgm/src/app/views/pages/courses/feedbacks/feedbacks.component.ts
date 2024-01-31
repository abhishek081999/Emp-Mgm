import { Component, OnInit } from '@angular/core';
import { Feedback } from 'src/app/model/feedback.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss']
})
export class FeedbacksComponent implements OnInit {

  today = new Date();

  constructor(
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    private feedbackService: FeedbackService,
    private employeeService: EmployeeService,
    ) { }

  allfeedback: Array<Feedback> = []
  allfeedbackfinal: Array<Feedback> = []
  payload;
  pagefilter: string = '';
  pagefilter1: string = '';
  ngOnInit() {
    this.payload = this.employeeService.getUserPayload()
    this.refresh()
  }

  isLoading: boolean
  totalSize: number
  currentPage: number = 1
  pageSize: number = 10

  async refresh() {
    this.isLoading = true
    await this.feedbackService.getAllfeedback().toPromise()
      .then(res => {
        this.allfeedback = res as Feedback[]
        this.filter()
      }).catch(err => this.alertNotificationService.alertError(err))
    this.isLoading = false
  }

  getans(i) {
    switch (i) {
      case "1": return "Below Average";
      case "2": return "Average";
      case "3": return "Good";
      case "4": return "Very Good";
      case "5": return "Excellent";
    }
  }


  approve(f: Feedback) {
    if (!f.instructorid) {
      this.alertNotificationService.alertInfo('Select Instructor')
      return;
    }
    this.alertNotificationService.alertCustomMsg('Do you want to send this feedback to instructor')
      .then(result => {
        if (result.isConfirmed) {
          f.sendtoinstructor = true;
          f.adminshow = true
          this.feedbackService.updateFeedback(f).toPromise()
            .then(res => this.alertNotificationService.toastAlertSuccess('Successfully send to instructor'))
            .catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }


  print() {
    this.exportService.exportonesheet('Course Feedback', this.allfeedback)
  }

  filter() {
    this.allfeedbackfinal = [...this.allfeedback]
    if (this.pagefilter) {
      this.allfeedbackfinal = this.allfeedbackfinal.filter((e) => (e.CourseCode && e.CourseCode.toLowerCase().indexOf(this.pagefilter) > -1) || (e.CourseName && e.CourseName.toLowerCase().indexOf(this.pagefilter) > -1) || (e.InstructorName && e.InstructorName.toLowerCase().indexOf(this.pagefilter) > -1) || (e.InstructorInvID && e.InstructorInvID.toLowerCase().indexOf(this.pagefilter) > -1) || (e.StudentName && e.StudentName.toLowerCase().indexOf(this.pagefilter) > -1) || (e.StudentInvID && e.StudentInvID.toLowerCase().indexOf(this.pagefilter) > -1))
    }
    if (this.pagefilter1) {
      if (this.pagefilter1 == '34')
        this.allfeedbackfinal = this.allfeedbackfinal.filter((e) => e.avgrating >= 3 && e.avgrating <= 4);
      else if (this.pagefilter1 == '3')
        this.allfeedbackfinal = this.allfeedbackfinal.filter((e) => e.avgrating < 3);
      else
        this.allfeedbackfinal = this.allfeedbackfinal.filter((e) => e.avgrating > 4);
    }
    if (this.totalSize != this.allfeedbackfinal.length) {
      this.currentPage = 1
    }
    this.totalSize = this.allfeedbackfinal.length
  }

  pagechange() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

}
