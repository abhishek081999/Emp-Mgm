import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit {

  allStudentsData: Array<User> = [];
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "start date";
  sortOrder = "asc";
  today = Date();

  displayedColumns: string[] = ['invid', 'fullName', 'email', 'telephone', 'alternatenum', 'telegram', 'state', 'city', 'address', 'pincode', 'gstin', 'gender', 'dob'];
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataLength: number;
  isLoading = false

  constructor(
    private userService: UserService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    private router: Router
  ) { }
  ngOnInit() {
    this.refresh()
  }

  refresh() {
    this.isLoading = true
    this.userService.getStudents().toPromise()
      .then(res => {
        this.allStudentsData = res;
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.allStudentsData.reverse());
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.allStudentsData.length;
      })
      .catch(err => this.alertNotificationService.alertError(err));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  export() {
    this.exportService.exportonesheet('Student Details', this.allStudentsData.reverse())
  }

  profileview(invid) {
    this.router.navigateByUrl('/admin/students/students-profile/' + invid)
  }

}
