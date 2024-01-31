import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { AttendanceSettings, Regularize } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { DeviceInfoService } from 'src/app/services/device.info.service';
import { EmployeeService } from 'src/app/services/employee.service';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;
@Component({
  selector: 'app-regularize-attendance-modal',
  templateUrl: './regularize-attendance-modal.component.html',
  styleUrls: ['./regularize-attendance-modal.component.scss']
})
export class RegularizeAttendanceModalComponent implements OnInit {

  activeDates: Date[] = [];
  today = new Date();
  lastRegularizeDay = new Date();
  isLoading = false
  constructor(
    calendar: NgbCalendar,
    private config: NgbDatepickerConfig,
    private attendanceService: AttendanceService,
    private alertNotificationService: AlertNotificationsService,
    private employeeService: EmployeeService,
    public activeModal: NgbActiveModal,
    private deviceDetector: DeviceInfoService

  ) {
    this.lastRegularizeDay = moment().startOf('month').startOf('day').toDate();
    this.deviceInfo = this.deviceDetector.getDeviceInfo();
  }
  deviceInfo
  regularize: Regularize = {
    device: {
      device: '',
      browser: ''
    },
    isApprove: false,
  }
  attendanceSettings: AttendanceSettings = {
    regularize_limit: 0,
    last_day_regularize: 1,
  }
  startDate;
  endDate;

  regularizeStatus = {
    absent: [],
    regularizeCount: [],
    regularizeReq: []
  }
  disabaleDates = []
  attendanceType = [AttendanceTypeEnum.Full_Day_Present];
  userDetails
  regularizeCount = new Map();

  async ngOnInit() {
    this.userDetails = this.employeeService.getUserPayload();
    this.isLoading = true
    await this.attendanceService.getAttendancesettingslist().toPromise()
      .then(res => {
        this.attendanceSettings.regularize_limit = res['regularize_limit'] ? Number(res['regularize_limit']) : 0;
        this.attendanceSettings.last_day_regularize = res['last_day_regularize'] ? Number(res['last_day_regularize']) : 1;
      }).catch(err => this.alertNotificationService.alertError(err));

    if (this.attendanceSettings.last_day_regularize >= 1 && this.attendanceSettings.last_day_regularize <= 15) {
      this.lastRegularizeDay.setDate(this.attendanceSettings.last_day_regularize);
    }
    var minDate = moment().startOf('month').startOf('day').toDate()
    this.minDate = { year: minDate.getFullYear(), month: minDate.getMonth() + 1, day: minDate.getDate() };
    if (this.lastRegularizeDay.getTime() >= this.today.getTime()) {
      minDate = moment().startOf('month').startOf('day').subtract(1, 'month').toDate()
      this.minDate = { year: minDate.getFullYear(), month: minDate.getMonth() + 1, day: minDate.getDate() };
    }

    this.maxDate = { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() - 2 };

    this.startDate = moment(minDate).format('YYYY-MM-DD')
    this.endDate = moment().format('YYYY-MM-DD');
    await this.attendanceService.getEmployeeRegularize(this.userDetails._id, this.startDate, this.endDate).toPromise()
      .then(res => {
        this.regularizeStatus.absent = res['absent'] && res['absent'].length > 0 ? res['absent'] : [];
        this.regularizeStatus.regularizeCount = res['regularizeCount'] && res['regularizeCount'].length > 0 ? res['regularizeCount'] : [];
        this.regularizeStatus.regularizeReq = res['regularizeReq'] && res['regularizeReq'].length > 0 ? res['regularizeReq'] : [];
      }).catch(err => this.alertNotificationService.alertError(err));

    if (this.regularizeStatus.absent.length > 0) {
      this.activeDates.push(...this.regularizeStatus.absent);
    }

    if (this.regularizeStatus.regularizeReq.length > 0) {
      this.disabaleDates.push(...this.regularizeStatus.regularizeReq.filter(e => e.attendance_date && !e.isApprove).map(e => e.attendance_date))
    }

    this.markDisabled = this.config.markDisabled = (date: NgbDateStruct) => {
      const selected = new Date(date.year, date.month - 1, date.day);
      if (selected.getDay() == 0) {
        return true;
      }
      const disable = this.disabaleDates.filter(date => moment(date).isSame(selected, 'date'))
      if (disable.length > 0) {
        return true
      }
      const data = this.activeDates.filter(date => moment(date).isSame(selected, 'date'))
      return !(data.length > 0);
    };
    this.isLoading = false
  }


