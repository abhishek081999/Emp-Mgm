import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { NgbCalendar, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Attendence, Leave } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { DeviceInfoService } from 'src/app/services/device.info.service';
import { ModalSetAttendanceComponent } from '../modal-set-attendance/modal-set-attendance.component';
import { courseService } from 'src/app/services/course.service';
import { Holiday } from 'src/app/model/course.model';
import { Router } from '@angular/router';
import { RegularizeAttendanceModalComponent } from '../regularize-attendance-modal/regularize-attendance-modal.component';

@Component({
  selector: 'app-attendance-dashboard',
  templateUrl: './attendance-dashboard.component.html',
  styleUrls: ['./attendance-dashboard.component.scss']
})
export class AttendanceDashboardComponent implements OnInit {
  allAttendances: Attendence[] = [];
  attendance = new Attendence();
  isAttendanceSubmit = false;
  deviceInfo: { Device: string; Browser: string; };
  isMobileDevice = false;

  constructor(
    private calendar: NgbCalendar,
    private modalService: NgbModal,
    private alertNotificationService: AlertNotificationsService,
    private attendanceService: AttendanceService,
    private userService: UserService,
    private employeeService: EmployeeService,
    private CourseService: courseService,
    private deviceDetector: DeviceInfoService,
    private router: Router,

  ) {
    this.deviceInfo = this.deviceDetector.getDeviceInfo();
    this.checkIsMobile();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkIsMobile();
  }
  ismobileSize = false
  private checkIsMobile() {
    const screenWidth = window.innerWidth;
    this.ismobileSize = screenWidth < 768; // You can adjust the threshold as needed
  }
  events: EventInput[] = [];
  userDetails;
  calendarPlugins = [dayGridPlugin, listPlugin, interactionPlugin]; // important!
  async ngOnInit() {
    if (this.deviceInfo.Device == "Android" && this.ismobileSize) {
      this.isMobileDevice = true
    }
    this.userDetails = this.userService.getUserPayload()
    const isAttendanceSubmit = this.employeeService.readCookie('isAttendanceSubmit');
    if (isAttendanceSubmit == 'true') {
      this.isAttendanceSubmit = true;
    } else {
      this.attendanceService.checkEmployeePresent(this.userDetails._id).toPromise()
        .then(res => {
          const endOfDay = moment().endOf('day').toDate();
          if (res['isPresent']) {
            this.isAttendanceSubmit = true;
            this.employeeService.createCookie('isAttendanceSubmit', 'true', endOfDay)
          } else {
            this.employeeService.createCookie('isAttendanceSubmit', 'false', endOfDay)
            this.SubmitAttendance();
          }
        }).catch(err => this.alertNotificationService.alertError(err));
    }

    this.refreshEvents()
  }

  checkAttendanceSubmit() {
    const isAttendanceSubmit = this.employeeService.readCookie('isAttendanceSubmit');
    if (isAttendanceSubmit == 'true') {
      return true;
    }
    return false;
  }

