import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Instructor } from 'src/app/model/instructor.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { ExportService } from 'src/app/services/export.service';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { InstructorService } from 'src/app/services/instructor.service';
import { Holiday } from 'src/app/model/course.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import * as moment from 'moment';

@Component({
  selector: 'app-trainer-webinar',
  templateUrl: './trainer-webinar.component.html',
  styleUrls: ['./trainer-webinar.component.scss']
})
export class TrainerWebinarComponent implements OnInit {


  fromDate: NgbDate | null;
  toDate: NgbDate | null;




  constructor(
    private CourseService: courseService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
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

  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;

  @ViewChild('paginatorUS', { static: false }) paginatorUS!: MatPaginator;
  @ViewChild('sortUS', { static: false }) sortUS!: MatSort;

  events: EventInput[] = [];
  @ViewChild('externalEvents', { static: true }) externalEvents: ElementRef;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin, listPlugin]; 
  allMentor: Instructor[] = []
  mentorFilter = ''
  srtRange = ''
  toRange = ''

  
  
  async ngOnInit() {
    this.displayedColumns = ["service_code", "service_start_date", "instructor_id", "start_time"];
    this.isLoading = true
    this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.allMentor = res
        this.allMentor = this.allMentor.filter(e => e.approved)
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  isLoading = false
  filter() {
    this.isLoading = true
    this.events = [];
    this.CourseService.instructorschedule(this.mentorFilter).toPromise()
      .then(res => {
        this.events = res['events']
        this.dataSource = new MatTableDataSource(this.events);
        this.dataSource.paginator = this.paginatorUS;
        this.dataSource.sort = this.sortUS;
      }).catch(err => this.alertNotificationService.alertError(err))
    this.isLoading = false


  }

  today = new Date();
  minDate = moment("12:00 AM", ["h:mm A"]).startOf('day').format('YYYY-MM-DD');
  minDate1 = moment("12:00 AM", ["h:mm A"]).startOf('day').add(1, 'days').format('YYYY-MM-DD');

  maxDate = moment("12:00 AM", ["h:mm A"]).startOf('day').format('YYYY-MM-DD');
  maxDate1 = moment("12:00 AM", ["h:mm A"]).startOf('day').subtract(1, 'days').format('YYYY-MM-DD');
  classNumberFilter = null
  filter1() {
    var data = [...this.events]
    // if (this.srtRange) {
    //   data = data.filter(e => moment(e.start_time).format('YYYY-MM-DD') == this.srtRange);
    // }
    // if (this.toRange) {
    //   data = data.filter(e => moment(e.end).format('YYYY-MM-DD') == this.toRange);
    // }
    if (this.srtRange && !this.toRange) {
      let v = moment(this.today).format('YYYY-MM-DD')
      if (this.srtRange < v) {
        this.alertNotificationService.alertError('Do not Select Past date');
        this.srtRange = v;
      }
      data = data.filter(e => moment(e.start).format('YYYY-MM-DD') == this.srtRange);
    }
    if (this.toRange && this.toRange) {
      if (this.toRange < this.srtRange) {
        this.alertNotificationService.alertError('Do not Select Past date');
        this.toRange = ''
      }
      data = data.filter(e => moment(e.start).format('YYYY-MM-DD') >= this.srtRange && moment(e.start).format('YYYY-MM-DD') <= this.toRange);
    }
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginatorUS;
    this.dataSource.sort = this.sortUS;
  }

  export() {
    var data = [this.events]
    var name = ['Schedule']
    this.exportService.createmultiplesheet('Schedule', data, name);
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
    return (item.fullName && item.fullName.toLowerCase().indexOf(term) > -1) || (item.invid && item.invid.toLowerCase().indexOf(term) > -1);
  }

  
}

