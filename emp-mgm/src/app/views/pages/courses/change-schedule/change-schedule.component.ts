import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ClassTimings } from 'src/app/model/course.model';
import { Instructor } from 'src/app/model/instructor.model';
import { MentorshipSlotLists } from 'src/app/model/one-to-one-mentorship.model';
import { ZoomAccount } from 'src/app/model/zoomAccount.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-change-schedule',
  templateUrl: './change-schedule.component.html',
  styleUrls: ['./change-schedule.component.scss'],
  providers: [DatePipe]
})
export class ChangeScheduleComponent implements OnInit {

  @Input() data
  MINDATE
  classtimings: ClassTimings[] = [];
  constructor(
    public activeModal: NgbActiveModal,
    private alertNotificationService: AlertNotificationsService,
    public datepipe: DatePipe,
    private CourseService: courseService,
    private instructorService: InstructorService,
    private settingsService: SettingsService) {
    this.MINDATE = moment(new Date()).startOf('day').add(1, 'days').format('YYYY-MM-DD')
  }

  schedule = new ClassTimings()
  allIns: Instructor[] = []
  allLicence: ZoomAccount[] = []
  allSlots: MentorshipSlotLists[] = []
  bookedSchedules = []

  async ngOnInit() {
    this.CourseService.getschedule(this.data.id).toPromise()
      .then(res => {
        this.schedule = res;
      }).catch(err => this.alertNotificationService.alertError(err))

    await this.CourseService.getcourseschedule(this.data.service_id).toPromise()
      .then(res => {
        this.classtimings = res as ClassTimings[]
      }).catch(err => this.alertNotificationService.alertError(err))

    this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.allIns = res as Instructor[]
        this.allIns = this.allIns.filter(e => e.approved);
      }).catch(err => this.alertNotificationService.alertError(err))

    this.settingsService.getAllZoomAccount().toPromise()
      .then(res => {
        this.allLicence = res as ZoomAccount[]
      }).catch(err => this.alertNotificationService.alertError(err));

    this.CourseService.getclasstimings().toPromise()
      .then(res => {
        this.allSlots = res as MentorshipSlotLists[]
      }).catch(err => this.alertNotificationService.alertError(err));

    await this.CourseService.GetBookedCourseScheduleEvents(this.data.service_id).toPromise()
      .then(res => {
        this.bookedSchedules = res as any[]
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  submitForm() {
    this.checkstatus();
    if (!this.errormsg) {
      this.alertNotificationService.alertChanges()
        .then(async result => {
          if (result.isConfirmed) {
            await this.CourseService.updateSchedule([this.schedule]).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Schedule Updated.');
                this.activeModal.close('Submit')
              }).catch(err => this.alertNotificationService.alertError(err));
          }
        })
    } else {
      this.errormsg = this.errormsg + " Clear All Error."
    }


  }
  errormsg = ""
  checkstatus() {
    try {
      var start = new Date(this.schedule.class_date);
      start.setHours(0, this.schedule.start_slot + 330, 0, 0);
      var end = new Date(this.schedule.class_date);
      end.setHours(0, this.schedule.end_slot + 330, 0, 0);
      this.schedule.start_time = start
      this.schedule.end_time = end
      if (this.classtimings.length > 0) {
        var classtiming = [...this.classtimings]
        var i = classtiming.findIndex(e => e._id === this.schedule._id);
        if (i !== -1) {
          classtiming.splice(i, 1)
        }
      }
      var b = this.bookedSchedules.find(e => (moment(e.start).isBetween(start, end, undefined, '[]') || moment(e.end).isBetween(start, end, undefined, '[]') || moment(start).isBetween(e.start, e.end, undefined, '[]') || moment(end).isBetween(e.start, e.end, undefined, '[]')) && (e.licence && e.licence.length > 0 && e.licence.includes(this.schedule.licence)));
      var ins = this.bookedSchedules.find(e => (moment(e.start).isBetween(start, end, undefined, '[]') || moment(e.end).isBetween(start, end, undefined, '[]') || moment(start).isBetween(e.start, e.end, undefined, '[]') || moment(end).isBetween(e.start, e.end, undefined, '[]')) && (e.instructor_id && e.instructor_id.length > 0 && e.instructor_id.includes(this.schedule.instructor_id)));
      var c = classtiming.filter(e => moment(e.start_time).isBetween(start, end, undefined, '[]') || moment(e.end_time).isBetween(start, end, undefined, '[]') || moment(start).isBetween(e.start_time, e.end_time, undefined, '[]') || moment(end).isBetween(e.start_time, e.end_time, undefined, '[]'));
      var ca = c && c.length > 0 ? c.filter(e => e.licence).map(e => e.licence) : []
      if (this.schedule.start_slot >= this.schedule.end_slot) {
        this.errormsg = "Class Start time cannot be greater than or equal to End Time."
      } else if (b && b.licence && b.licence.length > 0 && b.licence.includes(this.schedule.licence)) {
        this.errormsg = `This Zoom Account is already booked from ${moment(b.start).format('hh:mm A')} to ${moment(b.end).format('hh:mm A')}`
      } else if (ins && ins.instructor_id && ins.instructor_id.length > 0 && ins.instructor_id.includes(this.schedule.instructor_id)) {
        this.errormsg = `Instructor already have a class from ${moment(ins.start).format('hh:mm A')} to ${moment(ins.end).format('hh:mm A')}`
      } else if (c && c.length >= 1 && ca && ca.length >= 1 && ca.includes(this.schedule.licence)) {
        this.errormsg = `This Zoom Account is already booked in this course.`
      } else {
        this.errormsg = '';
      }
    } catch (err) {
      console.error(err);
    }
  }

  StaffSearchFn(term: string, item: Instructor) {
    term = term.toLowerCase();
    return (item?.fullName && item?.fullName.toLowerCase().indexOf(term) > -1) || (item?.invid && item?.invid.toLowerCase().indexOf(term) > -1);
  }

}
