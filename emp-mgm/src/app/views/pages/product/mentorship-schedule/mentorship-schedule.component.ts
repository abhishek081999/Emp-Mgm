import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { Instructor } from 'src/app/model/instructor.model';
import { MentorshipSlotLists, MentorshipSlots } from 'src/app/model/one-to-one-mentorship.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { PackageService } from 'src/app/services/package.service';
import { ExportService } from 'src/app/services/export.service';
import { Languages } from 'src/app/Enums/staticdata';

@Component({
  selector: 'app-mentorship-schedule',
  templateUrl: './mentorship-schedule.component.html',
  styleUrls: ['./mentorship-schedule.component.scss']
})
export class MentorshipScheduleComponent implements OnInit {

  constructor(
    private productService: PackageService,
    private instructorService: InstructorService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService) { }



  languagefilter: any;
  languages = Languages
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<MentorshipSlots>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  mentorshipSlotLists: MentorshipSlotLists[] = [];
  selectedSlot: MentorshipSlotLists[] = [];
  mentorshipSlots: MentorshipSlots[] = [];
  allMentor: Instructor[] = [];
  mentor: string = '';
  mentorshiplanguage: string = '';
  alllanguage = Languages
  isavailable = true
  isLoading = false
  startDate: string = null
  endDate: string = null
  mentorFilter: string = null
  allProduct = []
  productFilter: string = null
  selection = new SelectionModel<MentorshipSlots>(true, []);
  ngOnInit(): void {
    this.displayedColumns = ['select', 'mentor_name', 'slot', 'student_name', 'product_name', 'language'];
    this.refresh();
  }

  refresh() {
    this.isLoading = true
    this.productService.getMentorshipSlotList().toPromise()
      .then(res => {
        this.mentorshipSlotLists = res
      }).catch(err => this.alertNotificationService.alertError(err))

    this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.allMentor = res
        this.allMentor = this.allMentor.filter(e => e.approved && !e.rejected && e.role != 'admin')
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

  datesSelected: NgbDateStruct[] = [];
  disabledSlots: NgbDateStruct[] = [];
  change(value: NgbDateStruct[]) {
    this.datesSelected = value;
  }


  filter() {
    this.productService.getMentorshipSlots(this.startDate, this.endDate, this.mentorFilter, this.productFilter, this.languagefilter).toPromise()
      .then(res => {
        this.mentorshipSlots = res['bookedSlots'];
        this.disabledSlots = res['disabledSlots'];
        this.isavailable = this.mentorshipSlots.length > 0;
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.mentorshipSlots);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.mentorshipSlots.length;
        this.mentorshipSlots.forEach(e => {
          e.bookingDate = e.bookingDate ? new Date(e.bookingDate) : e.bookingDate;
          e.end_time = e.end_time ? new Date(e.end_time) : e.end_time;
          e.start_time = e.start_time ? new Date(e.start_time) : e.start_time;
        })
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  delete() {
    this.alertNotificationService.alertCustomMsg('Do you want to delete ' + this.selection.selected.length + ' Slots?')
      .then(result => {
        if (result.isConfirmed) {
          console.log(this.selection.selected)
          var ids = this.selection.selected.filter(f => f._id && !f.isBooked).map(e => e._id)
          this.productService.deleteMentorshipSlots(ids).toPromise()
            .then(res => {
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
    var data = {
      dates: this.datesSelected,
      slots: this.selectedSlot,
      mentor: this.mentor,
      language: this.mentorshiplanguage
    }
    this.productService.createSlot(data).toPromise()
      .then(res => {
        this.datesSelected = [];
        this.selectedSlot = [];
        this.mentorFilter = null;
        this.productFilter = null;
        this.filter();
        this.mentor = null;
        this.alertNotificationService.toastAlertSuccess('Schedule Created');
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  export() {
    this.exportService.exportonesheet("Mentorship Schedule", this.mentorshipSlots)
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
      return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData)).filter(e => !e.isBooked);
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
}
