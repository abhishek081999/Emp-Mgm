import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LeadLanguages } from 'src/app/Enums/staticdata';
import { CampaignPerformanceReport, getLeadLevel, leadLevel } from 'src/app/model/leads.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { LeadsService } from 'src/app/services/leads.service';

@Component({
  selector: 'app-campaign-performance',
  templateUrl: './campaign-performance.component.html',
  styleUrls: ['./campaign-performance.component.scss']
})
export class CampaignPerformanceComponent implements OnInit {

  isLoading = false
  isavailable = true
  allData: any[] = []
  rowsOnPage = 10;
  sortBy = "start date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<CampaignPerformanceReport>;
  LeadLevelDrop: leadLevel[] = []
  alllang = LeadLanguages;
  Lang = null
  Level = null
  campaignNames: string[] = [];
  campaignname = null
  startDate
  endDate
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private leadService: LeadsService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService) {
  }
  allLevel: getLeadLevel[] = []
  ngOnInit(): void {
    this.displayedColumns = ['campaign_name', 'level', 'Seat_Booked', 'Partially_Converted', 'Converted', 'course', 'product', 'insignia', 'bookedamount', 'paymentreceived', 'gst', 'due'];
    this.refresh()
  }

  async refresh() {
    await this.leadService.getLevel().toPromise()
      .then(res => {
        this.allLevel = res as getLeadLevel[];
      }).catch(err => this.alertNotificationService.alertError(err))
    await this.leadService.getCampaignList().toPromise()
      .then(res => {
        this.campaignNames = res as string[];
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  async submit() {
    this.isLoading = true;
    await this.leadService.displaycampagnperformancereports(this.Lang, this.Level, this.campaignname, this.startDate, this.endDate).toPromise()
      .then(res => {
        this.allData = res as any[];
        this.isLoading = false
      }).catch(err => this.alertNotificationService.alertError(err))
    this.dataSource = new MatTableDataSource(this.allData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = this.allData.length;
  }

  onChange() {
    if (this.Lang) {
      this.LeadLevelDrop = [];
      var obj = this.allLevel.find(f => this.Lang == f._id);
      this.LeadLevelDrop = obj ? obj.levels : [];
      if (this.LeadLevelDrop.length == 0) {
        this.Level = null;
      }
    }
  }

  getcount(s) {
    if (this.dataSource)
      return this.dataSource.filteredData.filter(f => f[s]).map(e => e[s]).reduce((acc, value) => Number(acc) + Number(value), 0);
    return 0
  }

  export() {
    var data = this.allData
    if (data.length > 0) {
      this.exportService.exportonesheet(`${this.campaignname}_Leads Report`, data)
    }
    else {
      this.alertNotificationService.alertInfo('Campaign Performance Report is Empty')
    }
  }

  applyFilter(event: Event) {
    try {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } catch (error) {
      this.alertNotificationService.alertInfo('Select Campaign')
    }
  }
}
