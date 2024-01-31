import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AttendanceSettings } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { AttendanceService } from 'src/app/services/attendance.service';


@Component({
  selector: 'app-attendancesettings',
  templateUrl: './attendancesettings.component.html',
  styleUrls: ['./attendancesettings.component.scss']
})
export class AttendancesettingsComponent implements OnInit {


  attendancesettings: AttendanceSettings = {
    regularize_limit: 0,
    last_day_regularize: 0,
  }
  isedit = false;
  constructor(
    private attendanceService: AttendanceService,
    private alertNotificationService: AlertNotificationsService,
  ) { }
  ngOnInit() {
    this.refresh();
  }

  async refresh() {
    await this.attendanceService.getAttendancesettingslist().toPromise()
      .then(res => {
        this.attendancesettings.regularize_limit = res['regularize_limit'] ? Number(res['regularize_limit']) : 0;
        this.attendancesettings.last_day_regularize = res['last_day_regularize'] ? Number(res['last_day_regularize']) : 1;
      }).catch(err => this.alertNotificationService.alertError(err));

  }
  submitForm(e: NgForm) {
    if (this.attendancesettings.last_day_regularize < 1 || this.attendancesettings.last_day_regularize > 15){
      this.alertNotificationService.alertInfo("Last Regularize Day must be between 1 to 15");
      return;
    }
    this.alertNotificationService.alertChanges()
    .then(result=>{
      if(result.isConfirmed){
        this.attendanceService.postAttendancesettings(this.attendancesettings).toPromise()
          .then(res => {
            this.alertNotificationService.toastAlertSuccess('Attendance Settings Modified Succesfully');
            e.resetForm();
            this.refresh();
          }).catch(err => this.alertNotificationService.alertError(err))
      }
    })
  }

}
