import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { courseService } from 'src/app/services/course.service';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { Instructor } from 'src/app/model/instructor.model';
import { ExportService } from 'src/app/services/export.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalForPostponeComponent } from '../modal-for-postpone/modal-for-postpone.component';
import { Course, PostponeSchedules } from 'src/app/model/course.model';


@Component({
  selector: 'app-postpone-schedule',
  templateUrl: './postpone-schedule.component.html',
  styleUrls: ['./postpone-schedule.component.scss']
})
export class PostponeScheduleComponent implements OnInit {
  isLoading: boolean;
  allIns: Instructor[];
  getAllSchedule: any;
  dataSource: MatTableDataSource<any>;
  dataLength;

  isavailable: boolean;
  sid: any;
  allCourses: Course[] = [];
  coursesFilter = null;

  constructor(
    private CourseService: courseService,
    private alertNotificationService: AlertNotificationsService,
    private instructorService: InstructorService,
    private exportService: ExportService,
    private modalService: NgbModal) {
  }
  instructors = null
  startDate = null
  endDate = null
  StatusFilter = null

  Status = [
    'Approve',
    'Pending'
  ];
  displayedColumns: string[];

  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.displayedColumns = ['course_name', 'approved', 'start_time', 'postpone_start_time', 'end_time', 'postpone_end_time', 'instructor_name', 'postponeinstructor_name', 'zoom_name', 'postponezoom_name', 'postpone_reason_type', 'postpone_reason', 'announcement_reason', 'sendNotification', 'option'];
    this.refresh()
    this.ScheduleFilter()
  }


  async refresh() {
    await this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.allIns = res as Instructor[]
        this.allIns = this.allIns.filter(e => e.approved)
      }).catch(err => this.alertNotificationService.alertError(err))
    this.CourseService.getAllCourse().toPromise()
      .then(res => {
        this.allCourses = res as Course[]
      }).catch(err => this.alertNotificationService.alertError(err));

  }

  ScheduleFilter() {
    this.isLoading = true
    this.CourseService.getPostponeSchedule(this.startDate, this.endDate, this.coursesFilter, this.instructors, this.StatusFilter).toPromise()
      .then(res => {
        this.getAllSchedule = res
        this.isavailable = this.getAllSchedule.length > 0;
        this.isLoading = false
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.getAllSchedule);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.getAllSchedule.length;
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  Approve(id) {
    this.alertNotificationService.alertCustomMsg('Are you sure you want to Approve ?')
      .then(result => {
        if (result.isConfirmed) {
          var data = {
            _id: id._id
          }
          this.CourseService.approvelpostponeschedule(data).toPromise()
            .then(() => {
              this.alertNotificationService.toastAlertSuccess('Postpone Schedules Approve Successfully');
              this.ScheduleFilter()
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })

  }
  editSchedule(data) {
    var postponeSchedule = new PostponeSchedules();
    postponeSchedule._id = data._id;
    postponeSchedule.class_date = data.class_date;
    postponeSchedule.course_id = data.course_id;
    postponeSchedule.licenceid = data.licenceid;
    postponeSchedule.schedule_id = data.schedule_id;
    postponeSchedule.instructorid = data.instructorid;
    postponeSchedule.start_time = data.start_time;
    postponeSchedule.end_time = data.end_time;
    postponeSchedule.end_slot = data.end_slot;
    postponeSchedule.start_slot = data.start_slot;
    postponeSchedule.postpone_class_date = data.postpone_class_date;
    postponeSchedule.postpone_end_slot = data.postpone_end_slot;
    postponeSchedule.postpone_end_time = data.postpone_end_time;
    postponeSchedule.postpone_instructor_id = data.postpone_instructor_id;
    postponeSchedule.postpone_licence_id = data.postpone_licence_id;
    postponeSchedule.postpone_reason = data.postpone_reason;
    postponeSchedule.postpone_start_slot = data.postpone_start_slot;
    postponeSchedule.postpone_start_time = data.postpone_start_time;
    postponeSchedule.announcement_reason = data.announcement_reason;
    postponeSchedule.postpone_reason_type = data.postpone_reason_type;
    postponeSchedule.sendNotification = data.sendNotification;
    const modalRef = this.modalService.open(ModalForPostponeComponent, { size: 'xl', scrollable: true, centered: true, backdrop: 'static' })
    modalRef.componentInstance.data = {
      postponeSchedule: postponeSchedule
    }
    modalRef.result.then((result) => {
      this.ScheduleFilter();
    }).catch(err => { })
  }

  deleteSchedule(id) {
    this.alertNotificationService.alertCustomMsg('Are you sure you want to delete ?')
      .then(result => {
        if (result.isConfirmed) {
          this.CourseService.deletepostponeschedule(id).toPromise()
            .then(() => {
              this.alertNotificationService.toastAlertSuccess('Postpone Schedules Deleted Successfully');
              this.ScheduleFilter()
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }
  Export() {
    var data = this.dataSource.filteredData
    if (data.length > 0) {
      data.forEach(e => {
        e.start_time = e.start_time ? new Date(e.start_time) : e.start_time;
        e.end_time = e.end_time ? new Date(e.end_time) : e.end_time;
        e.postpone_end_time = e.postpone_end_time ? new Date(e.postpone_end_time) : e.postpone_end_time;
        e.postpone_start_time = e.postpone_start_time ? new Date(e.postpone_start_time) : e.postpone_start_time;
        e.approveAt = e.approveAt ? new Date(e.approveAt) : e.approveAt;
      });
      this.exportService.exportonesheet('Postpone Schedule Report', data);
    }
    else {
      this.alertNotificationService.alertInfo('Postpone Schedule Report is Empty');
    }
  }

  filtersearch(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  StaffSearchFn(term: string, item: Instructor) {
    term = term.toLowerCase();
    return (item.fullName && item.fullName.toLowerCase().indexOf(term) > -1) || (item.invid && item.invid.toLowerCase().indexOf(term) > -1);
  }

  CourseSearchFn(term: string, item: Course) {
    term = term.toLowerCase();
    return item.coursename.toLowerCase().indexOf(term) > -1 || item.coursecode.toLowerCase().indexOf(term) > -1 || (item.short_name && item.short_name.toLowerCase().indexOf(term) > -1);
  }
}
