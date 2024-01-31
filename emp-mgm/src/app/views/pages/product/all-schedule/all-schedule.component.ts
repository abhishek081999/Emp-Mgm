import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Scheduledata } from 'src/app/model/course.model';
import { Instructor } from 'src/app/model/instructor.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { ExportService } from 'src/app/services/export.service';
import { InstructorService } from 'src/app/services/instructor.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { Languages } from 'src/app/Enums/staticdata';

@Component({
  selector: 'app-all-schedule',
  templateUrl: './all-schedule.component.html',
  styleUrls: ['./all-schedule.component.scss']
})
export class AllScheduleComponent implements OnInit {
  isLoading = false
  dataSource: MatTableDataSource<Scheduledata>;
  displayedColumns: string[];
  upcoming: Scheduledata[];
  allMentor: Instructor[] = []
  mentorshiplanguage: string = '';
  alllanguage = Languages
  mentorFilter = ''
  srtRange = ''
  minDate = moment("12:00 AM", ["h:mm A"]).startOf('day').format('YYYY-MM-DD');
  minDate1 = moment("12:00 AM", ["h:mm A"]).startOf('day').add(1, 'days').format('YYYY-MM-DD');
  toRange = ''

  @ViewChild('paginatorUS', { static: true }) paginatorUS: MatPaginator;
  @ViewChild('sortUS', { static: true }) sortUS: MatSort;

  constructor(
    private alertNotificationService: AlertNotificationsService,
    private CourseService: courseService,
    private exportService: ExportService,
    private instructorService: InstructorService,


  ) { }
  new: Scheduledata[]
  async ngOnInit() {
    this.displayedColumns = ['instructor_name','language', 'start_time', 'webinar_id', 'webinar_password', 'account', 'join_url'];
    this.upcoming = []
    this.new = []
    this.isLoading = true
    await this.CourseService.calenderschedules().toPromise()
      .then(res => {
        this.upcoming = res['upcoming'];
        this.new = this.upcoming.filter(e => e.service_type == 'One to One Mentorship');
        this.isLoading = false
      }).catch(err => this.alertNotificationService.alertError(err))

    this.filter()
    this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.allMentor = res
        this.allMentor = this.allMentor.filter(e => e.approved)
      }).catch(err => this.alertNotificationService.alertError(err))
  }
  today = new Date();


  filter() {
    var data = [...this.new]

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
    if (this.mentorFilter) {
      data = data.filter(e => e.instructor_id == this.mentorFilter);
    }
    if (this.mentorshiplanguage) {
      data = data.filter(e => e.language == this.mentorshiplanguage);
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

  export() {
    if (this.new) {
      this.exportService.exportonesheet('Schedule', this.new);
    } else {
      this.alertNotificationService.alertInfo("No Data Found For Export.")
    }
  }
  copied() {
    this.alertNotificationService.toastAlertSuccess('Copied to clipboard.')
  }

  joinclass(sc: Scheduledata) {
    var now = new Date()
    if (sc.webinar_id && this.addMinutes(now, 15).getTime() >= new Date(sc.start_time).getTime() && now.getTime() <= new Date(sc.end_time).getTime()) {
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

  addMinutes(date: Date, mm: number) {
    var d = new Date(date)
    d.setMinutes(d.getMinutes() + mm);
    return d
  }
}
