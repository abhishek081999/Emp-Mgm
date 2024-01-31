import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Languages } from 'src/app/Enums/staticdata';
import { BookedMentorshipDisplay } from 'src/app/model/one-to-one-mentorship.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { PackageService } from 'src/app/services/package.service';

@Component({
  selector: 'app-mentorship-list',
  templateUrl: './mentorship-list.component.html',
  styleUrls: ['./mentorship-list.component.scss']
})
export class MentorshipListComponent implements OnInit {

  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  dataLength;
  displayedColumns: string[];
  mentorshiplanguage: string = '';
  alllanguage = Languages
  dataSource: MatTableDataSource<BookedMentorshipDisplay>;
  isavailable = true
  isLoading = false
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  bookedSlots: BookedMentorshipDisplay[] = []
  constructor(
    private productService: PackageService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    private router: Router) { }

  ngOnInit(): void {
    this.displayedColumns = ['student_name', 'product_name', 'language', 'slotBooked', 'completedSessions', 'upcomingSessions', 'videoUploaded', 'pendingVideoUpload', 'expiry_date', 'purchase_date'];
    this.refresh();
  }

  refresh() {
    this.productService.getMentorshipBookedSlots().toPromise()
      .then(res => {
        this.bookedSlots = res;
        this.isavailable = this.bookedSlots.length > 0;
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.bookedSlots);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.bookedSlots.length;
        this.bookedSlots.forEach(e => {
          e.expiry_date = e.expiry_date ? new Date(e.expiry_date) : e.expiry_date;
          e.purchase_date = e.purchase_date ? new Date(e.purchase_date) : e.purchase_date;
        })
      }).catch(e => this.alertNotificationService.alertError(e))
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  export() {
    this.exportService.exportonesheet('One to One Mentorship', this.bookedSlots)
  }

  goto(data: BookedMentorshipDisplay) {
    this.router.navigate(['/admin/products/one-to-one-mentorship/' + data._id])
  }

}
