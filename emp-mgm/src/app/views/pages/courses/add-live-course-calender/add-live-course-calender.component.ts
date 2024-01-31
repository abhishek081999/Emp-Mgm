import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassTimings, Course, Holiday, PostponeSchedules } from 'src/app/model/course.model';
import { courseService } from 'src/app/services/course.service';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ZoomAccount } from 'src/app/model/zoomAccount.model';
import { Instructor } from 'src/app/model/instructor.model';
import { SettingsService } from 'src/app/services/settings.service';
import { InstructorService } from 'src/app/services/instructor.service';
import * as moment from 'moment';
import { MentorshipSlotLists } from 'src/app/model/one-to-one-mentorship.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalForPostponeComponent } from '../modal-for-postpone/modal-for-postpone.component';
const colors: any = {
  red: '#FAE3E3',
  blue: '#1e90ff',
  yellow: '#e3bc08',
};

@Component({
  selector: 'app-add-live-course-calender',
  templateUrl: './add-live-course-calender.component.html',
  styleUrls: ['./add-live-course-calender.component.scss']
})
export class AddLiveCourseCalenderComponent implements OnInit {

  id: string;
  code: string;

  constructor(
    private CourseService: courseService,
    private router: Router,
    private route: ActivatedRoute,
    private alertNotificationService: AlertNotificationsService,
    private settingsService: SettingsService,
    private instructorService: InstructorService,
    private modalService: NgbModal) {
  }

