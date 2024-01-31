import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LeadLanguages } from 'src/app/Enums/staticdata';
import { getLeadLevel, leadLevel, Leadreport, Leadstage } from 'src/app/model/leads.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { LeadsService } from 'src/app/services/leads.service';
import { roundOff } from 'src/app/utility/roundOff';

@Component({
  selector: 'app-daily-lead-report',
  templateUrl: './daily-lead-report.component.html',
  styleUrls: ['./daily-lead-report.component.scss'],
  providers: [DatePipe]
})
export class DailyLeadReportComponent implements OnInit {
  allDataFinal1: Leadreport[] = []
  alllang = LeadLanguages;
  LeadTatLang = null
  LeadLevelDrop: leadLevel[] = [];
  LeadTatLevel = null
  allLevel: getLeadLevel[] = [];
  constructor(
    private leadService: LeadsService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    private datePipe: DatePipe
  ) { }
  isLoading = false
  isavailable = true
  allStages: Leadstage[]
  allData: any[] = []
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "start date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[] = [];
  displayedColumns1: string[] = [];
  displayedColumns2: string[] = [];
  dataSource: MatTableDataSource<Leadreport>;
  startDate: string = null
  endDate: string = null
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  async ngOnInit() {
    this.displayedColumns = ['teamname', 'teamlead', 'leadowner', 'uploaded', 'assigned', 'unattempted', 'samedayattempted', 'previousattempted', 'retarget', 'demo_given'];
    this.displayedColumns2 = ['teamname', 'teamlead', 'leadowner', 'uploaded', 'assigned', 'unattempted', 'samedayattempted', 'previousattempted', 'retarget', 'demo_given'];
    await this.leadService.getleadstage().toPromise()
      .then(res => {
        this.allStages = res;
      }).catch(err => this.alertNotificationService.alertError(err))
    this.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    await this.leadService.getLevel().toPromise()
      .then(res => {
        this.allLevel = res as getLeadLevel[];
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  applyFilter(event: Event) {
    try {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } catch (error) {
      this.alertNotificationService.alertInfo('Select Date')
    }
  }

  onchange() {
    if (this.LeadTatLang) {
      this.LeadLevelDrop = [];
      var obj = this.allLevel.find(f => this.LeadTatLang == f._id);
      this.LeadLevelDrop = obj ? obj.levels : [];
      if (this.LeadLevelDrop.length == 0) {
        this.LeadTatLevel = null;
      }
    }
  }
  async submit() {
    this.isLoading = true
    await this.leadService.displaydailyLeadreports(this.startDate, this.endDate, this.LeadTatLang, this.LeadTatLevel).toPromise()
      .then(res => {
        this.allData = res as any[];
        this.dataSource = new MatTableDataSource(this.allData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.allData.length;
        this.displayedColumns = [... new Set(this.displayedColumns2)];
        this.displayedColumns1 = []
        this.allStages.forEach(e => {
          if (e.leadLevelID == this.LeadTatLevel && !this.displayedColumns1.includes(e.name.replace(' ', '_'))) {
            this.displayedColumns1.push(e.name.replace(' ', '_'))
          }
        })
        this.displayedColumns = [... new Set(this.displayedColumns.concat(this.displayedColumns1))];
        this.displayedColumns = [... new Set(this.displayedColumns.concat(['Seat_Booked_Rate', 'Partially_Converted_Rate', 'Convertion_Rate']))]
        this.isavailable = this.allData.length > 0;
        this.isLoading = false
      }).catch(err => this.alertNotificationService.alertError(err));
  }
  getcount(s) {
    if (this.dataSource)
      return this.dataSource.filteredData.filter(f => f[s]).map(e => e[s]).reduce((acc, value) => Number(acc) + Number(value), 0);
    return 0
  }
  getcount1(s) {
    if (this.dataSource) {
      var a = this.dataSource.filteredData.filter(f => f[s]).map(e => e[s])
      return roundOff(a.reduce((acc, value) => Number(acc) + Number(value), 0) / a.length);
    }
    return 0
  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('Daily Lead Report', this.dataSource.filteredData)
    }
    else {
      this.alertNotificationService.alertInfo('Staff Daily Leads Report is Empty')
    }
  }

}