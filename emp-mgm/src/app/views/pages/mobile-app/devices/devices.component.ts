import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Devices } from 'src/app/model/devices.model';
import { User } from 'src/app/model/user.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { MobileAppService } from 'src/app/services/mobile-app.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {



  allData: Array<Devices> = [];
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Devices>;
  allstudents: User[] = []; //for fethcing the user
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  invid: string;
  DeviceTypes; // for ngModal
  deviceType: string[] = ['Website', 'Android'] //for drop down [item]
  constructor(
    private mobileAppService: MobileAppService,
    private alertNotificationService: AlertNotificationsService,
    private route: ActivatedRoute,
    private userService: UserService,
    private exportService: ExportService
  ) { }

  isavailable = true
  isLoading = false
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.invid = params.get('id');
    });
   
    this.displayedColumns = ['user_name', 'user_invid', 'device_id', 'device_token', 'device_name', 'device_type', 'app_lang', 'version_code', 'version_name'];
    this.refreshlist();
  }

  async refreshlist() {
    this.isLoading = true

    this.userService.getStudents().toPromise()
      .then(res => {
        this.allstudents = res as User[]
      }).catch(err => this.alertNotificationService.alertError(err));

    await this.mobileAppService.getAllDevices().toPromise()
      .then(res => {
        this.allData = res as Devices[]
      }).catch(err => this.alertNotificationService.alertError(err));

    this.isavailable = this.allData.length > 0;
    this.isLoading = false
    this.filter()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  export() {
    this.exportService.exportonesheet('Devices', this.allData.reverse())
  }

  filter() {
    var data = [...this.allData.reverse()]
    if (this.invid) {
      this.invid = this.invid.toUpperCase();
      data = data.filter(e => e.user_invid == this.invid);
    }
    if (this.DeviceTypes) {
      data = data.filter(e => e.device_type == this.DeviceTypes)
    }
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = this.allData.length;
  }
}
