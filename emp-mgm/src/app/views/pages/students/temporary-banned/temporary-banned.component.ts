import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Course } from 'src/app/model/course.model';
import { CourseData } from 'src/app/model/coursedata.model';
import { RegisterCourse } from 'src/app/model/registercourse.model';
import { User } from 'src/app/model/user.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { ExportService } from 'src/app/services/export.service';
import { RegisterCourseService } from 'src/app/services/register-course.service';
import { UserService } from 'src/app/services/user.service';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  regid?: string;
  subtasks?: Task[];
}

@Component({
  selector: 'app-temporary-banned',
  templateUrl: './temporary-banned.component.html',
  styleUrls: ['./temporary-banned.component.scss'],
  providers: [DatePipe]
})
export class TemporaryBannedComponent implements OnInit {

  allBannedRegisteredCourse: RegisterCourse[];
  allRegisteredCourse: RegisterCourse[];
  allCourse: Course[];
  allStudents: User[];
  allCourseData: Array<CourseData> = [];
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "start date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<CourseData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  refundemail: String = '';
  coursecode: String = '';
  user = new User();
  regcourses: Array<RegisterCourse> = []
  task: Task;
  isavailable = false
  isLoading = false
  allComplete: boolean = false;
  coursecodes = []

  constructor(
    private userService: UserService,
    private registerdCourseService: RegisterCourseService,
    private courseService: courseService,
    private datePipe: DatePipe,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService) { }

  ngOnInit() {
    this.displayedColumns = ['id', 'name', 'email', 'phone', 'coursename', 'coursecode', 'startdate', 'expiry_date'];
    this.refreshlist();
  }

  async refreshlist() {
    this.isLoading = true;

    await this.registerdCourseService.getAllRegisterCourse().toPromise()
      .then(res => {
        this.allBannedRegisteredCourse = res as RegisterCourse[];
        this.allRegisteredCourse = res as RegisterCourse[];
        this.allBannedRegisteredCourse = this.allBannedRegisteredCourse.filter((e) => e.temporarybanned)
      }).catch(err => this.alertNotificationService.alertError(err));

    await this.courseService.getAllCourse().toPromise()
      .then(res => {
        this.allCourse = res as Course[];
        this.allCourse.reverse()
        this.coursecodes = this.allCourse.filter(e => e.approved).map(e => e.coursecode)
      }).catch(err => this.alertNotificationService.alertError(err));

    await this.userService.getStudents().toPromise()
      .then(res => this.allStudents = res as User[])
      .catch(err => this.alertNotificationService.alertError(err));

    this.createcoursedata();

  }

  createcoursedata() {
    this.allCourseData = []
    for (var regCourse of this.allBannedRegisteredCourse) {
      var coursedata = new CourseData();
      coursedata.coursecode = regCourse.coursecode;
      coursedata.coursename = regCourse.coursename;
      for (var student of this.allStudents) {
        if (student._id == regCourse.studentid) {
          coursedata.name = student.fullName;
          coursedata.phone = student.telephone;
          coursedata.email = student.email;
          coursedata.id = student.invid;
          break;
        }
      }
      coursedata.products = '';
      coursedata.startdate = regCourse.startingdate;
      coursedata.expiry_date = regCourse.expirydate;
      this.allCourseData.push(coursedata);
    }
    this.isLoading = false;
    this.dataSource = new MatTableDataSource(this.allCourseData.reverse());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = this.allCourseData.length;
  }

  postrefund() {
    this.isavailable = false
    this.regcourses = this.allRegisteredCourse.filter((e) => e.coursecode == this.coursecode.toUpperCase())
    if (this.regcourses.length == 0) {
      this.alertNotificationService.alertInfo('No Course Registration Found');
      this.isavailable = false
    }
    else {
      this.isavailable = true
      var subtasks: Task[] = []
      this.regcourses.forEach(e => {
        subtasks.push({
          name: this.getuser(e.studentid) + ' | ' + e.coursecode +
            ' | Date of Purchase: ' + this.datePipe.transform(e.date, 'MMM d, y') +
            ' | Payment: ' + (e.paymentcomplete ? 'Complete' : 'Not Complete'),
          regid: e._id,
          completed: e.temporarybanned,
          color: 'primary'
        })
      })
      this.task = {
        name: 'Select All',
        completed: false,
        color: 'primary',
        subtasks: subtasks
      };
    }
  }

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => t.completed = completed);
  }

  onbanned(f: NgForm) {
    this.alertNotificationService.alertCustomMsg('Do you want to continue?')
      .then(async (result) => {
        if (result.isConfirmed) {
          var subtask = this.task.subtasks
          var bannedids = []
          var unbannedids = []
          subtask.forEach((e) => {
            if (e.completed) {
              bannedids.push(e.regid);
            }
            else {
              unbannedids.push(e.regid);
            }
          })
          var bandata = {
            banned: true,
            ids: bannedids
          }
          var unbandata = {
            banned: false,
            ids: unbannedids
          }
          if (bannedids.length > 0) {
            await this.registerdCourseService.bannedRegistraion(bandata).toPromise()
              .then(res => { })
              .catch(err => this.alertNotificationService.alertError(err));
          }
          if (unbannedids.length > 0) {
            await this.registerdCourseService.bannedRegistraion(unbandata).toPromise()
              .then(res => { })
              .catch(err => this.alertNotificationService.alertError(err));
          }
          this.alertNotificationService.toastAlertSuccess('Saved Successfully');
          this.refundemail = ''
          this.coursecode = ''
          f.resetForm()
          this.regcourses = []
          this.task.subtasks = []
          this.isavailable = false
          this.refreshlist()
        }
      })
  }




  export() {
    this.exportService.exportonesheet('Banned Registrations', this.allCourseData.reverse());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getuser(id) {
    var s = this.allStudents.filter((e) => e._id == id)[0]
    return s.invid + " | " + s.fullName
  }

}
