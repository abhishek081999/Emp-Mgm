import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Instructor } from 'src/app/model/instructor.model';
import { LiveMarketPracticeSlots } from 'src/app/model/live-market-practice.model';
import { MentorshipSlots } from 'src/app/model/one-to-one-mentorship.model';
import { PendingProductBookings } from 'src/app/model/package.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { PackageService } from 'src/app/services/package.service';

@Component({
  selector: 'app-pending-bookings',
  templateUrl: './pending-bookings.component.html',
  styleUrls: ['./pending-bookings.component.scss']
})
export class PendingBookingsComponent implements OnInit {

  constructor(
    private productService: PackageService,
    private alertNotificationService: AlertNotificationsService,
    public modalService: NgbModal,
    private exportService: ExportService,
    private instructorService: InstructorService) { }

  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  displayedColumns1: string[];
  dataSource: MatTableDataSource<PendingProductBookings>;
  dataSource1: MatTableDataSource<any>;
  @ViewChild('paginator1', { static: true }) paginator1: MatPaginator;
  @ViewChild('sort1', { static: true }) sort1: MatSort;
  @ViewChild('paginator2', { static: true }) paginator2: MatPaginator;
  @ViewChild('sort2', { static: true }) sort2: MatSort;
  pendingBookings: PendingProductBookings[] = [];
  isavailable = true
  isLoading = false
  startDate: string = null
  mentorFilter: string = null
  productFilter: string = null
  selection = new SelectionModel<any>(true, []);
  allMentor: Instructor[] = [];
  ngOnInit(): void {
    this.displayedColumns = ['studentname', 'contact', 'product_name', 'product_type', 'bookings', 'pruchasedate', 'expiry_date', 'options'];
    this.displayedColumns1 = ['select', 'slot', 'mentor_name', 'booking_count'];
    this.refresh();
  }

  refresh() {
    this.isLoading = true
    this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.allMentor = res
        this.allMentor = this.allMentor.filter(e => e.approved && !e.rejected && e.role != 'admin')
      }).catch(err => this.alertNotificationService.alertError(err))

    this.productService.getpendingproductregistration().toPromise()
      .then(res => {
        this.pendingBookings = res;
        this.isavailable = this.pendingBookings.length > 0;
        this.isLoading = false
        this.filter1()
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  export() {
    if (this.pendingBookings) {
      this.exportService.exportonesheet("Live Market Practice", this.pendingBookings);
    }
  }

  filter() {
    var slots = [...this.availableSlots]
    if (this.startDate) {
      slots = slots.filter(e => moment(e.start_time).format('YYYY-MM-DD') == this.startDate);
    }
    if (this.mentorFilter) {
      slots = slots.filter(e => e.mentor_invid == this.mentorFilter);
    }
    this.dataSource1 = new MatTableDataSource(slots);
    this.dataSource1.paginator = this.paginator2;
    this.dataSource1.sort = this.sort2;
  }

  liveMarketPracticeSlots: LiveMarketPracticeSlots[] = []
  onetooneslots: MentorshipSlots[] = []
  isSuccess = false
  availableSlots = []
  max_select = 0
  selectedbooking = new PendingProductBookings()
  async openModal(row, content) {
    this.selectedbooking = row
    this.availableSlots = []
    if (row.product_type == 'Live Market Practice') {
      await this.productService.getLiveMarketPracticeSlots(moment(new Date()).format('YYYY-MM-DD'), null, null, null).toPromise()
        .then(res => {
          this.liveMarketPracticeSlots = res['slots']
          this.liveMarketPracticeSlots.forEach(e => {
            this.availableSlots.push({
              mentor_invid: e.mentor_invid,
              mentor_name: e.mentor_name,
              start_time: e.start_time,
              slot: e.slot,
              booking_count: e.booking_count,
              _id: e._id
            })

          })
        }).catch(err => this.alertNotificationService.alertError(err))
    } else if (row.product_type == 'One to One Mentorship') {
      await this.productService.getMentorshipSlots(moment(new Date()).format('YYYY-MM-DD'), null, null, null, null).toPromise()
        .then(res => {
          this.onetooneslots = res['bookedSlots'];
          this.onetooneslots.forEach(e => {
            if (!e.isBooked) {
              this.availableSlots.push({
                mentor_invid: e.mentor_invid,
                mentor_name: e.mentor_name,
                start_time: e.start_time,
                slot: e.slot,
                booking_count: 0,
                _id: e._id
              })
            }
          })
        }).catch(err => console.error(err));
    }
    this.max_select = row.no_of_sessions - row.bookings;
    this.filter();
    this.modalService.open(content, { centered: true, size: 'xl', scrollable: true }).result.then((result) => {
      this.selection.clear();
    }).catch((res) => {this.selection.clear(); });
  }

  reschedule() {
    if (this.selection.selected.length != this.max_select) {
      this.alertNotificationService.alertInfo('Select ' + this.max_select + ' Slots')
      return;
    }
    var ids = this.selection.selected.filter(e => e._id).map(f => f._id)
    var data = {
      ids: ids,
      student_id: this.selectedbooking.studentid,
      purchase_id: this.selectedbooking._id,
    }
    if (ids.length != this.max_select) {
      this.alertNotificationService.alertInfo('Select ' + this.max_select + ' Slots')
      return;
    }
    if (this.selectedbooking.product_type == 'Live Market Practice') {
      this.isSuccess = true
      this.productService.bookLiveMarketSlot(data).toPromise()
        .then(
          res => {
            this.alertNotificationService.toastAlertSuccess('Session Booked');
            this.refresh()
            this.modalService.dismissAll()
            this.isSuccess = false
          }).catch((res) => { });
    } else if (this.selectedbooking.product_type == 'One to One Mentorship') {
      this.isSuccess = true
      this.productService.bookMentorshipSlot(data).toPromise()
        .then(
          res => {
            this.isSuccess = false
            this.alertNotificationService.toastAlertSuccess('Session Booked');
            this.refresh()
            this.modalService.dismissAll()
          }).catch((res) => { });
    }
  }


  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();

    if (this.dataSource1.paginator) {
      this.dataSource1.paginator.firstPage();
    }
  }

  isAllSelected() {
    if (this.dataSource1){
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource1.filteredData.length;
      return numSelected === numRows;
    }
    return false
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource1.filteredData);
  }


  checkboxLabel(row?, i?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${i}`;
  }

  typefilter = ''
  filterdata: PendingProductBookings[] = []

  filter1() {
    this.filterdata = [...this.pendingBookings]
    if(this.typefilter){
      this.filterdata = this.filterdata.filter(e=>e.product_type==this.typefilter)
    }
    this.dataSource = new MatTableDataSource(this.filterdata);
    this.dataSource.paginator = this.paginator1;
    this.dataSource.sort = this.sort1;
    this.dataLength = this.filterdata.length;
  }
}
