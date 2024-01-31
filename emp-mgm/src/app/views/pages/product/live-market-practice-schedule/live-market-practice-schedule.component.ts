import { trigger, state, style, transition, animate } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Languages } from 'src/app/Enums/staticdata';
import { Instructor } from 'src/app/model/instructor.model';
import { LiveMarketPracticeSlots } from 'src/app/model/live-market-practice.model';
import { MentorshipSlotLists } from 'src/app/model/one-to-one-mentorship.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { ExportService } from 'src/app/services/export.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { PackageService } from 'src/app/services/package.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-live-market-practice-schedule',
  templateUrl: './live-market-practice-schedule.component.html',
  styleUrls: ['./live-market-practice-schedule.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LiveMarketPracticeScheduleComponent implements OnInit {


  constructor(
    private productService: PackageService,
    private instructorService: InstructorService,
    private alertNotificationService: AlertNotificationsService,
    private courseService: courseService,
    public modalService: NgbModal,
    private exportService: ExportService) { }

  languages = Languages
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<LiveMarketPracticeSlots>;
  expandedElement: LiveMarketPracticeSlots | null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  mentorshipSlotLists: MentorshipSlotLists[] = [];
  selectedSlot: MentorshipSlotLists[] = [];
  liveMarketPracticeSlots: LiveMarketPracticeSlots[] = [];
  allMentor: Instructor[] = [];
  mentor: string = '';
  mentorshiplanguage: string = '';
  alllanguage = Languages
  isavailable = true
  isLoading = false
  startDate: string = null
  endDate: string = null
  mentorFilter: string = null
  languageFilter: string = null
  selection = new SelectionModel<LiveMarketPracticeSlots>(true, []);
  ngOnInit(): void {
    this.displayedColumns = ['select', 'slot', 'mentor_name', 'language', 'booking_count', 'webinarid', 'join_url', 'account', 'options'];
    this.refresh();
  }

  refresh() {
    this.isLoading = true
    this.productService.getLiveMarketPracticeSlotList().toPromise()
      .then(res => {
        this.mentorshipSlotLists = res
      }).catch(err => this.alertNotificationService.alertError(err))

    this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.allMentor = res
        this.allMentor = this.allMentor.filter(e => e.approved && !e.rejected && e.role != 'admin')
      }).catch(err => this.alertNotificationService.alertError(err))

    this.startDate = new Date().toISOString().substring(0, 10)
    var d = new Date()
    d.setMonth(d.getMonth() + 2);
    this.endDate = d.toISOString().substring(0, 10)

    this.filter()

  }
  disableDates: NgbDateStruct[] = []
  datesSelected: NgbDateStruct[] = [];
  change(value: NgbDateStruct[]) {
    this.datesSelected = value;
  }


  filter() {
    this.productService.getLiveMarketPracticeSlots(this.startDate, this.endDate, this.mentorFilter, this.languageFilter).toPromise()
      .then(res => {
        this.liveMarketPracticeSlots = res['slots']
        this.disableDates = res['bookedSlots']
        this.isavailable = this.liveMarketPracticeSlots.length > 0;
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.liveMarketPracticeSlots);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.liveMarketPracticeSlots.length;

      }).catch(err => this.alertNotificationService.alertError(err))
  }

  delete() {
    this.alertNotificationService.alertCustomMsg('Do you want to delete ' + this.selection.selected.length + ' Slots?')
      .then(result => {
        if (result.isConfirmed) {
          console.log(this.selection.selected)
          var ids = this.selection.selected.filter(f => f._id && f.booking_count == 0).map(e => e._id)
          this.productService.deleteLiveMarketPracticeSlot(ids).toPromise()
            .then(() => {
              this.alertNotificationService.toastAlertSuccess('Slots Deleted')
              this.refresh()
              this.selection.clear()
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }


  createSchedule() {
    if (this.datesSelected.length == 0) {
      this.alertNotificationService.alertInfo('Please Select Dates.')
      return;
    }
    if (this.selectedSlot.length == 0) {
      this.alertNotificationService.alertInfo('Please Select Time Slots.')
      return;
    }
    if (!this.mentor) {
      this.alertNotificationService.alertInfo('Please Select Mentor.')
      return;
    }
    if (!this.mentorshiplanguage) {
      this.alertNotificationService.alertInfo('Please Select Language.')
      return;
    }
    var data = {
      dates: this.datesSelected,
      slots: this.selectedSlot,
      mentor: this.mentor,
      language: this.mentorshiplanguage
    }
    this.productService.createLiveMarketPracticeSlot(data).toPromise()
      .then(() => {
        this.datesSelected = [];
        this.selectedSlot = [];
        this.mentorFilter = null;
        this.filter();
        this.mentor = null;
        this.mentorshiplanguage = null;
        this.alertNotificationService.toastAlertSuccess('Schedule Created');
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  exportDetials(row) {
    var data = []
    if (row.bookings && row.bookings.length > 0) {
      row.bookings.forEach(e => {
        data.push({
          start_time: row.start_time ? new Date(row.start_time) : row.start_time,
          end_time: row.end_time ? new Date(row.end_time) : row.end_time,
          slot: row.slot,
          webinarid: row.webinarid,
          mentor_name: row.mentor_name,
          language: row.language,
          mentor_invid: row.mentor_invid,
          password: row.password,
          account: row.account,
          join_url: row.join_url,
          topic: row.topic,
          student_name: e.student_name,
          student_invid: e.student_invid,
          product_name: e.product_name,
          product_code: e.product_code
        })
      })
      this.exportService.exportonesheet("Live Market Practice", data);
    } else {
      this.alertNotificationService.alertInfo("No Students Booking Found.");
    }
  }

  export() {
    if (this.liveMarketPracticeSlots) {
      this.exportService.exportonesheet("Live Market Practice", this.liveMarketPracticeSlots);
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getPageData() {
    if (this.dataSource)
      return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData)).filter(e => e.booking_count == 0);
    return []
  }

  isEntirePageSelected() {
    return this.getPageData().every((row) => this.selection.isSelected(row));
  }

  isAllSelected() {
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.filteredData.length;
      return numSelected === numRows;
    }
    return false
  }

  masterToggle() {
    this.isEntirePageSelected() ?
      this.selection.deselect(...this.getPageData()) :
      this.selection.select(...this.getPageData());
  }


  checkboxLabel(row?, i?): string {
    if (!row) {
      return `${this.isEntirePageSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${i}`;
  }

  copied() {
    this.alertNotificationService.toastAlertSuccess('Copied to clipboard.')
  }

  createWebinar(row) {
    var data = {
      id: row._id,
      start_time: row.start_time
    }
    this.courseService.createwebinar(data, 'LiveMarketPractice').toPromise()
      .then(() => {
        this.refresh();
        this.alertNotificationService.toastAlertSuccess('Webinar Created.');
      }).catch(err => {
        this.alertNotificationService.alertError(err)
      })
  }

  rescheduleSlot = {
    currentId: '',
    nextbookingid: '',
    date: ''
  }
  isSuccess = false;
  openModal(row, content) {
    this.rescheduleSlot.currentId = row._id;
    this.rescheduleSlot.date = moment(row.start_time).format('YYYY-MM-DD');
    this.rescheduleSlot.nextbookingid = '';


    this.productService.getLiveMarketPracticeSlots(null, null, null, null).toPromise()
      .then(res => {
        this.liveMarketPracticeSlots = res['slots']
      }).catch(err => this.alertNotificationService.alertError(err))

    this.modalService.open(content, { centered: true, size: 'lg', scrollable: true }).result.then(() => {

    }).catch(() => { });
  }

  availableSlots: LiveMarketPracticeSlots[] = []
  ontimechange() {
    this.availableSlots = this.liveMarketPracticeSlots.filter(e => moment(e.start_time).format('YYYY-MM-DD') == this.rescheduleSlot.date);
  }

  reschedule() {
    this.alertNotificationService.alertChanges()
      .then(result => {
        if (result.isConfirmed) {
          this.isSuccess = true;
          this.productService.rescheduleLiveMarketPracticeSlot(this.rescheduleSlot).toPromise()
            .then(() => {
              this.isSuccess = false
              this.filter();
              this.alertNotificationService.toastAlertSuccess('Schedule Changed');
              this.modalService.dismissAll()
            }).catch(err => this.alertNotificationService.alertError(err));
        }
      })
  }

  joinclass(sc: LiveMarketPracticeSlots){
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
