import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';

import { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexGrid, ApexChart, ApexXAxis, ApexYAxis, ApexMarkers, ApexStroke, ApexLegend, ApexResponsive, ApexTooltip, ApexFill, ApexDataLabels, ApexPlotOptions, ApexTitleSubtitle } from 'ng-apexcharts';

import { NgbDateStruct, NgbCalendar, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';

// Progressbar.js
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { Course } from 'src/app/model/course.model';
import { DiscussionService } from 'src/app/services/discussion.service';
import { Discussion } from 'src/app/model/discussion.model';
import { SellsService } from 'src/app/services/sells.service';
import { LeadsService } from 'src/app/services/leads.service';
import { Notice } from 'src/app/model/annoucement.model';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { roundOff } from 'src/app/utility/roundOff';
import { SalesProjectionCommit } from 'src/app/model/salesprojection.model';
import * as moment from 'moment';
import { EmployeeService } from 'src/app/services/employee.service';
import { FullMonths, ShortMonths } from 'src/app/Enums/staticdata';
import { calcNetAmount } from 'src/app/utility/calcGST';
import { Attendence, Employee } from 'src/app/model/employee.model';
import { AttendanceService } from 'src/app/services/attendance.service';
import { DeviceInfoService } from 'src/app/services/device.info.service';
import { ModalSetAttendanceComponent } from '../attendance-and-leave/modal-set-attendance/modal-set-attendance.component';
import { NoticeService } from 'src/app/services/notice.service';

export type apexChartOptions = {
  series: ApexAxisChartSeries;
  nonAxisSeries: ApexNonAxisChartSeries;
  colors: string[];
  grid: ApexGrid;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  markers: ApexMarkers,
  stroke: ApexStroke,
  legend: ApexLegend,
  responsive: ApexResponsive[],
  tooltip: ApexTooltip,
  fill: ApexFill
  dataLabels: ApexDataLabels,
  plotOptions: ApexPlotOptions,
  labels: string[],
  title: ApexTitleSubtitle
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe],
  preserveWhitespaces: true
})
export class DashboardComponent implements OnInit {

  public apexChart1Options: Partial<apexChartOptions>;
  public apexChart2Options: Partial<apexChartOptions>;
  public apexChart3Options: Partial<apexChartOptions>;
  public apexChart4Options: Partial<apexChartOptions>;
  public apexChart5Options: Partial<apexChartOptions>;
  public apexChart6Options: Partial<apexChartOptions>;

  deviceInfo: { Device: string; Browser: string; };

  performance: any[];

  monthLabel = ShortMonths;
  isMobileDevice = false;
  allCount;
  attendance_Count: number = 0; // Initialize the badge count
  regularize_attend_Count: number = 0; // Initialize the badge count