  @ViewChild('calendar') calendarEl: ElementRef;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin, listPlugin]; // important!
  MINDATE = ''
  MAXDATE = ''
  allLicence: ZoomAccount[] = []
  allIns: Instructor[] = []
  allSlots: MentorshipSlotLists[] = []

  classtimings: ClassTimings[] = []
  isapproved = false;
  errormsg = ''
  events: EventInput[] = [];
  isupdate = false;
  isduplicate = false;
  allHolidays: Holiday[]
  batch = ''
  errorList = []
  course = new Course();
  async ngOnInit() {
    this.route.queryParamMap.subscribe(query => {
      this.code = query.get('code');
      this.batch = query.get('new');
    })
    if (this.code) {
      this.isduplicate = true;
    }
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });

    this.refresh();
    this.MINDATE = moment(new Date()).startOf('day').add(1, 'days').format('YYYY-MM-DD')
  }
  holidayDates = [];
  async refresh() {

    await this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.allIns = res as Instructor[]
        this.allIns = this.allIns.filter(e => e.approved)
      }).catch(err => this.alertNotificationService.alertError(err))

    await this.settingsService.getAllZoomAccount().toPromise()
      .then(res => {
        this.allLicence = res as ZoomAccount[]
      }).catch(err => this.alertNotificationService.alertError(err));

    await this.CourseService.getclasstimings().toPromise()
      .then(res => {
        this.allSlots = res as MentorshipSlotLists[]
      }).catch(err => this.alertNotificationService.alertError(err));

    this.CourseService.getHoliday().toPromise()
      .then(res => {
        this.allHolidays = res as Holiday[]
        this.holidayDates = this.allHolidays.filter(e => e.date && e.type == HolidayTypeEnum.Company_Holiday).map(e => e.date);
      }).catch(err => this.alertNotificationService.alertError(err))

    if (this.id) {
      this.isupdate = true;
      this.CourseService.getcourseschedule(this.id).toPromise()
        .then(res => {
          this.classtimings = res as ClassTimings[]
          this.previewDates()
        }).catch(err => this.alertNotificationService.alertError(err))

      this.CourseService.getCoursebyId(this.id).toPromise()
        .then(res => {
          this.course = res;
          this.isapproved = this.course.approved;
        }).catch(err => this.alertNotificationService.alertError(err))
    } else {
      this.classtimings = this.CourseService.getcoursesc();
      if (!this.classtimings || this.classtimings.length == 0) {
        this.classtimings = []
        this.classtimings.push(new ClassTimings());
      }
      this.createevents()
    }
  }
  bookedSchedules = []
  updateSchedulesID = []
  updateSchedules = []


  checkstatus(s: ClassTimings, i) {
    var start = new Date(s.class_date);
    start.setHours(0, s.start_slot + 330, 0, 0);
    var end = new Date(s.class_date);
    end.setHours(0, s.end_slot + 330, 0, 0);
    s.start_time = start
    s.end_time = end
    var classtiming = [...this.classtimings]
    classtiming.splice(i, 1)
    var b = this.bookedSchedules.find(e => (moment(e.start).isBetween(start, end, undefined, '[]') || moment(e.end).isBetween(start, end, undefined, '[]') || moment(start).isBetween(e.start, e.end, undefined, '[]') || moment(end).isBetween(e.start, e.end, undefined, '[]')) && (e.licence && e.licence.length > 0 && e.licence.includes(s.licence)));
    var ins = this.bookedSchedules.find(e => (moment(e.start).isBetween(start, end, undefined, '[]') || moment(e.end).isBetween(start, end, undefined, '[]') || moment(start).isBetween(e.start, e.end, undefined, '[]') || moment(end).isBetween(e.start, e.end, undefined, '[]')) && (e.instructor_id && e.instructor_id.length > 0 && e.instructor_id.includes(s.instructor_id)));
    var c = classtiming.filter(e => moment(e.start_time).isBetween(start, end, undefined, '[]') || moment(e.end_time).isBetween(start, end, undefined, '[]') || moment(start).isBetween(e.start_time, e.end_time, undefined, '[]') || moment(end).isBetween(e.start_time, e.end_time, undefined, '[]'));
    var ca = c && c.length > 0 ? c.filter(e => e.licence).map(e => e.licence) : []
    if (s.start_slot >= s.end_slot) {
      this.errorList[i] = true;
      this.errormsg = "Class Start time cannot be greater than or equal to End Time."
    } else if (this.holidayDates.includes(s.class_date)) {
      this.errorList[i] = true;
      this.errormsg = 'Holiday'
    } else if (b && b.licence && b.licence.length > 0 && b.licence.includes(s.licence)) {
      this.errorList[i] = true;
      this.errormsg = `This Zoom Account is already booked from ${moment(b.start).format('hh:mm A')} to ${moment(b.end).format('hh:mm A')}`
    } else if (ins && ins.instructor_id && ins.instructor_id.length > 0 && ins.instructor_id.includes(s.instructor_id)) {
      this.errorList[i] = true;
      this.errormsg = `Instructor already have a class from ${moment(ins.start).format('hh:mm A')} to ${moment(ins.end).format('hh:mm A')}`
    } else if (c && c.length >= 1 && ca && ca.includes(s.licence)) {
      this.errorList[i] = true;
      this.errormsg = `This Zoom Account is already booked in this course.`
    }
    else {
      this.errorList[i] = false;
      this.errormsg = null;
      if (s._id) {
        if (!this.updateSchedulesID.includes(s._id)) {
          this.updateSchedulesID.push(s._id);
        }
      }
    }
  }

  duplicateSchedule(s) {
    var b = JSON.parse(JSON.stringify(s))
    if (b._id) b._id = null;
    this.classtimings.push(b)
    this.errorList.push(false)
    this.checkstatus(b, this.classtimings.length - 1)
  }

  deleteSchedule(i, id) {
    if (id) {
      this.alertNotificationService.alertDelete()
        .then(result => {
          if (result.isConfirmed) {
            this.CourseService.deleteSchedule(id).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Schedule Deleted.')
                this.classtimings.splice(i, 1)
                this.errorList.splice(i, 1)
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    } else {
      this.classtimings.splice(i, 1)
      this.errorList.splice(i, 1)
    }
  }

  addSchedule() {
    this.classtimings.push(new ClassTimings());
    this.errorList.push(false)
  }

  selectedSchedules = []
  async previewDates() {
    if (this.errorList.includes(true)) {
      this.errormsg = this.errormsg + " PLEASE CLEAR ALL ERRORS."
      return
    }
    var i = 0;
    for (var ct of this.classtimings) {
      if (ct.instructor_id && ct.licence && ct.end_slot && ct.start_slot && ct.class_date) {
        var ins = this.allIns.find(e => e._id == ct.instructor_id);
        ct.start_time = new Date(ct.class_date);
        ct.start_time.setHours(0, ct.start_slot + 330, 0, 0);
        ct.end_time = new Date(ct.class_date);
        ct.end_time.setHours(0, ct.end_slot + 330, 0, 0);
        this.selectedSchedules.push({
          start: ct.start_time.toISOString(),
          end: ct.end_time.toISOString(),
          title: `Booking for ${ins?.fullName} at ${this.getTimeRange(ct)}`,
          backgroundColor: 'rgba(1,104,250, .15)',
          borderColor: '#0168fa'
        })
        this.errorList[i] = false;
      } else {
        this.errorList[i] = true;
        this.errormsg = 'All Fields are Mandatory.'
      }
      i++;
    }
    await this.createevents();

    this.events = [...this.events, ...this.selectedSchedules]

  }

  async createevents() {

    await this.CourseService.GetBookedCourseScheduleEvents(this.id).toPromise()
      .then(res => {
        this.bookedSchedules = res as any[]
      }).catch(err => this.alertNotificationService.alertError(err));
    this.events = [...this.bookedSchedules];
    if (this.allHolidays && this.allHolidays.length > 0) {
      this.allHolidays.forEach(e => {
        var a = {
          start: this.startOfDay(new Date(e.date)),
          end: this.endOfDay(new Date(e.date)),
          title: e.title.toString(),
          color: colors.red,
        }
        if (a)
          this.events = this.events.concat(a)
      })
    }

  }

  getTimeRange(ct: ClassTimings) {
    var start_time = moment(ct.start_time).format('hh:mm A');
    var end_time = moment(ct.end_time).format('hh:mm A');
    return `${start_time} - ${end_time}`;
  }

  async submitForm() {
    if (this.errorList.includes(true)) {
      this.errormsg = this.errormsg + " PLEASE CLEAR ALL ERRORS."
      return
    }
    this.CourseService.setcoursesc(this.classtimings);
    if (this.isupdate) {
      this.updateSchedules = this.classtimings.filter(e => this.updateSchedulesID.includes(e._id) || !e._id)
      if (this.updateSchedules.length > 0) {
        this.updateSchedules.forEach(e => {
          e.course_id = this.id;
          e.approved = this.course.approved;
        })
        await this.alertNotificationService.alertChanges()
          .then(async result => {
            if (result.isConfirmed) {
              await this.CourseService.updateSchedule(this.updateSchedules).toPromise()
                .then(res => {
                  this.alertNotificationService.toastAlertSuccess('Schedule Updated.');
                }).catch(err => this.alertNotificationService.alertError(err));
            }
          })
      }
      this.router.navigateByUrl('/admin/courses/edit-live-course/' + this.id)
    } else if (this.isduplicate && this.batch != 'batch') {
      this.router.navigate(['/admin/courses/add-live-course'], { queryParams: { code: this.code } })
    } else if (this.isduplicate && this.batch == 'batch') {
      this.router.navigate(['/admin/courses/add-live-course'], { queryParams: { code: this.code, new: 'batch' } })
    } else {
      this.router.navigateByUrl('/admin/courses/add-live-course')
    }
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
  drop(event: CdkDragDrop<ClassTimings[]>) {
    moveItemInArray(this.classtimings, event.previousIndex, event.currentIndex);
  }
  StaffSearchFn(term: string, item: Instructor) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

  postponeSchedule(data: ClassTimings) {
    var postponeSchedule = new PostponeSchedules();
    postponeSchedule._id = null;
    postponeSchedule.class_date = data.class_date;
    postponeSchedule.course_id = data.course_id;
    postponeSchedule.licenceid = data.licence;
    postponeSchedule.schedule_id = data._id;
    postponeSchedule.instructorid = data.instructor_id;
    postponeSchedule.start_time = data.start_time;
    postponeSchedule.end_time = data.end_time;
    postponeSchedule.end_slot = data.end_slot;
    postponeSchedule.start_slot = data.start_slot;
    postponeSchedule.postpone_class_date = null;
    postponeSchedule.postpone_end_slot = null;
    postponeSchedule.postpone_end_time = null;
    postponeSchedule.postpone_instructor_id = null;
    postponeSchedule.postpone_licence_id = null;
    postponeSchedule.postpone_reason = null;
    postponeSchedule.postpone_start_slot = null;
    postponeSchedule.postpone_start_time = null;
    postponeSchedule.announcement_reason = null;
    postponeSchedule.postpone_reason_type = null;
    postponeSchedule.sendNotification = true;
    const modalRef = this.modalService.open(ModalForPostponeComponent, { size: 'xl', scrollable: true, centered: true, backdrop: 'static' })
    modalRef.componentInstance.data = {
      postponeSchedule: postponeSchedule
    }
  }
}




