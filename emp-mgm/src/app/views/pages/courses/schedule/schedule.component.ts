import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EventInput } from '@fullcalendar/core';
import { Scheduledata, Holiday } from 'src/app/model/course.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { ExportService } from 'src/app/services/export.service';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeScheduleComponent } from '../change-schedule/change-schedule.component';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { PackageService } from 'src/app/services/package.service';
import { LiveMarketPracticeSlots } from 'src/app/model/live-market-practice.model';
import { InstructorService } from 'src/app/services/instructor.service';
import { Instructor } from 'src/app/model/instructor.model';
import { MentorshipSlots } from 'src/app/model/one-to-one-mentorship.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { environment } from 'src/environments/environment';
import { Languages } from 'src/app/Enums/staticdata';
import { HolidayType } from '../../../../Enums/staticdata';

const colors: any = {
  red: '#FAE3E3',
  blue: '#1e90ff',
  yellow: '#e3bc08',
  violet: '#8f00ff'
};



@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {


  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  languageFilter: ''
  languages = Languages
  languageFilter1: ''



  constructor(
    private CourseService: courseService,
    private alertNotificationService: AlertNotificationsService,
    private employeeService: EmployeeService,
    private exportService: ExportService,
    private modalService: NgbModal,
    private productService: PackageService,
    private instructorService: InstructorService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 30);
  }
  holiday: Holiday = {
    _id: '',
    date: new Date(),
    title: 'Holiday'
  }
  holidayType = HolidayType;
  filterQuery = "";
  rowsOnPage = 25;
  sortBy = "date";
  sortOrder = "asc";
  dataLength;
  displayedColumns: string[];
  displayedColumns1: string[];
  upcoming: Scheduledata[]
  previous: Scheduledata[]
  allholiday: Holiday[]
  pastHoliday: Holiday[]
  upcomingHoliday: Holiday[]
  dataSource: MatTableDataSource<Scheduledata>;
  dataSource1: MatTableDataSource<Scheduledata>;
  dataSource2: MatTableDataSource<Holiday>;
  dataSource3: MatTableDataSource<Holiday>;
  @ViewChild('paginatorUS', { static: false }) paginatorUS!: MatPaginator;
  @ViewChild('paginatorPS', { static: false }) paginatorPS!: MatPaginator;
  @ViewChild('paginatorUH', { static: false }) paginatorUH!: MatPaginator;
  @ViewChild('paginatorPH', { static: false }) paginatorPH!: MatPaginator;
  @ViewChild('sortUS', { static: false }) sortUS!: MatSort;
  @ViewChild('sortPS', { static: false }) sortPS!: MatSort;
  @ViewChild('sortUH', { static: false }) sortUH!: MatSort;
  @ViewChild('sortPH', { static: false }) sortPH!: MatSort;
  payload
  events: EventInput[] = [];
  @ViewChild('externalEvents', { static: true }) externalEvents: ElementRef;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin, listPlugin]; // important!
  allMentor: Instructor[] = []
  mentorshipSlotLists: MentorshipSlots[] = []
  mentorFilter = ''
  servicefilter = ''
  mentorFilter1 = ''
  servicefilter1 = ''
  frmDate = ''
  srtRange = ''
  toRange = ''
  servicecodes = []
  servicecodes1 = []
  async ngOnInit() {
    this.payload = this.employeeService.getUserPayload();
    this.displayedColumns = ["service_code", "service_start_date", "instructor_id", 'language', 'class_number', "start_time", "webinar_id", "account", "id"];
    this.displayedColumns1 = ["title", "date", "type", "id"];
    this.isLoading = true
    this.refreshlist();
    this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.allMentor = res
        this.allMentor = this.allMentor.filter(e => e.approved)
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  isLoading = false
  async refreshlist() {
    this.isLoading = true
    this.events = [];
    this.upcoming = []
    this.previous = []
    await this.CourseService.getHoliday().toPromise()
      .then(res => this.allholiday = res as Holiday[])
      .catch(err => this.alertNotificationService.alertError(err))

    await this.CourseService.calenderschedules().toPromise()
      .then(res => {
        this.upcoming = res['upcoming']
        this.previous = res['previous']
        this.events = res['events']
      }).catch(err => this.alertNotificationService.alertError(err))
    this.servicecodes = [...new Set(this.upcoming.filter(e => e.service_code).map(e => e.service_code))]
    this.servicecodes1 = [...new Set(this.previous.filter(e => e.service_code).map(e => e.service_code))]
    this.filter()
    this.dataSource1 = new MatTableDataSource(this.previous);
    this.pastHoliday = this.allholiday.filter(e => new Date(e.date) < this.subDays(this.today, 1));
    this.upcomingHoliday = this.allholiday.filter(e => new Date(e.date) >= this.subDays(this.today, 1))

    for (var e of this.allholiday) {
      var a = {
        start: this.startOfDay(new Date(e.date)),
        end: this.endOfDay(new Date(e.date)),
        title: e.title.toString(),
        backgroundColor: e.type == HolidayTypeEnum.Company_Holiday ? ColorCodesEnum.BLUE : ColorCodesEnum.VIOLET,
        textColor: "#000000",
        allDay: true
      };
      if (a) {
        this.events = this.events.concat(a)
      }
    }

    this.dataSource2 = new MatTableDataSource(this.upcomingHoliday.reverse());
    this.dataSource3 = new MatTableDataSource(this.pastHoliday);
    this.isLoading = false
  }

  onTabChange() {
    console.log(new Date(), 's')
    setTimeout(() => {
      if (this.paginatorPS && this.dataSource1) {
        this.dataSource1.paginator = this.paginatorPS;
      }
      if (this.sortPS && this.dataSource1) {
        this.dataSource1.sort = this.sortPS;
      }
      if (this.paginatorUH && this.dataSource2) {
        this.dataSource2.paginator = this.paginatorUH;
      }
      if (this.sortUH && this.dataSource2) {
        this.dataSource2.sort = this.sortUH;
      }
      if (this.paginatorPH && this.dataSource3) {
        this.dataSource3.paginator = this.paginatorPH;
      }
      if (this.sortPH && this.dataSource3) {
        this.dataSource3.sort = this.sortPH;
      }
      if (this.paginatorUS && this.dataSource) {
        this.dataSource.paginator = this.paginatorUS;
      }
      if (this.sortUS && this.dataSource) {
        this.dataSource.sort = this.sortUS;
      }
    }, 3000)
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
      date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) { return this.toDate && date.after(this.fromDate) && date.before(this.toDate); }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
      this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }




  handleEventClick(info) {
    var eventObj = info.event;
    var now = new Date()

    if (eventObj.extendedProps.join_url && this.addMinutes(now, 15).getTime() >= new Date(eventObj.start).getTime() && now.getTime() <= new Date(eventObj.end).getTime()) {
      Swal.fire({
        title: eventObj.title,
        confirmButtonText: `Join Now`,
        showCloseButton: true
      }).then(res => {
        if (res.isConfirmed) {
          // window.open(eventObj.extendedProps.join_url, '_blank');
          const url = `${environment.zoomWebAppUrl}?s=${eventObj.extendedProps._id}&redirect=${window.location.href}`
          window.open(url, '_blank');
          info.jsEvent.preventDefault(); // prevents browser from following link in current tab.
        }
      })
    } else if (eventObj.extendedProps._id) {
      if (new Date(eventObj.end).getTime() < now.getTime()) {
        Swal.fire({
          title: eventObj.title,
          text: 'Session Ended',
          showCloseButton: true
        })
      }
      else {
        Swal.fire({
          title: eventObj.title,
          text: 'Session Not Started Yet.',
          showCloseButton: true
        })
      }
    } else {
      this.alertNotificationService.alertInfo('Session Not Found')
    }
  }

  gotoclass(sc: Scheduledata) {

    var now = new Date()
    if (sc.webinar_id && this.addMinutes(now, 15).getTime() >= new Date(sc.start_time).getTime() && now.getTime() <= new Date(sc.end_time).getTime()) {
      // sessionStorage.setItem('usd54a5dsbasd', sc.webinar_id.toString());
      // sessionStorage.setItem('p4ad4sa5d4ad4', sc.webinar_password.toString())
      // sessionStorage.setItem('url', "https://invesmate.com/admin/dashboard")
      // window.open("https://invesmate.com/liveclassteacher?w=" + sc.webinarid.toString() + '&p=' + btoa(sc.password.toString() + '.' + this.payload._id), '_blank');
      // window.open(sc.join_url, '_blank')
      const url = `${environment.zoomWebAppUrl}?s=${sc._id}&redirect=${window.location.href}`
      window.open(url, '_blank');
    }
    else if (sc._id) {
      if (new Date(sc.end_time).getTime() < now.getTime()) {
        this.alertNotificationService.alertInfo('Session Ended')
      }
      else {
        this.alertNotificationService.alertInfo('Session Not Started Yet. You will access it before 15 minutes of start time')
      }
    }
    else {
      this.alertNotificationService.alertInfo('Session Not Found')
    }
  }


  onDelete(sc: Scheduledata) {
    if (sc.type == 'COURSE') {
      this.alertNotificationService.alertDelete()
        .then(result => {
          if (result.isConfirmed) {
            this.CourseService.deleteSchedule(sc._id).toPromise()
              .then(res => {
                this.refreshlist()
                this.alertNotificationService.toastAlertSuccess('Schedule Deleted Successfully')
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    } else if (sc.type == 'PRODUCT') {
      this.alertNotificationService.alertInfo("Session is already booked by student. Please Reschedule the Session then delete the schedule.")
    }
  }
  rescheduleSlot = {
    currentId: '',
    nextbookingid: '',
    date: ''
  }
  selectedSlot = {
    currentslotid: '',
    mentor_id: '',
    date: '',
    updatedslot: '',
    start_time: new Date()
  };
  liveMarketPracticeSlots: LiveMarketPracticeSlots[] = []
  isSuccess = false;
  changedSlot = new MentorshipSlots();
  onEdit(data: Scheduledata, content) {
    if (data.type == 'COURSE') {
      const modalRef = this.modalService.open(ChangeScheduleComponent, { centered: true, scrollable: true, size: 'xl' })
      modalRef.componentInstance.data = { id: data._id, service_id: data.service_id }
      modalRef.result.then(result => {
        if (result == 'Submit') {
          this.refreshlist()
        }
      }).catch(err => {
        console.log(err);
      })

    }
    else if (data.service_type == 'Live Market Practice') {
      this.rescheduleSlot.currentId = data._id;
      this.rescheduleSlot.date = moment(data.start_time).format('YYYY-MM-DD');
      this.rescheduleSlot.nextbookingid = '';


      this.productService.getLiveMarketPracticeSlots(null, null, null, null).toPromise()
        .then(res => {
          this.liveMarketPracticeSlots = res['slots']
        }).catch(err => this.alertNotificationService.alertError(err))

      this.modalService.open(content, { centered: true, size: 'lg', scrollable: true }).result.then((result) => {

      }).catch((res) => { });
    }
    else if (data.service_type == 'One to One Mentorship') {
      this.selectedSlot.mentor_id = data.instructor_id;
      this.selectedSlot.currentslotid = data._id;
      this.productService.availableSlotLists().toPromise()
        .then(res => {
          this.mentorshipSlotLists = res
        }).catch(err => this.alertNotificationService.alertError(err))

      this.modalService.open(content, { centered: true, size: 'lg', scrollable: true }).result.then((result) => {

      }).catch((res) => { });
    }
  }

  availableSlots: LiveMarketPracticeSlots[] = []
  ontimechange() {
    this.availableSlots = this.liveMarketPracticeSlots.filter(e => moment(e.start_time).format('YYYY-MM-DD') == this.rescheduleSlot.date);
  }

  availableo2oSlots: MentorshipSlots[] = []
  ono2otimechange() {
    this.availableo2oSlots = this.mentorshipSlotLists.filter(e => moment(e.start_time).format('YYYY-MM-DD') == this.selectedSlot.date);
  }

  reschedule() {
    this.alertNotificationService.alertChanges()
      .then(result => {
        if (result.isConfirmed) {
          this.isSuccess = true;
          this.productService.rescheduleLiveMarketPracticeSlot(this.rescheduleSlot).toPromise()
            .then(res => {
              this.isSuccess = false
              this.alertNotificationService.toastAlertSuccess('Schedule Changed');
              this.refreshlist()
              this.modalService.dismissAll()
            }).catch(err => this.alertNotificationService.alertError(err));
        }
      })
  }

  submito2oForm() {
    this.alertNotificationService.alertChanges()
      .then(result => {
        if (result.isConfirmed) {
          this.selectedSlot.start_time = this.changedSlot.start_time;
          this.selectedSlot.updatedslot = this.changedSlot._id;
          this.isSuccess = true;
          this.productService.rescheduleMentorship(this.selectedSlot).toPromise()
            .then(res => {
              setTimeout(() => {
                this.isSuccess = false;
                this.refreshlist();
                this.alertNotificationService.toastAlertSuccess('Schedule Changed.');
                this.modalService.dismissAll()
              }, 5000)
            }).catch(err => {
              this.alertNotificationService.alertError(err)
            })
        }
      }).catch(err => console.log(err))
  }

  iscreatingwebinar = false
  createwebinar(sc: Scheduledata) {
    var data = {
      id: sc._id,
      start_time: sc.start_time
    }
    this.alertNotificationService.alertCustomMsg("are you sure you want to create webinar?")
      .then(result => {
        if (result.isConfirmed) {
          this.iscreatingwebinar = true
          if (sc.type == 'COURSE') {
            this.CourseService.createwebinar(data, 'Course').toPromise()
              .then(res => {
                this.iscreatingwebinar = false
                this.refreshlist()
                this.alertNotificationService.toastAlertSuccess('Webinar Created.')
              }).catch(err => this.alertNotificationService.alertError(err))
          } else if (sc.service_type == 'Live Market Practice') {
            this.CourseService.createwebinar(data, 'LiveMarketPractice').toPromise()
              .then(res => {
                this.iscreatingwebinar = false
                this.refreshlist()
                this.alertNotificationService.toastAlertSuccess('Webinar Created.')
              }).catch(err => this.alertNotificationService.alertError(err))
          } else if (sc.service_type == 'One to One Mentorship') {
            this.CourseService.createwebinar(data, 'OnetoOneMentorship').toPromise()
              .then(res => {
                this.iscreatingwebinar = false
                this.refreshlist()
                this.alertNotificationService.toastAlertSuccess('Webinar Created.')
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        }
      })
  }

  onDelete1(id) {
    this.alertNotificationService.alertDelete()
      .then(result => {
        if (result.isConfirmed) {
          this.CourseService.deleteHoliday(id).toPromise()
            .then(res => {
              this.refreshlist()
              this.alertNotificationService.toastAlertSuccess('Holiday Deleted Successfully')
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  submitForm() {
    this.CourseService.addHoliday(this.holiday).toPromise()
      .then(res => {
        this.refreshlist()
        this.alertNotificationService.toastAlertSuccess('Holiday Added Successfully')
        this.holiday.date = new Date();
        this.holiday.title = "Holiday";
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  export() {
    var data = [this.upcoming, this.previous, this.allholiday]
    var name = ['Upcoming Schedule', "Past Schedule", "Holidays"]
    this.exportService.createmultiplesheet('Schedule', data, name);
  }
  // frmdatechange() {
  //   this.frmDate = '';
  // }
  // strrangevaluchange() {
  //   this.srtRange = '';
  //   this.toRange = ''
  // }
  today = new Date();
  // year = this.today.getFullYear();
  // month = this.today.getMonth();
  // day = this.today.getDay();
  minDate = moment("12:00 AM", ["h:mm A"]).startOf('day').format('YYYY-MM-DD');
  minDate1 = moment("12:00 AM", ["h:mm A"]).startOf('day').add(1, 'days').format('YYYY-MM-DD');

  maxDate = moment("12:00 AM", ["h:mm A"]).startOf('day').format('YYYY-MM-DD');
  maxDate1 = moment("12:00 AM", ["h:mm A"]).startOf('day').subtract(1, 'days').format('YYYY-MM-DD');
  classNumberFilter = null
  filter() {
    var data = [...this.upcoming]
    // if (this.frmDate) {
    //   data = data.filter(e => moment(e.start_time).format('YYYY-MM-DD') == this.frmDate);
    // }
    if (this.srtRange && !this.toRange) {
      let v = moment(this.today).format('YYYY-MM-DD')
      if (this.srtRange < v) {
        this.alertNotificationService.alertError('Do not Select Past date');
        this.srtRange = v;
      }
      data = data.filter(e => moment(e.start_time).format('YYYY-MM-DD') == this.srtRange);
    }
    if (this.toRange && this.toRange) {
      if (this.toRange < this.srtRange) {
        this.alertNotificationService.alertError('Do not Select Past date');
        this.toRange = ''
      }
      data = data.filter(e => moment(e.start_time).format('YYYY-MM-DD') >= this.srtRange && moment(e.start_time).format('YYYY-MM-DD') <= this.toRange);
    }
    if (this.servicefilter) {
      data = data.filter(e => e.service_code == this.servicefilter);
    }
    if (this.mentorFilter) {
      data = data.filter(e => e.instructor_id == this.mentorFilter);
    }
    if (this.languageFilter) {
      data = data.filter(e => e.language == this.languageFilter);
    }
    if (this.classNumberFilter) {
      data = data.filter(e => e.class_number == this.classNumberFilter);
    }
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginatorUS;
    this.dataSource.sort = this.sortUS;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  pvsrtRange = '';
  pvendRange = '';
  classNumberFilter1 = null
  filter1() {
    var data = [...this.previous]
    if (this.pvsrtRange && !this.pvendRange) {
      let v = moment(this.today).format('YYYY-MM-DD')
      if (this.pvsrtRange > v) {
        this.alertNotificationService.alertError('Do not Select Future date');
        this.pvsrtRange = v;
      }
      data = data.filter(e => moment(e.start_time).format('YYYY-MM-DD') == this.pvsrtRange);
    }
    if (this.pvsrtRange && this.pvendRange) {
      if (this.pvendRange < this.pvsrtRange) {
        this.alertNotificationService.alertError('Do not Select Future date');
        this.toRange = ''
      }
      data = data.filter(e => moment(e.start_time).format('YYYY-MM-DD') >= this.pvsrtRange && moment(e.start_time).format('YYYY-MM-DD') <= this.pvendRange);
    }

    if (this.servicefilter1) {
      data = data.filter(e => e.service_code == this.servicefilter1);
    }
    if (this.mentorFilter1) {
      data = data.filter(e => e.instructor_id == this.mentorFilter1);
    }
    if (this.languageFilter1) {
      data = data.filter(e => e.language == this.languageFilter1);
    }
    if (this.classNumberFilter1) {
      data = data.filter(e => e.class_number == this.classNumberFilter1);
    }
    this.dataSource1 = new MatTableDataSource(data);
    this.dataSource1.paginator = this.paginatorUS;
    this.dataSource1.sort = this.sortUS;
  }
  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();

    if (this.dataSource1.paginator) {
      this.dataSource1.paginator.firstPage();
    }
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  applyFilter3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();

    if (this.dataSource3.paginator) {
      this.dataSource3.paginator.firstPage();
    }
  }

  addHours(date: Date, hh: number) {
    var d = new Date(date)
    d.setHours(d.getHours() + hh);
    return d
  }

  addMinutes(date: Date, mm: number) {
    var d = new Date(date)
    d.setMinutes(d.getMinutes() + mm);
    return d
  }

  endOfDay(date: Date) {
    var d = new Date(date);
    d.setHours(23, 59, 59);
    return d
  }
  startOfDay(date: Date) {
    var d = new Date(date);
    d.setHours(0, 0, 0);
    return d
  }

  subDays(date: Date, num: number) {
    var d = new Date(date)
    d.setDate(d.getDate() + num);
    return d
  }
  StaffSearchFn(term: string, item: Instructor) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

}


