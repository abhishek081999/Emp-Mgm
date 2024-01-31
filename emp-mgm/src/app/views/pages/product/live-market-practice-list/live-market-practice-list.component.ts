import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Languages } from 'src/app/Enums/staticdata';
import { Instructor } from 'src/app/model/instructor.model';
import { LiveMarketPracticeBookings, LiveMarketPracticeSlots } from 'src/app/model/live-market-practice.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { PackageService } from 'src/app/services/package.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-live-market-practice-list',
  templateUrl: './live-market-practice-list.component.html',
  styleUrls: ['./live-market-practice-list.component.scss']
})
export class LiveMarketPracticeListComponent implements OnInit {


  constructor(
    private productService: PackageService,
    private instructorService: InstructorService,
    private alertNotificationService: AlertNotificationsService,
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
  dataSource: MatTableDataSource<LiveMarketPracticeBookings>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  allLiveMarketBookings: LiveMarketPracticeBookings[] = [];
  isavailable = true
  isLoading = false
  startDate: string = null
  endDate: string = null
  mentorFilter: string = null
  allMentor: Instructor[] = [];
  allProduct = []
  productFilter: string = null
  languageFilter: string = null

  ngOnInit(): void {
    this.displayedColumns = ['student_name', 'product_name', 'language', 'mentor_name','phone','whatsapp_number', 'slot', 'webinarid', 'join_url', 'account', 'options'];
    this.refresh();
  }

  refresh() {
    this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.allMentor = res
      }).catch(err => this.alertNotificationService.alertError(err))

    this.productService.getallProduct().toPromise()
      .then(res => {
        this.allProduct = res;
      }).catch(err => this.alertNotificationService.alertError(err))
    this.startDate = new Date().toISOString().substring(0, 10)
    var d = new Date()
    d.setMonth(d.getMonth() + 2);
    this.endDate = d.toISOString().substring(0, 10)
    this.filter()
  }

  filter() {
    this.isLoading = true
    this.productService.getBookedLiveMarketPracticeSlot(this.startDate, this.endDate, this.mentorFilter, this.productFilter, this.languageFilter).toPromise()
      .then(res => {
        this.allLiveMarketBookings = res
        this.isavailable = this.allLiveMarketBookings.length > 0;
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.allLiveMarketBookings);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.allLiveMarketBookings.length;

      }).catch(err => this.alertNotificationService.alertError(err))
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  copied() {
    this.alertNotificationService.toastAlertSuccess('Copied to clipboard.')
  }
  export() {
    if (this.allLiveMarketBookings) {
      this.exportService.exportonesheet("Live Market Practice", this.allLiveMarketBookings);
    }
  }

  selectedSlot = {
    currentId: '',
    nextbookingid: '',
    student_id: '',
    purchase_id: '',
    date: ''
  }
  isSuccess = false;
  liveMarketPracticeSlots: LiveMarketPracticeSlots[] = []
  openModal(row, content) {
    this.selectedSlot.currentId = row._id;
    this.selectedSlot.date = moment(row.start_time).format('YYYY-MM-DD');
    this.selectedSlot.nextbookingid = '';
    this.selectedSlot.student_id = row.bookings.student_id;
    this.selectedSlot.purchase_id = row.bookings.purchase_id;

    this.productService.getLiveMarketPracticeSlots(null, null, null, null).toPromise()
      .then(res => {
        this.liveMarketPracticeSlots = res['slots']
      }).catch(err => this.alertNotificationService.alertError(err))

    this.modalService.open(content, { centered: true, size: 'lg', scrollable: true }).result.then((result) => {

    }).catch((res) => { });
  }

  availableSlots: LiveMarketPracticeSlots[] = []
  ontimechange() {
    this.availableSlots = this.liveMarketPracticeSlots.filter(e => moment(e.start_time).format('YYYY-MM-DD') == this.selectedSlot.date);
  }

  reschedule() {
    this.alertNotificationService.alertChanges()
      .then(result => {
        if (result.isConfirmed) {
          this.isSuccess = true;
          this.productService.rescheduleLiveMarketPracticeStudent(this.selectedSlot).toPromise()
            .then(res => {
              this.isSuccess = false
              this.filter();
              this.alertNotificationService.toastAlertSuccess('Schedule Changed');
              this.modalService.dismissAll()
            }).catch(err => this.alertNotificationService.alertError(err));
        }
      })
  }

  joinclass(sc: LiveMarketPracticeBookings){
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
