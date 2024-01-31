import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Leads, Leadstage } from 'src/app/model/leads.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { LeadsService } from 'src/app/services/leads.service';

@Component({
  selector: 'app-callback-list',
  templateUrl: './callback-list.component.html',
  styleUrls: ['./callback-list.component.scss']
})
export class CallbackListComponent implements OnInit {


  allData: Array<Leads> = [];
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Leads>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private leadService: LeadsService,
    private alertNotificationService: AlertNotificationsService,
    private router: Router) { }

  isavailable = true
  isLoading = false
  allStages: Leadstage[] = []
  followupstatus: string[] = []
  async ngOnInit() {
    this.displayedColumns = ['leadowner', 'leadownername', 'leadassigndate', 'leaddate', 'leadstatus', 'callbackdate', 'updatedate', 'name', 'phone', 'email', 'leadsource', 'whatsappnum', 'city', 'state', 'dob', 'gender', 'occupation', 'experience', 'servicetype', 'servicecode', 'servicename', 'comment'];
    await this.leadService.getleadstage().toPromise()
      .then(res => {
        this.allStages = res;
        this.allStages.forEach(e => {
          if (e.followup) {
            this.followupstatus = this.followupstatus.concat(e.status);
          }
        })
        //console.log(this.allstatus)
      }).catch(err => this.alertNotificationService.alertError(err))
    this.refreshlist();
  }

  async refreshlist() {
    this.isLoading = true
    await this.leadService.getallLead().toPromise()
      .then(res => {
        this.allData = res as Leads[]
      }).catch(err => this.alertNotificationService.alertError(err));
      this.allData = this.allData.filter(e => this.followupstatus.includes(e.leadstatus) && e.callbackdate)
    this.isavailable = this.allData.length > 0;
    this.isLoading = false
    this.dataSource = new MatTableDataSource(this.allData.reverse());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = this.allData.length;
  }

  export() {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  leaddisplay(row) {
    this.router.navigate(['/admin/leads/lead-details'],{queryParams:{ id: row._id}})
    this.leadService.leadid = row._id
    // window.open(`/admin/leads/lead-details?id=${row._id}`, '_blank');
  }

}
