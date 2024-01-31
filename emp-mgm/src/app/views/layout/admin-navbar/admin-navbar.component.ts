import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Discussion } from 'src/app/model/discussion.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { DiscussionService } from 'src/app/services/discussion.service';
import * as moment from 'moment';
import { EmployeeService } from 'src/app/services/employee.service';
import { Attendence, Department, Employee, Team } from 'src/app/model/employee.model';
import { ModalSetAttendanceComponent } from '../../pages/attendance-and-leave/modal-set-attendance/modal-set-attendance.component';
import { AttendanceService } from 'src/app/services/attendance.service';
import { DeviceInfoService } from 'src/app/services/device.info.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { merge, fromEvent, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent implements OnInit, AfterViewInit, OnDestroy {

  onlineMessage
  displayedColumnsRoaster = []
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService,
    private discussionService: DiscussionService,
    private attendanceService: AttendanceService,
    private cdref: ChangeDetectorRef,
    private deviceDetector: DeviceInfoService,
    private modalService: NgbModal

  ) {
    this.deviceInfo = this.deviceDetector.getDeviceInfo();
    this.checkIsMobile();
    this.createOnline$().subscribe((isOnline) => {
      console.log(isOnline);
      if (isOnline) {
        this.onlineMessage = '';
      } else {
        this.onlineMessage =
          'Slow Internet Connectivity Detected!. Please Check your internet and refresh again.';
      }
    });
  }
  deviceInfo: { Device: string; Browser: string; };
  setint
  setAttendanceint
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkIsMobile();
  }
  ismobileSize = false
  private checkIsMobile() {
    const screenWidth = window.innerWidth;
    this.ismobileSize = screenWidth < 768; // You can adjust the threshold as needed
  }
  ngAfterViewInit() {
    this.setint = setInterval(() => {
      this.refresh();
    }, 600000)
    this.setAttendanceint = setInterval(() => {
      const attendancePopup = this.employeeService.readCookie('attendancePopup');
      if (attendancePopup != 'true') {
        const date = new Date();
        if (date.getDay() !== 0 && date.getHours() > 14) {
          this.checkAttendance();
        }
      }
    }, 60000);
  }

  attendance = new Attendence()
  SubmitAttendance() {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    this.employeeService.createCookie('attendancePopup', 'true', d)
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ModalSetAttendanceComponent, {
      size: 'md',
      scrollable: true,
      centered: true
    });

    // Set the custom data property in the modal component
    modalRef.componentInstance.customData = {
      ClickedDate: new Date()
    };
    modalRef.result
      .then(resp => {
        if (resp) {
          var device = {
            device: this.deviceInfo.Device,
            browser: this.deviceInfo.Browser,
          }
          this.attendance.employee_id = this.user._id;
          this.attendance.attendance = resp.attendance;
          this.attendance.device = device;

          this.attendanceService.postAttendance(this.attendance).toPromise()
            .then(res => {
              const endOfDay = moment().endOf('day').toDate(); // set the time to the end of the day
              this.employeeService.createCookie('isAttendanceSubmit', 'true', endOfDay)
              this.alertNotificationService.toastAlertSuccess('Attendance Submitted Succesfully');
            }).catch(err => this.alertNotificationService.alertError(err));
        }
      }).catch(err => {
        console.log(err);
      });
  }

  checkAttendance() {
    const isAttendanceSubmit = this.employeeService.readCookie('isAttendanceSubmit');
    if (isAttendanceSubmit == 'true') {
      if (this.setAttendanceint) {
        clearInterval(this.setAttendanceint);
      }
    } else {
      this.attendanceService.checkEmployeePresent(this.user._id).toPromise()
        .then(res => {
          const endOfDay = moment().endOf('day').toDate();
          if (res['isPresent']) {
            this.employeeService.createCookie('isAttendanceSubmit', 'true', endOfDay)
          } else {
            this.employeeService.createCookie('isAttendanceSubmit', 'false', endOfDay)
            if (this.deviceInfo.Device != "Android" && !this.ismobileSize) {
              this.SubmitAttendance();
            }
          }
        }).catch(err => this.alertNotificationService.alertError(err));
    }
  }

  ngOnDestroy() {
    if (this.setint) {
      clearInterval(this.setint);
    }
    if (this.setAttendanceint) {
      clearInterval(this.setAttendanceint);
    }
  }
  departments: Department[] = [];

  user
  employee = new Employee()
  ngOnInit(): void {
    this.displayedColumnsRoaster = ["employee_invid", "shift", "manager_invid", "working_location"];
    this.user = this.employeeService.getUserPayload()
    this.refresh()

  }



  /**
   * Sidebar toggle on hamburger button click
   */
  toggleSidebar(e) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  /**
   * Logout
   */
  onLogout(e) {
    e.preventDefault();
    this.employeeService.logout();
  }
  allUnapproveCourseCount = 0
  allUnreadMsgCount = 0
  alldiscussions: Discussion[]
  allUnreadInsMsgCount = 0
  allUnapprovedRatingsCount = 0
  allCertReqCount = 0
  isindicate: boolean
  count = 0
  LastRefreshTime = new Date()
  NextRefreshTime = new Date()
  teams: Team[] = []
  TeamsDrop;
  async refresh() {
    this.count = 0
    this.isindicate = false
    await this.employeeService.getEmployeeProfile(this.user.invid, 'display').toPromise()
      .then(res => {
        this.employee = res;
      }).catch(err => console.log(err))

    await this.employeeService.getEmployeeDashboard().toPromise()
      .then(res => {
        this.allUnapproveCourseCount = res['allUnapproveCourseCount'];
        this.isindicate = this.allUnapproveCourseCount > 0;
        this.count += this.allUnapproveCourseCount > 0 ? 1 : 0;
        this.allCertReqCount = res['allCertReqCount'];
        this.isindicate = this.allCertReqCount > 0;
        this.count += this.allCertReqCount > 0 ? 1 : 0;
        this.allUnapprovedRatingsCount = res['allUnapprovedRatingsCount'];
        this.isindicate = this.allUnapprovedRatingsCount > 0;
        this.count += this.allUnapprovedRatingsCount > 0 ? 1 : 0;
      }).catch(err => this.alertNotificationService.alertError(err));

    this.employeeService.getAllTeams('all', null).toPromise()
      .then(res => {
        this.teams = res as Team[];


      }).catch(err => this.alertNotificationService.alertError(err))
    this.refreshDiscussion()

    this.LastRefreshTime = new Date()
    this.NextRefreshTime = new Date()
  }

  refreshDiscussion() {
    this.discussionService.getAllDiscussion().toPromise()
      .then(res => {
        this.alldiscussions = res as Discussion[];
        this.allUnreadMsgCount = this.alldiscussions.filter(e => !e.adminshow).length
        this.allUnreadInsMsgCount = this.alldiscussions.filter(e => e.instructor_id && !e.instructorshow).length
        this.isindicate = this.allUnreadMsgCount > 0;
        this.count += this.allUnreadMsgCount > 0 ? 1 : 0;
        this.isindicate = this.allUnreadInsMsgCount > 0;
        this.count += this.allUnreadInsMsgCount > 0 ? 1 : 0;
      }).catch(err => console.log(err))
  }



  checkpresent(num) {
    return num != 0
  }

  getRefreshTime() {
    return moment(moment(this.LastRefreshTime).add(10, 'minutes')).fromNow();
  }

  createOnline$() {
    return merge(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      })
    );
  }
  teamFilter = null;

  roster = []
  async showRoaster(component) {
    await this.filter()
    this.modalService.open(component, {
      size: 'lg',
      scrollable: true,
      centered: true
    }).result
      .then(res => { })
      .catch(err => {
        console.log(err);
      });
  }
  dataSourceRoster: MatTableDataSource<any>;
  selctedDep;
  onDeptSelect(row) {
    if (row && row.roaster && row.roaster.length > 0) {
      this.teamFilter = null
      this.dataSourceRoster = new MatTableDataSource(row.roaster);
      this.newroster = row.roaster;
      this.selctedDep = row._id;
      this.TeamsDrop = this.teams.filter(e => e.department_id == this.selctedDep);
    } else {
      this.dataSourceRoster = new MatTableDataSource([]);
    }
  }
  async filter() {

    await this.attendanceService.getTodaysRoaster().toPromise()
      .then(res => {
        this.roster = res;
        this.onDeptSelect(this.roster[0]);
      }).catch(err => {
        this.alertNotificationService.alertError(err);
      });


  }
  selectedTeam;
  newroster;
  filterTeam() {
    if (this.teamFilter != null) {
      var data = [...this.newroster];
      this.selectedTeam = data.filter(r => r.team_id == this.teamFilter);
      this.dataSourceRoster = new MatTableDataSource(this.selectedTeam);
    } else {
      this.filter()
    }
  }
}