  leavelequest_Count: number = 0; // Initialize the badge count
  shiftroster_Count: number = 0; // Initialize the badge count
  allNotice: Notice[];
  constructor(
    private calendar: NgbCalendar,
    private attendanceService: AttendanceService,
    private alertNotificationService: AlertNotificationsService,
    private employeeService: EmployeeService,
    private discussionService: DiscussionService,
    private sellsService: SellsService,
    private leadService: LeadsService,
    private modalService: NgbModal,
    private deviceDetector: DeviceInfoService,
    private noticeService: NoticeService,

  ) {
    this.deviceInfo = this.deviceDetector.getDeviceInfo();

    this.apexChart1Options = {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
        textAnchor: "end",
        formatter: (y) => {
          if (typeof y !== "undefined") {
            return Number(y).toFixed(2);
          }
          return y;
        },
      },
      series: [{
        data: []
      }],
      stroke: {
        show: true,
        width: 2,
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: '#686868',
            fontSize: '13px',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: 400,
          },
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#686868',
            fontSize: '11px',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: 400,
          },
          formatter: (n) => {
            if (typeof n !== "undefined") {
              n = Number(n)
              if (n < 1e3) return n.toFixed(1);
              if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
              if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
              if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
              if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
            }
            return n.toFixed(1);
          }
        },
      },
      colors: ["#727cf5"],
      tooltip: {
        fixed: {
          enabled: !1
        },
        x: {
          show: !1
        },
        y: {
          formatter: (y) => {
            if (typeof y !== "undefined") {
              return Number(y).toFixed(2);
            }
            return y;
          },
        },
        marker: {
          show: !1
        }
      }
    };
    this.apexChart2Options = {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
        textAnchor: "end"
      },
      series: [{
        data: []
      }],
      stroke: {
        show: true,
        width: 2,
      },
      xaxis: {
        type: "category",
        categories: [],
        labels: {
          style: {
            colors: '#686868',
            fontSize: '13px',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: 400,
          },
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#686868',
            fontSize: '11px',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: 400,
          },
          formatter: (n) => {
            if (typeof n !== "undefined") {
              n = Number(n)
              if (n < 1e3) return n.toFixed(1);
              if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
              if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
              if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
              if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
            }
            return n.toFixed(1);
          }
        },
      },
      colors: ["#727cf5"],
      tooltip: {
        fixed: {
          enabled: !1
        },
        x: {
          show: !1
        },
        y: {
          formatter: (y) => {
            if (typeof y !== "undefined") {
              return Number(y).toFixed(2);
            }
            return y;
          },
        },
        marker: {
          show: !1
        }
      }
    };
    this.apexChart3Options = {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
        textAnchor: "end"
      },
      series: [{
        data: []
      }],
      stroke: {
        show: true,
        width: 2,
      },
      xaxis: {
        type: "category",
        categories: [],
        labels: {
          style: {
            colors: '#686868',
            fontSize: '13px',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: 400,
          },
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#686868',
            fontSize: '11px',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: 400,
          },
          formatter: (n) => {
            if (typeof n !== "undefined") {
              n = Number(n)
              if (n < 1e3) return n.toFixed(1);
              if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
              if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
              if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
              if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
            }
            return n.toFixed(1);
          }
        },
      },
      colors: ["#727cf5"],
      tooltip: {
        fixed: {
          enabled: !1
        },
        x: {
          show: !1
        },
        y: {
          formatter: (y) => {
            if (typeof y !== "undefined") {
              return Number(y).toFixed(2);
            }
            return y;
          },
        },
        marker: {
          show: !1
        }
      }
    };
    this.apexChart4Options = {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
        textAnchor: "end"
      },
      series: [{
        name: "Due",
        data: []
      }],
      stroke: {
        show: true,
        width: 2,
      },
      xaxis: {
        type: "category",
        categories: [],
        labels: {
          style: {
            colors: '#686868',
            fontSize: '13px',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: 400,
          },
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#686868',
            fontSize: '11px',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: 400,
          },
          formatter: (n) => {
            if (typeof n !== "undefined") {
              n = Number(n)
              if (n < 1e3) return n.toFixed(1);
              if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
              if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
              if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
              if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
            }
            return n.toFixed(1);
          }
        },
      },
      colors: ["#727cf5"],
      tooltip: {
        fixed: {
          enabled: !1
        },
        x: {
          show: !1
        },
        y: {
          formatter: (y) => {
            if (typeof y !== "undefined") {
              return Number(y).toFixed(2);
            }
            return y;
          },
        },
        marker: {
          show: !1
        }
      }
    };
    this.apexChart5Options = {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
        textAnchor: "end"
      },
      series: [{
        name: "GST",
        data: []
      }],
      stroke: {
        show: true,
        width: 2,
      },
      xaxis: {
        type: "category",
        categories: [],
        labels: {
          style: {
            colors: '#686868',
            fontSize: '13px',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: 400,
          },
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#686868',
            fontSize: '11px',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: 400,
          },
          formatter: (n) => {
            if (typeof n !== "undefined") {
              n = Number(n)
              if (n < 1e3) return n.toFixed(1);
              if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
              if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
              if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
              if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
            }
            return n.toFixed(1);
          }
        },
      },
      colors: ["#727cf5"],
      tooltip: {
        fixed: {
          enabled: !1
        },
        x: {
          show: !1
        },
        y: {
          formatter: (y) => {
            if (typeof y !== "undefined") {
              return Number(y).toFixed(2);
            }
            return y;
          },
        },
        marker: {
          show: !1
        }
      }
    };
    this.apexChart6Options = {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
        textAnchor: "end"
      },
      series: [{
        name: "Projection",
        data: []
      }, {
        name: "Actual",
        data: []
      }],
      stroke: {
        show: true,
        width: 2,
      },
      xaxis: {
        type: "category",
        categories: [],
        labels: {
          style: {
            colors: '#686868',
            fontSize: '13px',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: 400,
          },
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#686868',
            fontSize: '11px',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: 400,
          },
          formatter: (n) => {
            if (typeof n !== "undefined") {
              n = Number(n)
              if (n < 1e3) return n.toFixed(1);
              if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
              if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
              if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
              if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
            }
            return n.toFixed(1);
          }
        },
      },
      colors: ["#727cf5", '#00e396'],
      tooltip: {
        fixed: {
          enabled: !1
        },
        x: {
          show: !1
        },
        y: {
          formatter: (y) => {
            if (typeof y !== "undefined") {
              return Number(y).toFixed(2);
            }
            return y;
          },
        },
        marker: {
          show: !1
        }
      }
    };
    this.checkIsMobile();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkIsMobile();
  }
  private checkIsMobile() {
    const screenWidth = window.innerWidth;
    this.isMobileDevice = screenWidth < 768; // You can adjust the threshold as needed
  }

  imageurl = environment.imageUrl;
  isAttendanceSubmit: boolean;
  userDetails
  ngOnInit(): void {
    this.userDetails = this.employeeService.getUserPayload()
    if (this.deviceInfo.Device == "Android" && this.ismobileSize) {
      this.isMobileDevice = true

    }
    this.refresh()
    this.fetchBadgeCountFromAPI();
    this.noticeList()
  }

  allStudentsCount = 0
  isLoading: boolean
  allCourse: Course[]
  allCoursesCount = 0
  allUnreadMsgCount = 0
  alldiscussions: Discussion[]
  allFeedbackCount = 0
  totalEarning = 0
  totalDue = 0
  allUnreadInsMsgCount = 0
  allUnapproveCourseCount = 0
  allInsCount = 0
  allLeadsCount = 0
  allCertReqCount = 0
  allUnapprovedRatingsCount = 0
  pendingOnboardingCount = 0
  totalLeadAssigned = 0
  totalFreshLeadPending = 0
  totalNotConnectedPending = 0
  totalInProgressPending = 0
  totalDemoGiven = 0
  SalesProjection = 0
  ProRataProjection = 0
  ActualRevenue = 0;
  SurplusDeficit = 0;
  today = new Date();
  employeeCount = 0;
  pendingVerification = 0;
  async refresh() {
    this.isLoading = true

    this.employeeService.getEmployeeDashboard().toPromise()
      .then(res => {
        this.allStudentsCount = res['allStudentsCount'];
        this.allCourse = res['allCourses'];
        this.allCoursesCount = res['allCoursesCount'];
        this.allUnapproveCourseCount = res['allUnapproveCourseCount'];
        this.allFeedbackCount = res['allfeedback'];
        this.allInsCount = res['allInsCount'];
        this.employeeCount = res['employeeCount'];
        this.allCertReqCount = res['allCertReqCount'];
        this.allUnapprovedRatingsCount = res['allUnapprovedRatingsCount'];
      }).catch(err => this.alertNotificationService.alertError(err));

    this.refreshDiscussion()

    var month = this.months[this.today.getMonth()]
    var year = (this.today.getFullYear()).toString()
    this.sellsService.getCommitProjection(null, null, null, "approved", null).toPromise()
      .then(res => {
        this.allProjection = res
        this.SalesProjection = roundOff(this.allProjection.filter(e => e.Month == month && e.Year == year && e.Payment_Recv).map(f => f.Payment_Recv).reduce((acc, value) => Number(acc) + Number(value), 0))
        this.ProRataProjection = roundOff((this.SalesProjection * this.today.getDate()) / this.getDaysInCurrentMonth())
        this.ProRataProjection = calcNetAmount(this.ProRataProjection);
        this.SalesProjection = calcNetAmount(this.SalesProjection);
      }).catch(err => this.alertNotificationService.alertError(err));


    this.leadService.leadDashboard().toPromise()
      .then(res => {
        this.allLeadsCount = res['totalLead'];
        this.totalLeadAssigned = res['totalLeadAssigned'];
        this.totalDemoGiven = res['totalDemoGiven'];
        this.totalFreshLeadPending = res['totalFreshLeadPending'];
        this.totalInProgressPending = res['totalInProgressPending'];
        this.totalNotConnectedPending = res['totalNotConnectedPending'];
        this.pendingOnboardingCount = res['pendingOnboardingCount'];
      }).catch(err => this.alertNotificationService.alertError(err))

    this.sellsService.getDashboardsells().toPromise()
      .then(res => {
        this.totalDue = res['totalDue'];
        this.totalEarning = res['totalEarning'];
        this.ActualRevenue = res['ActualRevenue'];
        this.performance = res['performance'];
        this.pendingVerification = res['pendingVerification'];
        this.createsellsdata()

      }).catch(err => this.alertNotificationService.alertError(err))
  }
  fetchBadgeCountFromAPI() {
    this.attendanceService.getPendingApprovalCount().toPromise()
      .then(res => {
        this.allCount = res;
        this.attendance_Count = this.allCount.attendance_Count;
        this.leavelequest_Count = this.allCount.leavelequest_Count;
        this.regularize_attend_Count = this.allCount.regularize_attend_Count;
        this.shiftroster_Count = this.allCount.shiftroster_Count;
      })
  }
  allProjection: SalesProjectionCommit[] = []
  months = FullMonths;
  refreshDiscussion() {
    this.discussionService.getAllDiscussion().toPromise()
      .then(res => {
        this.alldiscussions = res as Discussion[];
        this.allUnreadMsgCount = this.alldiscussions.filter(e => !e.adminshow).length
        this.allUnreadInsMsgCount = this.alldiscussions.filter(e => e.instructor_id && !e.instructorshow).length
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  getDaysInCurrentMonth() {
    var date = new Date();
    return new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
  }

  checkAttendanceSubmit() {
    const isAttendanceSubmit = this.employeeService.readCookie('isAttendanceSubmit');
    if (isAttendanceSubmit == 'true') {
      return true;
    }
    return false;
  }

  years = []
  createsellsdata() {
    var label = this.performance.map(e => e.month)
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth();
    var m = currentDate.getMonth();
    var currentYear = currentDate.getFullYear();
    console.log(currentDate, currentMonth, currentYear)
    var projection = []
    for (var i = 0; i < 6; i++) {
      if (m >= 0) {
        var p = this.allProjection.filter(s => s.Month == this.months[m] && s.Year == currentYear.toString() && s.Payment_Recv);
        if (p) {
          projection.push(calcNetAmount(p.map(f => f.Payment_Recv).reduce((acc, value) => Number(acc) + Number(value), 0)));
        } else {
          projection.push(0)
        }
        m--;
      }
      //console.log(m)
      if (currentMonth < 5 && m < 0) {
        m = 11
        currentYear--
      }
    }
    console.log(projection)


    var xaxis: ApexXAxis = {
      type: "category",
      categories: label,
      labels: {
        style: {
          colors: '#686868',
          fontSize: '13px',
          fontFamily: 'Overpass, sans-serif',
          fontWeight: 400,
        },
      },
      axisBorder: {
        show: false
      }
    }

    this.SurplusDeficit = roundOff(this.ActualRevenue - this.ProRataProjection + this.pendingVerification);

    var students = this.performance.map(e => e.students)
    this.apexChart1Options.series = [{ name: "Students", data: students }]
    this.apexChart1Options.xaxis = xaxis

    var booked = this.performance.map(e => e.bookedamount)
    this.apexChart2Options.series = [{ name: "Booked Amount", data: booked }]
    this.apexChart2Options.xaxis = xaxis

    var payment = this.performance.map(e => e.paymentreceived)
    this.apexChart3Options.series = [{ name: "Payment Received", data: payment }]
    this.apexChart3Options.xaxis = xaxis

    var due = this.performance.map(e => e.due)
    this.apexChart4Options.series = [{ name: "Due", data: due }]
    this.apexChart4Options.xaxis = xaxis

    var gst = this.performance.map(e => e.gst)
    this.apexChart5Options.series = [{ name: "GST", data: gst }]
    this.apexChart5Options.xaxis = xaxis

    this.apexChart6Options.series = [{ name: "Projection", data: projection.reverse() }, { name: "Actual", data: payment }]
    this.apexChart6Options.xaxis = xaxis

  }

  leadassignedcm() {
    sessionStorage.setItem('fromDate', moment(this.today).date(1).format('YYYY-MM-DD'));
    sessionStorage.setItem('toDate', moment(this.today).date(moment(this.today).daysInMonth()).format('YYYY-MM-DD'));
  }

  leadredirect(s) {
    sessionStorage.setItem('stage', s);
    sessionStorage.setItem('fromDate', null);
    sessionStorage.setItem('toDate', null);
  }


  // Attendance part below
  attendance = new Attendence()
  ismobileSize = false

  SubmitAttendance() {

    if (this.isMobileDevice) {
      this.alertNotificationService.alertInfo('Attendance Submit Not Possible by Mobile Device')
    } else {
      const modalRef = this.modalService.open(ModalSetAttendanceComponent, {
        size: 'md',
        scrollable: true,
        centered: true,
      });

      // Set the custom data property in the modal component
      modalRef.componentInstance.customData = {
        ClickedDate: this.today
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
                this.alertNotificationService.toastAlertSuccess('Attendance Submitted Succesfully');

              }).catch(err => this.alertNotificationService.alertError(err));
          }
        }).catch(err => {
          console.log(err);
        });
    }

  }


  // -----------> Notice Board Carousel <---------------


  autoPlayExampleOptions: OwlOptions = {
    items: 1,
    loop: true,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 20000,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    lazyLoad: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    }
  }

  noticeList() {
    this.noticeService.getAllNotice(null, null, null, 'Approve', null, null, null, 10, 0).toPromise()
      .then(res => {
        this.allNotice = res as Notice[];
      }).catch(err => this.alertNotificationService.alertError(err))
  }
}
