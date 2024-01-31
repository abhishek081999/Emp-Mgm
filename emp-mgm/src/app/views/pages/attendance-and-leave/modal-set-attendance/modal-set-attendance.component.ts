import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { AttendanceType } from 'src/app/Enums/staticdata';
import { Attendence } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-modal-set-attendance',
  templateUrl: './modal-set-attendance.component.html',
  styleUrls: ['./modal-set-attendance.component.scss']
})
export class ModalSetAttendanceComponent implements OnInit {

  attendanceType = [];
  attendance: Attendence = {
    isApprove: false,
    isRegularize: false,
    device: {
      device: '',
      browser: ''
    },
    department: '',
    attendance: null,
    reason: ''
  }
  payload;

  constructor(
    public activeModal: NgbActiveModal,
    private alertNotificationService: AlertNotificationsService,
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService
  ) { }
  customData  // its use for transfer the clicked date via modalcomponent  [imp]
  ClickedDate; //[imp]
  ngOnInit(): void {
    this.payload = this.employeeService.getUserPayload();
    // Access the custom data object passed from the parent component
    const data = this.customData;
    // Retrieve the individual variables from the data object

    this.ClickedDate = data.ClickedDate;
    if (this.ClickedDate) {
      const date = moment(this.ClickedDate).format('YYYY-MM-DD')
      this.attendanceService.checkEmployeePresent(this.payload._id, date).toPromise()
        .then(res => {
          const endOfDay = moment().endOf('day').toDate();
          this.attendanceType = res['attendanceType'];
          if (res['isPresent']) {
            if (new Date(this.ClickedDate).toDateString() == new Date().toDateString()) {
              this.employeeService.createCookie('isAttendanceSubmit', 'true', endOfDay)
            }
          }
        }).catch(err => this.alertNotificationService.alertError(err));
    } else {
      this.attendanceType = AttendanceType;
    }
  }

  close() {
    this.activeModal.close(this.attendance);
  }
}
