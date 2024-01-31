import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Course } from 'src/app/model/course.model';
import { Instructor } from 'src/app/model/instructor.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { ExportService } from 'src/app/services/export.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { SellsService } from 'src/app/services/sells.service';

@Component({
  selector: 'app-course-list-table',
  templateUrl: './course-list-table.component.html',
  styleUrls: ['./course-list-table.component.scss']
})
export class CourseListTableComponent implements OnInit {
  startdate: any;
  enddate: any;
  mentorFilter: any;
  courseCode
  allMentor: Instructor[];
  allCourse: Course[];
  servicecodes: string[];

  constructor(
    private alertNotificationService: AlertNotificationsService,
    private sellsService: SellsService,
    private exportService: ExportService,
    private instructorService: InstructorService,
    private CourseService: courseService
  ) { }

  courseRevenueDetails = []
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Course>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.displayedColumns = ['coursecode', 'coursename', 'teachername', 'courselanguage', 'coursetype', 'coursestartdate', 'numberofstudents', 'rating', 'revenue', 'gst'];
    this.startdate = moment().startOf('month').format('YYYY-MM-DD')
    this.enddate = moment().endOf('month').format('YYYY-MM-DD')
    this.refresh();
  }
  isLoading: boolean
  async refresh() {
    this.isLoading = true
    await this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.allMentor = res
        this.allMentor = this.allMentor.filter(e => e.approved)
      }).catch(err => this.alertNotificationService.alertError(err))
    await this.CourseService.getAllCourse().toPromise()
      .then(res => {
        this.allCourse = res
        this.servicecodes = this.allCourse.filter(e => e.approved).map(e => e.coursecode)
      }).catch(err => this.alertNotificationService.alertError(err))
    this.filter();
  }


  filter() {
    this.sellsService.getCourseRevenueDetails(this.startdate, this.enddate, this.mentorFilter, this.courseCode).toPromise()
      .then(res => {
        this.courseRevenueDetails = res as []
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.courseRevenueDetails);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.courseRevenueDetails.length;
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  export() {
    var data = this.dataSource.filteredData
    if (data.length > 0) {
      this.exportService.exportonesheet('Course Revenue Report', data);
    }
    else {
      this.alertNotificationService.alertInfo('Course Revenue Report is Empty');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  StaffSearchFn(term: string, item: Instructor) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

}