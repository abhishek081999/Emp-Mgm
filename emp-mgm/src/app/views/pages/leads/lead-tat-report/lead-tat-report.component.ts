import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LeadLanguages } from 'src/app/Enums/staticdata';
import { Team } from 'src/app/model/employee.model';
import { getLeadLevel, leadLevel, Leadstage } from 'src/app/model/leads.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { LeadsService } from 'src/app/services/leads.service';
import { EmployeeService } from 'src/app/services/employee.service';
import * as moment from 'moment';

@Component({
  selector: 'app-lead-tat-report',
  templateUrl: './lead-tat-report.component.html',
  styleUrls: ['./lead-tat-report.component.scss']
})
export class LeadTatReportComponent implements OnInit {

  constructor(
    private leadsService: LeadsService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    private employeeService: EmployeeService) { }
  alllang = LeadLanguages
  LeadTatLang = null
  LeadLevelDrop: leadLevel[] = [];
  LeadTatLevel = null
  allLevel: getLeadLevel[] = [];

  allData: any[] = []
  allStages: Leadstage[]
  tatdisplaylabel = []
  tatdisplaylabel1 = []
  tatdisplaylabel2 = []
  displayedColumns1 = []
  displayedColumns2 = []
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  isLoading = false
  startDate: string = null
  endDate: string = null
  allTeams: Team[] = []
  teamname: string = null
  ngOnInit(): void {
    this.displayedColumns = ["_id", "leadownername"]
    this.displayedColumns2 = ["_id", "leadownername"]
    this.tatdisplaylabel1 = ['staff-details']
    this.tatdisplaylabel2 = ['staff-details']
    this.leadsService.getleadstage().toPromise()
      .then(res => {
        this.allStages = res;
      }).catch(err => this.alertNotificationService.alertError(err))

    this.leadsService.getLevel().toPromise()
      .then(res => {
        this.allLevel = res as getLeadLevel[];
      }).catch(err => this.alertNotificationService.alertError(err))

      this.employeeService.getAllTeams('display', Departments.Sales).toPromise()
      .then(res => {
        var teams = res[0]['teams'];
        this.allTeams = teams && teams.length > 0 ? teams : [];
      }).catch(err => this.alertNotificationService.alertError(err))
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
    await this.leadsService.displayLeadstats(this.startDate, this.endDate, this.LeadTatLang, this.LeadTatLevel, this.teamname).toPromise()
      .then(res => {
        this.allData = res as any[];
        this.dataSource = new MatTableDataSource(this.allData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.allData.length;
        this.displayedColumns = [... new Set(this.displayedColumns2)];
        this.tatdisplaylabel1 = [... new Set(this.tatdisplaylabel2)]
        this.displayedColumns1 = []
        this.tatdisplaylabel = []
        this.allStages.forEach(e => {
          if (e.leadLevelID == this.LeadTatLevel) {
            if (!e.islaststage) {
              this.tatdisplaylabel.push(e.name.replace(' ', '_') + '_TAT')
              this.displayedColumns1 = [...this.displayedColumns1,
              e.name.replace(' ', '_') + '_TAT_COUNT',
              // e.name.replace(' ', '_') + '_TAT_MAXIMUM',
              // e.name.replace(' ', '_') + '_TAT_MINIMUM',
              // e.name.replace(' ', '_') + '_TAT_AVERAGE',
              e.name.replace(' ', '_') + '_TAT_IDEAL',
              e.name.replace(' ', '_') + '_TAT_DUE',
              e.name.replace(' ', '_') + '_TAT_OVERDUE']
            }
          }
        })
        this.displayedColumns = [... new Set(this.displayedColumns.concat(this.displayedColumns1))];
        this.tatdisplaylabel1 = [... new Set(this.tatdisplaylabel1.concat(this.tatdisplaylabel))]
        console.log(this.allData)
      }).catch(err => this.alertNotificationService.alertError(err))
    this.isLoading = false


  }
  export() {
    var data = this.dataSource.filteredData
    if (data.length > 0) {
      this.exportService.exportonesheet('Leads Tat Report', data);
    }
    else {
      this.alertNotificationService.alertInfo('Employee leads Tat Report is Empty');
    }
  }

  applyFilter(event: Event) {
    try {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
      //this.calculateamount();
    } catch (error) {
      this.alertNotificationService.alertInfo('Select Filter')
    }
  }
  time(t) {
    if (t > 0) {
      return moment.duration(t, 'milliseconds').humanize(false);   
    } else {
      return null;
    }
  }

  getcount(s) {
    return this.dataSource.filteredData.filter(f => f[s]).map(e => e[s]).reduce((acc, value) => Number(acc) + Number(value), 0);
  }
  getcount1(s) {
    var a = this.dataSource.filteredData.filter(f => f[s]).map(e => e[s])
    return a.reduce((acc, value) => Number(acc) + Number(value), 0) / a.length;
  }

}
