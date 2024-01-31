import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { ExportService } from 'src/app/services/export.service';
import { InstructorService } from 'src/app/services/instructor.service';

@Component({
  selector: 'app-class-schedule',
  templateUrl: './class-schedule.component.html',
  styleUrls: ['./class-schedule.component.scss']
})
export class ClassScheduleComponent implements OnInit {
  pageSizeOptions = 25
  allData = []
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  servicecodes = []
  srtRange
  toRange
  servicefilter
  allCourse = []
  allMentor = []
  mentorFilter
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private CourseService: courseService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    private instructorService: InstructorService
  ) { }
  isLoading = false
  async ngOnInit() {
    this.displayedColumns = ['start_date', 'start_day', 'course_name', 'instructor', 'batch_time', 'course_language', 'course_duration', 'part_payment', 'full_payment', 'students'];
    this.isLoading = true
    this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.allMentor = res
        this.allMentor = this.allMentor.filter(e => e.approved)
      }).catch(err => this.alertNotificationService.alertError(err))
    this.CourseService.getAllCourse().toPromise()
      .then(res => {
        this.allCourse = res
        this.servicecodes = this.allCourse.filter(e => e.approved).map(e => e.coursecode)
      }).catch(err => this.alertNotificationService.alertError(err))
    this.filter()
  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('Course Schedule', this.dataSource.filteredData)
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filter() {
    this.isLoading = true
    this.CourseService.getClassSchedule(this.srtRange, this.toRange, this.servicefilter, this.mentorFilter).toPromise()
      .then(res => {
        this.isLoading = false
        this.allData = res as any[];
        this.dataSource = new MatTableDataSource(this.allData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }).catch(err => this.alertNotificationService.alertError(err))
  }

}