  refreshEvents() {
    this.events = [];
    this.getholiday();
    this.fetchAttendance();
    this.fetchLeave();
  }
  attendanceType = [];
  allholiday: Holiday[]
  myLeaverequest: Leave[] = []
  async getholiday() {
    await this.CourseService.getHoliday().toPromise()
      .then(res => {
        this.allholiday = res as Holiday[];
        this.allholiday.forEach(h => {
          if (h.type == HolidayTypeEnum.Company_Holiday) {
            const b = {
              start: moment(h.date).startOf('day').toDate(),
              end: moment(h.date).endOf('day').toDate(),
              title: h.title,
              color: ColorCodesEnum.BLUE,
              _id: '',
              isAttendance: false
            }
            this.events = this.events.concat(b);
          }
        })
      }).catch(err => this.alertNotificationService.alertError(err))
  }
  fetchLeave() {
    this.attendanceService.getLeaverequest(null, null, null, null, [this.userDetails._id], 'Approve', 'Approve').toPromise()
      .then(res => {
        this.myLeaverequest = res
        for (const leave of this.myLeaverequest) {
          const b = {
            start: moment(leave.fromDate).startOf('day').toDate(),
            end: moment(leave.toDate).endOf('day').toDate(),
            title: leave.leaveType,
            color: ColorCodesEnum.VIOLET,
            _id: '',
            isAttendance: false
          }
          this.events = this.events.concat(b);
        }
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  async fetchAttendance() {
    await this.attendanceService.getAllAttendance(null, null, null, null, null, [this.userDetails._id]).toPromise()
      .then(res => {
        this.allAttendances = res as any;
      }).catch(err => this.alertNotificationService.alertError(err));

    if (this.allAttendances && this.allAttendances.length > 0) {
      var calendarData = [...this.allAttendances]

      calendarData.forEach(e => {
        if (e.attendance === AttendanceTypeEnum.Full_Day_Present) {
          const a = {
            start: moment(e.attendanceTime).startOf('day').toDate(),
            end: moment(e.attendanceTime).endOf('day').toDate(),
            title: `${e.attendance} ${!e.isApprove ? ' - (Pending)' : ''}`,
            color: e.isApprove ? ColorCodesEnum.GREEN : ColorCodesEnum.AMBER,
            _id: e._id,
            isAttendance: true
          };
          this.events = this.events.concat(a);
        } else if (e.attendance === AttendanceTypeEnum.Only_First_Half_Present || e.attendance === AttendanceTypeEnum.Only_Second_Half_Present) {
          const a = {
            start: moment(e.attendanceTime).startOf('day').toDate(),
            end: moment(e.attendanceTime).endOf('day').toDate(),
            title: `${e.attendance} ${!e.isApprove ? ' - (Pending)' : ''}`,
            color: e.isApprove ? ColorCodesEnum.GREEN : ColorCodesEnum.AMBER,
            _id: e._id,
            isAttendance: true
          };
          this.events = this.events.concat(a);
        }
        else if (e.attendance === AttendanceTypeEnum.Absent) {
          const a = {
            start: moment(e.attendanceTime).startOf('day').toDate(),
            end: moment(e.attendanceTime).endOf('day').toDate(),
            title: `${e.attendance} ${!e.isApprove ? ' - (Pending)' : ''}`,
            color: ColorCodesEnum.RED,
            _id: e._id,
            isAttendance: true
          };
          this.events = this.events.concat(a);
        }
      });
    }
  }

  SubmitAttendance() {

    if (this.isMobileDevice) {
      this.alertNotificationService.alertInfo('Attendance Submit Not Possible by Mobile Device')
    }
    else {
      const modalRef = this.modalService.open(ModalSetAttendanceComponent, {
        size: 'md',
        scrollable: true,
        centered: true,
        backdrop: 'static'
      });

      // Set the custom data property in the modal component
      modalRef.componentInstance.customData = {
        ClickedDate: new Date(),
      };
      modalRef.result
        .then(resp => {
          if (resp) {
            var device = {
              device: this.deviceInfo.Device,
              browser: this.deviceInfo.Browser,

            }
            this.attendance.employee_id = this.userDetails._id;
            this.attendance.attendance = resp.attendance;
            this.attendance.device = device;

            this.attendanceService.postAttendance(this.attendance).toPromise()
              .then(res => {
                this.isAttendanceSubmit = true;
                const endOfDay = moment().endOf('day').toDate(); // set the time to the end of the day
                this.employeeService.createCookie('isAttendanceSubmit', 'true', endOfDay)
                this.refreshEvents()
                this.alertNotificationService.toastAlertSuccess('Attendance Submitted Succesfully');
              }).catch(err => this.alertNotificationService.alertError(err));
          }
        }).catch(err => console.log(err));
    }

  }

  RegularizeAttendance() {
    this.modalService.open(RegularizeAttendanceModalComponent, { size: 'md', scrollable: true, centered: true, backdrop: 'static' }).result
      .then(resp => {
      }).catch(err => console.log(err));
  }

  handleEventClick(info) {   // edit by calendar click
    var eventObj = info.event;
    var v = eventObj ? eventObj.start : info.dateStr;
    const clickedDate = new Date(v);
    const today = moment().endOf('day').toDate();
    const yesterday = moment().subtract(1, 'day').startOf('day').toDate();

    if (clickedDate.getTime() < yesterday.getTime()) {
      this.alertNotificationService.alertInfo('Attendance for the day has been frozen and cannot be modified. Regularize your attendance if not given or connect with your Manager');
      return false;
    } else if (clickedDate.getTime() > today.getTime()) {
      this.alertNotificationService.alertInfo('Attendance for future day can not be added.');
      return false;
    }
    else if (this.isMobileDevice && clickedDate.toDateString() == today.toDateString()) {
      this.alertNotificationService.alertInfo('Attendance Submit Not Possible by Mobile Device')
    }
    else {
      const modalRef = this.modalService.open(ModalSetAttendanceComponent, {
        size: 'md',
        scrollable: true,
        centered: true
      });

      // Set the custom data property in the modal component
      modalRef.componentInstance.customData = {
        ClickedDate: clickedDate,
      };

      modalRef.result
        .then(resp => {
          if (resp) {
            var data;
            var isNewAttendance = false;
            var clickDateString = clickedDate.toDateString();
            if (eventObj && eventObj.start && eventObj.extendedProps.isAttendance) {
              var id = eventObj.extendedProps._id;
              if (id) {
                data = {
                  ids: [id],
                  attendance: resp.attendance,
                }
              }
            } else if (info.dateStr) {
              var attendance = this.allAttendances.find(e => new Date(e.attendanceTime).toDateString() == clickDateString)
              if (attendance && attendance._id) {
                data = {
                  ids: [attendance._id],
                  attendance: resp.attendance,
                }
              } else if (clickDateString == today.toDateString() || clickDateString == yesterday.toDateString()) {
                isNewAttendance = true
              }
            }
            if (!isNewAttendance && data) {
              this.attendanceService.editAttendance(data).toPromise()
                .then(res => {
                  this.refreshEvents()
                  this.alertNotificationService.toastAlertSuccess('Attendance Submitted Succesfully');
                }).catch(err => this.alertNotificationService.alertError(err));
            } else if (isNewAttendance) {
              var device = {
                device: this.deviceInfo.Device,
                browser: this.deviceInfo.Browser,

              }
              this.attendance.employee_id = this.userDetails._id;
              this.attendance.attendance = resp.attendance;
              this.attendance.device = device;

              this.attendanceService.postAttendance(this.attendance).toPromise()
                .then(res => {
                  this.isAttendanceSubmit = true;
                  const endOfDay = moment().endOf('day').toDate(); // set the time to the end of the day
                  this.employeeService.createCookie('isAttendanceSubmit', 'true', endOfDay)
                  this.refreshEvents()
                  this.alertNotificationService.toastAlertSuccess('Attendance Submitted Succesfully');
                }).catch(err => this.alertNotificationService.alertError(err));
            }
          }
        }).catch(err => console.log(err));
    }

  }
}
