import { Component, Input, OnInit } from '@angular/core';
import { courseService } from 'src/app/services/course.service';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ZoomAccount } from 'src/app/model/zoomAccount.model';
import { Instructor } from 'src/app/model/instructor.model';
import { SettingsService } from 'src/app/services/settings.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { MentorshipSlotLists } from 'src/app/model/one-to-one-mentorship.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ClassTimings, Course, Holiday, PostponeSchedules } from 'src/app/model/course.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-modal-for-postpone',
  templateUrl: './modal-for-postpone.component.html',
  styleUrls: ['./modal-for-postpone.component.scss']
})
export class ModalForPostponeComponent implements OnInit {

  @Input() data

  errormsg = ''
  allSlots: MentorshipSlotLists[];
  allLicence: ZoomAccount[];
  allIns: Instructor[];
  MINDATE = ''
  classtimings = [];
  bookedSchedules = [];
  holidayDates: any;
  allHolidays: Holiday[];
  allCourses: Course[] = [];

  postponeSchedule: PostponeSchedules = {
    _id: null,
    schedule_id: null,
    class_date: null,
    start_slot: null,
    end_slot: null,
    start_time: null,
    end_time: null,
    instructorid: null,
    licenceid: null,
    course_id: null,
    postpone_class_date: null,
    postpone_start_slot: null,
    postpone_end_slot: null,
    postpone_start_time: null,
    postpone_end_time: null,
    postpone_instructor_id: null,
    postpone_licence_id: null,
    postpone_reason: null,
    type: null,
    announcement_reason: null,
    postpone_reason_type: null,
    sendNotification: true
  }

  constructor(
    private CourseService: courseService,
    private alertNotificationService: AlertNotificationsService,
    private settingsService: SettingsService,
    private instructorService: InstructorService,
    public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.postponeSchedule = this.data.postponeSchedule
    this.refresh()
    this.MINDATE = moment(new Date()).startOf('day').add(1, 'days').format('YYYY-MM-DD')

  }

  async refresh() {
    this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.allIns = res as Instructor[]
        this.allIns = this.allIns.filter(e => e.approved)
      }).catch(err => this.alertNotificationService.alertError(err))

    this.settingsService.getAllZoomAccount().toPromise()
      .then(res => {
        this.allLicence = res as ZoomAccount[]
      }).catch(err => this.alertNotificationService.alertError(err));

    this.CourseService.getclasstimings().toPromise()
      .then(res => {
        this.allSlots = res as MentorshipSlotLists[]
      }).catch(err => this.alertNotificationService.alertError(err));

    this.CourseService.getAllCourse().toPromise()
      .then(res => {
        this.allCourses = res as Course[]
      }).catch(err => this.alertNotificationService.alertError(err));

    this.CourseService.getHoliday().toPromise()
      .then(res => {
        this.allHolidays = res as Holiday[]
        this.holidayDates = this.allHolidays.filter(e => e.date && e.type == HolidayTypeEnum.Company_Holiday).map(e => e.date);
      }).catch(err => this.alertNotificationService.alertError(err))

    this.CourseService.GetBookedCourseScheduleEvents(this.postponeSchedule.course_id).toPromise()
      .then(res => {
        this.bookedSchedules = res as any[]
      }).catch(err => this.alertNotificationService.alertError(err));
    this.CourseService.getcourseschedule(this.postponeSchedule.course_id).toPromise()
      .then(res => {
        this.classtimings = res as ClassTimings[]
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  submitForm() {
    this.checkstatus();
    if (!this.errormsg) {
      this.alertNotificationService.alertCustomMsg('Are you sure you want to Postpone Schedule')
        .then(result => {
          if (result.isConfirmed) {
            this.CourseService.postponeSchedule(this.postponeSchedule).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Postpone Schedule Successfully');
                this.close()
                this.refresh()
              }).catch(err => this.alertNotificationService.alertError(err))

          }
        })
    } else {
      this.errormsg = this.errormsg + " Clear All Error."
    }
  }

  close() {
    this.activeModal.close();
  }


  StaffSearchFn(term: string, item: Instructor) {
    term = term.toLowerCase();
    return (item.fullName && item.fullName.toLowerCase().indexOf(term) > -1) || (item.invid && item.invid.toLowerCase().indexOf(term) > -1);
  }

  checkstatus() {
    try {
      var s = this.postponeSchedule;
      var start = new Date(s.postpone_class_date);
      start.setHours(0, s.postpone_start_slot + 330, 0, 0);
      var end = new Date(s.postpone_class_date);
      end.setHours(0, s.postpone_end_slot + 330, 0, 0);
      s.postpone_start_time = start
      s.postpone_end_time = end
      if (this.classtimings.length > 0) {
        var classtiming = [...this.classtimings]
        var i = this.classtimings.findIndex(e => e._id === s.schedule_id);
        if (i !== -1) {
          classtiming.splice(i, 1)
        }
      }
      var b = this.bookedSchedules.find(e => (moment(e.start).isBetween(start, end, undefined, '[]') || moment(e.end).isBetween(start, end, undefined, '[]') || moment(start).isBetween(e.start, e.end, undefined, '[]') || moment(end).isBetween(e.start, e.end, undefined, '[]')) && (e.licence && e.licence.length > 0 && e.licence.includes(s.postpone_licence_id)));
      var ins = this.bookedSchedules.find(e => (moment(e.start).isBetween(start, end, undefined, '[]') || moment(e.end).isBetween(start, end, undefined, '[]') || moment(start).isBetween(e.start, e.end, undefined, '[]') || moment(end).isBetween(e.start, e.end, undefined, '[]')) && (e.instructor_id && e.instructor_id.length > 0 && e.instructor_id.includes(s.postpone_instructor_id)));
      var c = classtiming.filter(e => moment(e.start_time).isBetween(start, end, undefined, '[]') || moment(e.end_time).isBetween(start, end, undefined, '[]') || moment(start).isBetween(e.start_time, e.end_time, undefined, '[]') || moment(end).isBetween(e.start_time, e.end_time, undefined, '[]'));
      var ca = c && c.length > 0 ? c.filter(e => e.licence).map(e => e.licence) : []
      if (s.postpone_start_slot >= s.postpone_end_slot) {
        this.errormsg = "Class Start time cannot be greater than or equal to End Time."
      } else if (this.holidayDates.includes(s.postpone_class_date)) {
        this.errormsg = 'Holiday'
      } else if (b && b.licence && b.licence.length > 0 && b.licence.includes(s.postpone_licence_id)) {
        this.errormsg = `This Zoom Account is already booked from ${moment(b.start).format('hh:mm A')} to ${moment(b.end).format('hh:mm A')}`
      } else if (ins && ins.instructor_id && ins.instructor_id.length > 0 && ins.instructor_id.includes(s.postpone_instructor_id)) {
        this.errormsg = `Instructor already have a class from ${moment(ins.start).format('hh:mm A')} to ${moment(ins.end).format('hh:mm A')}`
      } else if (c && c.length >= 1 && ca && ca.includes(s.postpone_licence_id)) {
        this.errormsg = `This Zoom Account is already booked in this course.`
      }
      else {
        this.errormsg = null;
      }
    } catch (err) {
      console.error(err);
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

}
