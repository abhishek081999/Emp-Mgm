import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ZoomAccount } from 'src/app/model/zoomAccount.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-zoom-settings',
  templateUrl: './zoom-settings.component.html',
  styleUrls: ['./zoom-settings.component.scss']
})
export class ZoomSettingsComponent implements OnInit {


  zoomacc: ZoomAccount = {
    _id: null,
    active: false,
    AccountID: null,
    ClientID: null,
    VerificationToken: null,
    ClientSecret: null,
    createdAt: new Date(),
    modifiedAt: new Date(),
    createdBy: null,
    modifiedBy: null,
    parentID: null,
    isParent: false,
    email: null,
    name: null,
    hostID: null,
    usedFor: null
  }
  allZoomData: Array<ZoomAccount> = [];
  allParentData: Array<ZoomAccount> = [];
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<ZoomAccount>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private settingsServices: SettingsService,
    private alertNotificationService: AlertNotificationsService,
  ) { }

  isavailable = true
  isLoading = false
  ngOnInit() {
    this.displayedColumns = ["usedFor", "name", "email", "hostID", "isParent", "parentID", "active", "createdBy", "modifiedBy", "options"];
    this.refreshlist();
  }

  async refreshlist() {
    this.isLoading = true
    await this.settingsServices.getAllZoomAccount().toPromise()
      .then(res => {
        this.allZoomData = res as ZoomAccount[]
        this.allParentData = this.allZoomData.filter(e=>e.isParent);
      }).catch(err => this.alertNotificationService.alertError(err));

    this.isavailable = this.allZoomData.length > 0;
    this.isLoading = false
    this.dataSource = new MatTableDataSource(this.allZoomData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = this.allZoomData.length;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  submitForm(f: NgForm) {
    this.settingsServices.AddZoomAccount(this.zoomacc).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess("Zoom Details Saved");
        f.resetForm();
        this.refreshlist();
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  editZoomDetails(data) {
    this.zoomacc = data;
  }

  toggleZoomStatus(data: ZoomAccount) {
    if (data.active) {
      data.active = false;
    } else {
      data.active = true;
    }
    this.settingsServices.toggleZoomAccountStatus(data).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess("Successful");
        this.refreshlist();
      }).catch(err => this.alertNotificationService.alertError(err));
  }

}
