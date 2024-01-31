import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Leave, Policy, Regularize } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import * as moment from 'moment';
import { courseService } from 'src/app/services/course.service';
import { Holiday } from 'src/app/model/course.model';
import { jsDateToNgbDate, ngbDateIsSunday, ngbDateToJsDate } from 'src/app/utility/dateUtility';
import { EmployeeService } from 'src/app/services/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leave-date-picker',
  templateUrl: './leave-date-picker.component.html',
  styleUrls: ['./leave-date-picker.component.scss']
})
export class LeaveDatePickerComponent implements OnInit {

  leave: Leave = {
    fromDate: null,
    toDate: null,
    reason: '',
    leaveType: '',
    is_half_day: false,
    leave_half: ''
  }
  imagechange2 = false
  filesToUpload2: File;
  myLeavePolicy: Policy[] = []; //  Using in html item dropdown
  selectedLeavePolicy = new Policy() // Using item dropdown temp ngMOdel for get the value in below funtion  [modal leavetype is a string type that's why use any type]
  holidayDates = [];
  halfdayDrop = [
    "First",
    "Second"
  ]
  supportingDocReq = false
  constructor(calendar: NgbCalendar, private config: NgbDatepickerConfig,
    private attendanceService: AttendanceService,
    private alertNotificationService: AlertNotificationsService,
    private CourseService: courseService,
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  allholiday: Holiday[]
  markDisabled;
  payload;
  hoveredDate: NgbDate | null = null;
  minDate: NgbDateStruct
  fromDate: NgbDate;

  toDate: NgbDate | null = null;

  // view only date picker
  startDate = null
  endDate = null
  leaveBalance = []
  myLeaverequest: Leave[] = [];
  myLeaves = []
  async ngOnInit() {
    this.payload = this.employeeService.getUserPayload();
    this.refresh();
  }
  async refresh() {
    // await this.attendanceService.getPolicylist().toPromise()
    //   .then(res => {
    //     this.leaveType = res;
    //     this.leaveType = this.leaveType.filter(e => e.is_active);
    //   }).catch(err => this.alertNotificationService.alertError(err));

    await this.attendanceService.getMyPolicylist(this.payload._id).toPromise()
      .then(res => {
        this.myLeavePolicy = res;
        for (const i of this.myLeavePolicy) {
          this.leaveBalance.push({
            type: i.policy_name,
            balance: i.current_balance
          });
        }
      }).catch(err => this.alertNotificationService.alertError(err));

    this.attendanceService.getLeaverequest(null, null, null, null, [this.payload._id], null, null).toPromise()
      .then(res => {
        this.myLeaverequest = res
        this.myLeaverequest = this.myLeaverequest.filter(r => !r.isRejectHr || !r.isRejectManager);  //this will filter the approve leaves

        for (const leave of this.myLeaverequest) {
          let from = new Date(leave.fromDate).getTime();
          let to = new Date(leave.toDate).getTime();
          for (let time = from; time <= to; time += (24 * 60 * 60 * 1000)) //add one day
          {
            let date = new Date(time);
            this.myLeaves.push(jsDateToNgbDate(date));
          }
        }
        console.log(this.myLeaves)
      }).catch(err => this.alertNotificationService.alertError(err))

    await this.CourseService.getHoliday().toPromise()
      .then(res => {
        this.allholiday = res as Holiday[];
        this.holidayDates = this.allholiday.filter(e => e.date && e.type == HolidayTypeEnum.Company_Holiday).map(e => e.date);
      }).catch(err => this.alertNotificationService.alertError(err))
  }
  isLeavePolicySelected = false
  onLeaveTypeChange() {
    if (this.selectedLeavePolicy) {
      this.applyLeavePolicy();
      this.isLeavePolicySelected = true;
    } else {
      this.isLeavePolicySelected = false;
    }
  }

  applyLeavePolicy() {
    const today = new Date();
    if (Number(this.selectedLeavePolicy.apply_before_days) > 0) {
      const minDate = moment().add(Number(this.selectedLeavePolicy.apply_before_days), 'days').toDate();
      this.minDate = jsDateToNgbDate(minDate);
    }
    else if (Number(this.selectedLeavePolicy.apply_before_days) < 0) {
      const minDate = moment().subtract(Math.abs(Number(this.selectedLeavePolicy.apply_before_days)), 'days').toDate();
      this.minDate = jsDateToNgbDate(minDate);
    }
    else {
      this.minDate = jsDateToNgbDate(today);
    }
    const convertedDates: NgbDateStruct[] = this.holidayDates.map(date => {
      return jsDateToNgbDate(new Date(date))
    });

    if (this.selectedLeavePolicy.is_holiday_excluded && this.selectedLeavePolicy.is_weekend_excluded) {
      this.markDisabled = this.config.markDisabled = (date: NgbDateStruct) => {
        return (ngbDateIsSunday(date) || this.myLeaves.some(disabledDate =>
          disabledDate.year === date.year &&
          disabledDate.month === date.month &&
          disabledDate.day === date.day
        ) ||
          convertedDates.some(disabledDate =>
            disabledDate.year === date.year &&
            disabledDate.month === date.month &&
            disabledDate.day === date.day
          )
        );
      };
    }
    else if (!this.selectedLeavePolicy.is_holiday_excluded && this.selectedLeavePolicy.is_weekend_excluded) {
      this.markDisabled = this.config.markDisabled = (date: NgbDateStruct) => {
        return (ngbDateIsSunday(date)) || this.myLeaves.some(disabledDate =>
          disabledDate.year === date.year &&
          disabledDate.month === date.month &&
          disabledDate.day === date.day
        );
      };
    }
    else if (this.selectedLeavePolicy.is_holiday_excluded && !this.selectedLeavePolicy.is_weekend_excluded) {
      this.markDisabled = this.config.markDisabled = (date: NgbDateStruct) => {
        return (
          convertedDates.some(disabledDate =>
            disabledDate.year === date.year &&
            disabledDate.month === date.month &&
            disabledDate.day === date.day
          ) || this.myLeaves.some(disabledDate =>
            disabledDate.year === date.year &&
            disabledDate.month === date.month &&
            disabledDate.day === date.day
          )
        );
      };
    }
    this.resetDates();
  }

  datesSelected: NgbDateStruct[] = [];
  fd = new FormData();

  addRangeDate(fromDate: NgbDateStruct, toDate: NgbDateStruct) {
    //We get the getTime() of the dates from and to
    let from = new Date(fromDate.year + "-" + fromDate.month + "-" + fromDate.day).getTime();
    let to = new Date(toDate.year + "-" + toDate.month + "-" + toDate.day).getTime();
    for (let time = from; time <= to; time += (24 * 60 * 60 * 1000)) //add one day
    {
      let date = new Date(time);
      //javascript getMonth give 0 to January, 1, to February...
      this.addDate({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() });
    }
    // this.datesSelectedChange.emit(this.datesSelected);
  }
  addDate(date: NgbDateStruct) {
    let index = this.datesSelected.findIndex(f => f.day == date.day && f.month == date.month && f.year == date.year);
    if (index >= 0)       //If exist, remove the date
      this.datesSelected.splice(index, 1);
    else   //a simple push
      this.datesSelected.push(date);

  }
  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  isSameDate(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  handelLeaveFile(event) {
    const file = event.target.files[0];
    const allowedFormats = ['application/zip', 'application/x-zip-compressed'];

    if (file && allowedFormats.includes(file.type)) {
      this.imagechange2 = true;
      this.filesToUpload2 = <File>event.target.files[0];
    } else {
      // Invalid file format, clear the file input
      this.filesToUpload2 = null;
      this.imagechange2 = false;
      // Invalid file format, handle the error or show a message to the user
      this.alertNotificationService.alertError('Invalid file format. Please select a ZIP file.');
      return;
    }
  }

  resetDates() {
    this.toDate = null;
    this.endDate = null;
    this.fromDate = null;
    this.startDate = null;
    this.datesSelected = [];
  }

  onDateSelection(date: NgbDate) {
    this.datesSelected = [];
    if (!this.isLeavePolicySelected) {
      this.alertNotificationService.alertInfo('Select Leave Type')
      return;
    }
    if (this.leave.is_half_day) {
      this.fromDate = date;
      this.toDate = date;
      this.startDate = moment(ngbDateToJsDate(this.fromDate)).format('YYYY-MM-DD');
      this.endDate = moment(ngbDateToJsDate(this.toDate)).format('YYYY-MM-DD');
      this.addDate(date);
      if (Number(this.selectedLeavePolicy.current_balance) < 0.5) {
        this.resetDates();
        this.alertNotificationService.alertError('You have insufficient leave balance');
        return;
      }
    } else {
      if (!this.fromDate && !this.toDate) {
        this.fromDate = date;
        this.startDate = moment(ngbDateToJsDate(this.fromDate)).format('YYYY-MM-DD');
      } else if (this.fromDate && !this.toDate && (date.after(this.fromDate) || date.equals(this.fromDate))) {
        this.toDate = date;
        this.endDate = moment(ngbDateToJsDate(this.toDate)).format('YYYY-MM-DD');
        let calculatedLeaveDays = [];
        this.addRangeDate(this.fromDate, this.toDate);
        if (this.datesSelected.length > 0) {
          // Convert holiday dates to an array of JavaScript Date objects
          const holidayDates = this.holidayDates.map(date => new Date(date));
          // Filter out Sundays and holidays from the array
          calculatedLeaveDays = this.datesSelected.filter(date => {
            const jsDate = ngbDateToJsDate(date); // Create a JavaScript Date object
            // Check if it's a Sunday or a holiday
            if (this.selectedLeavePolicy.is_weekend_excluded && this.selectedLeavePolicy.is_holiday_excluded) {
              return jsDate.getDay() !== 0 && !holidayDates.some(holiday => moment(holiday).isSame(jsDate, 'date'));
            } else if (this.selectedLeavePolicy.is_weekend_excluded && !this.selectedLeavePolicy.is_holiday_excluded) {
              return jsDate.getDay() !== 0; // Filter out Sundays (where Sunday is represented by 0)
            } else if (!this.selectedLeavePolicy.is_weekend_excluded && this.selectedLeavePolicy.is_holiday_excluded) {
              return holidayDates.some(holiday => moment(holiday).isSame(jsDate, 'date'));
            } else if (!this.selectedLeavePolicy.is_weekend_excluded && !this.selectedLeavePolicy.is_holiday_excluded) {
              return true
            }
          });
          if (Number(this.selectedLeavePolicy.max_consecutive) > 0) {
            if (calculatedLeaveDays.length > Number(this.selectedLeavePolicy.max_consecutive)) {
              this.toDate = null;
              this.endDate = null;
              this.datesSelected = [];
              this.alertNotificationService.alertError(`You can select maximum ${this.selectedLeavePolicy.max_consecutive} Consecutive days`);
              return;
            }
          }
          if (calculatedLeaveDays.length > Number(this.selectedLeavePolicy.current_balance)) {
            this.resetDates()
            this.alertNotificationService.alertError('You have insufficient leave balance');
            return;
          }
          if (this.selectedLeavePolicy.supporting_document_required && calculatedLeaveDays.length >= Number(this.selectedLeavePolicy.min_days_for_supporting_doc)) {
            this.supportingDocReq = true
          } else {
            this.supportingDocReq = false
          }
        }
      } else {
        this.endDate = null;
        this.toDate = null;
        this.fromDate = date;
        this.startDate = moment(ngbDateToJsDate(this.fromDate)).format('YYYY-MM-DD');
      }
    }

  }


  submitLeave() {
    if (this.datesSelected.length == 0) {
      this.alertNotificationService.alertInfo(`Please select start date and end date`);
      return
    }
    let calculatedDaysCount = 0;
    let calculatedLeaveDays = [];
    if (this.datesSelected.length > 0) {
      // Convert holiday dates to an array of JavaScript Date objects
      const holidayDates = this.holidayDates.map(date => new Date(date));

      // Filter out Sundays and holidays from the array
      calculatedLeaveDays = this.datesSelected.filter(date => {
        const jsDate = new Date(date.year, date.month - 1, date.day); // Create a JavaScript Date object

        // return jsDate.getDay() !== 0; // Filter out Sundays (where Sunday is represented by 0)

        // Check if it's a Sunday or a holiday
        if (this.selectedLeavePolicy.is_weekend_excluded && this.selectedLeavePolicy.is_holiday_excluded) {
          return jsDate.getDay() !== 0 && !holidayDates.some(holiday => this.isSameDate(holiday, jsDate));
        }
        else if (this.selectedLeavePolicy.is_weekend_excluded && !this.selectedLeavePolicy.is_holiday_excluded) {
          return jsDate.getDay() !== 0; // Filter out Sundays (where Sunday is represented by 0)
        }
        else if (!this.selectedLeavePolicy.is_weekend_excluded && this.selectedLeavePolicy.is_holiday_excluded) {
          return holidayDates.some(holiday => this.isSameDate(holiday, jsDate));
        } else if (!this.selectedLeavePolicy.is_weekend_excluded && !this.selectedLeavePolicy.is_holiday_excluded) {
          return true
        }
      });
      if (this.leave.is_half_day) {
        calculatedDaysCount = 0.5;
      } else {
        calculatedDaysCount = calculatedLeaveDays.length
      }
      if (Number(this.selectedLeavePolicy.max_consecutive) > 0) {
        if (calculatedDaysCount > Number(this.selectedLeavePolicy.max_consecutive)) {
          this.toDate = null;
          this.endDate = null;
          this.datesSelected = [];
          this.alertNotificationService.alertError(`You can select maximum ${this.selectedLeavePolicy.max_consecutive} Consecutive days`);
          return;
        }
      }
      if (calculatedDaysCount > Number(this.selectedLeavePolicy.current_balance)) {
        this.resetDates()
        this.alertNotificationService.alertError('You have insufficient leave balance');
        return;
      }
      if (this.selectedLeavePolicy.supporting_document_required && calculatedDaysCount >= Number(this.selectedLeavePolicy.min_days_for_supporting_doc)) {
        this.supportingDocReq = true
        if (!this.imagechange2) {
          this.alertNotificationService.alertInfo('Please Upload all supporting document in zip format');
          return
        }
      } else {
        this.supportingDocReq = false
      }
    }
    this.alertNotificationService.alertCustomMsg('Are you sure you want to apply leave?')
      .then(result => {
        if (result.isConfirmed) {
          this.fd = new FormData();
          if (this.leave.is_half_day) {
            this.leave.days_count = 0.5;
          }
          else {
            this.leave.days_count = calculatedLeaveDays.length;
          }

          if (this.imagechange2) {
            this.fd.append("file", this.filesToUpload2, this.filesToUpload2['name']);
          }
          this.fd.append("employee_id", this.payload._id)
          this.fd.append("fromDate", ngbDateToJsDate(this.fromDate).toISOString())
          this.fd.append("toDate", ngbDateToJsDate(this.toDate).toISOString())
          this.fd.append("reason", this.leave.reason)
          this.fd.append("leaveType", this.selectedLeavePolicy.leave_type)
          this.fd.append("is_half_day", this.leave.is_half_day.toString());
          this.fd.append("leave_half", this.leave.leave_half ? this.leave.leave_half.toString() : '');
          this.fd.append("days_count", this.leave.days_count.toString());
          this.fd.append("policy_id", this.selectedLeavePolicy._id);

          this.attendanceService.applyForLeave(this.fd).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Leave Applied Succesfully');
              this.datesSelected = [];
              this.fromDate = null;
              this.toDate = null;
              this.startDate = null;
              this.endDate = null;
              this.leave.leaveType = '';
              this.selectedLeavePolicy.leave_type = '';
              this.leave.reason = '';
              this.leave.supportingDocument = null;
              this.filesToUpload2 = null;
              this.imagechange2 = false
              this.router.navigateByUrl('/admin/attendance-and-leave/Requests')
            }).catch(err => this.alertNotificationService.alertError(err));
        }
      })
  }
}
