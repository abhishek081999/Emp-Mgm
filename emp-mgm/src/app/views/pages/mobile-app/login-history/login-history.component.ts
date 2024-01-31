import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { LoginHistory } from 'src/app/model/devices.model';
import { User } from 'src/app/model/user.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { MobileAppService } from 'src/app/services/mobile-app.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login-history',
  templateUrl: './login-history.component.html',
  styleUrls: ['./login-history.component.scss']
})
export class LoginHistoryComponent implements OnInit {



  allData: Array<LoginHistory> = [];
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<LoginHistory>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private mobileAppService: MobileAppService,
    private alertNotificationService: AlertNotificationsService,
    private userService: UserService,
    private exportService: ExportService,
    private route: ActivatedRoute

  ) { }
  allstudents: User[] = []; //for fethcing the user
  student: string = ''; // for ngModal
  DeviceTypes; // for ngModal
  deviceType: string[] = ['Website', 'Android'] //for drop down [item]
  isavailable = true
  isLoading = false
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.student = params.get('id')
    })

    this.displayedColumns = ['is_logged_in', 'user_name', 'logged_in_time', 'logged_out_time', 'Total_login_time', 'device_id', 'device_name', 'device_type',];
    this.refreshlist();
  }

  async refreshlist() {
    this.isLoading = true
    await this.mobileAppService.getAllLoginHistory().toPromise()
      .then(res => {
        this.allData = res as LoginHistory[];

      }).catch(err => this.alertNotificationService.alertError(err));
    await this.userService.getStudents().toPromise()
      .then(res => {
        this.allstudents = res as User[]
      }).catch(err => this.alertNotificationService.alertError(err));

    this.filter()

  }

  getLoginHours(start, end) {
    try {
      if (end) {
        return moment(new Date(start)).from(new Date(end), true);
      } else {
        return moment(new Date(start)).fromNow(true);
      }
    } catch (error) {
      return "";
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  LogouAll() {
    this.alertNotificationService.alertCustomMsg('Do you want to logout all user?')
      .then(res => {
        if (res.isConfirmed) {
          var body = {
            logout: 'all'
          }
          this.userService.logutAllUser(body).toPromise().then(res => {
            this.alertNotificationService.toastAlertSuccess("Logout All User Succesfully");
            this.refreshlist()
          })
        }
      })

  }
  export() {
    this.exportService.exportonesheet('Login History', this.allData.reverse())
  }


  filter() {
    var data = [...this.allData.reverse()]
    if (this.student) {
      this.student = this.student.toUpperCase();
      data = data.filter(e => e.user_invid == this.student)
    }
    if (this.DeviceTypes) {
      data = data.filter(e => e.device_type == this.DeviceTypes)
    }
    this.isavailable = data.length > 0;
    this.isLoading = false
    this.dataSource = this.student || this.DeviceTypes ? new MatTableDataSource(data.reverse()) : new MatTableDataSource(data);
    // above conditon for short (the latest login details showing first).
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = data.length;

  }
}