  isedit = false;
  hoveredDate: NgbDateStruct;
  selectedDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  minDate: NgbDateStruct
  maxDate: NgbDateStruct;
  _datesSelected: NgbDateStruct[] = [];
  markDisabled
  calendar: NgbCalendar

  regularizelimit() {
    this.fromDate = null;
    this.toDate = null;
    this.selectedDate = null;
    console.log(`your regularize limit is ${this.attendanceSettings.regularize_limit}`);
    this.alertNotificationService.alertError(`your regularize limit is ${this.attendanceSettings.regularize_limit}`);
    return
  }
  datesSelected = []
  onDateSelection(event: any, date: NgbDateStruct) {
    var isRemove = false;
    if (this.isDateSelected(date)) {
      isRemove = true
    }
    var count = 0;
    var regularizeCount = this.regularizeStatus.regularizeCount.find(e => e._id == date.month);
    var requestedCount = 0;
    if (regularizeCount && regularizeCount.count) {
      requestedCount = regularizeCount.count;
    }
    if (this.datesSelected.length > 0) {
      if (this.regularizeCount.has(`${date.month}-${date.year}`)) {
        count = this.regularizeCount.get(`${date.month}-${date.year}`)
      }
    }
    if (isRemove) {
      count--;
    } else {
      count++;
    }
    if ((requestedCount + count) > this.attendanceSettings.regularize_limit) {
      this.alertNotificationService.alertError(`You have exceeded your monthly regularize limit(${this.attendanceSettings.regularize_limit})`);
      return;
    }
    event.target.parentElement.blur();  //make that not appear the outline
    this.addDate(date);
  }

  addDate(date: NgbDateStruct) {
    let index = this.datesSelected.findIndex(f => f.day == date.day && f.month == date.month && f.year == date.year);
    if (index >= 0) {
      //If exist, remove the date
      this.datesSelected.splice(index, 1);
      if (this.regularizeCount.has(`${date.month}-${date.year}`)) {
        var count = this.regularizeCount.get(`${date.month}-${date.year}`)
        if (count > 0) { count--; }
        else { count = 0 }
        this.regularizeCount.set(`${date.month}-${date.year}`, count);
      }
    } else {
      //a simple push
      this.datesSelected.push(date);
      if (this.regularizeCount.has(`${date.month}-${date.year}`)) {
        var count = this.regularizeCount.get(`${date.month}-${date.year}`)
        count++;
        this.regularizeCount.set(`${date.month}-${date.year}`, count);
      } else {
        this.regularizeCount.set(`${date.month}-${date.year}`, 1);
      }
    }
  }

  submit() {
    if (this.datesSelected.length == 0) {
      this.alertNotificationService.alertInfo("Please select Dates")
      return
    }
    if (!this.regularize.attendance) {
      this.alertNotificationService.alertInfo("Please select Attendance")
      return
    }
    if (!this.regularize.reason) {
      this.alertNotificationService.alertInfo("Please Add Reason")
      return
    }
    this.alertNotificationService.alertCustomMsg("Are you sure you want submit regularize attendance request?")
      .then(result => {
        if (result.isConfirmed) {
          var device = {
            device: this.deviceInfo.Device,
            browser: this.deviceInfo.Browser,
          }
          const data = [];
          this.datesSelected.forEach(e => {
            data.push({
              attendance_date: new Date(e.year, e.month - 1, e.day),
              employee_id: this.userDetails._id,
              device: device,
              attendance: this.regularize.attendance,
              reason: this.regularize.reason,
            });
          })
          this.attendanceService.postRegularize(data).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Regularize Attendance Request Raised Succesfully');
              this.regularize.attendance = '';
              this.regularize.reason = '';
              this.activeModal.close()
            }).catch(err => this.alertNotificationService.alertError(err));
        }
      }).catch(err => console.log(err))
  }

  //return true if is selected
  isDateSelected(date: NgbDateStruct) {
    return (this.datesSelected.findIndex(f => f.day == date.day && f.month == date.month && f.year == date.year) >= 0);
  }
  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);
  isToday = date => equals(date, this.minDate)
}
