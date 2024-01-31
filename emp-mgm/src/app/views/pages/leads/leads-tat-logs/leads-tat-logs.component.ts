import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LeadLanguages } from 'src/app/Enums/staticdata';
import { Employee, Team } from 'src/app/model/employee.model';
import { Leadstage, getLeadLevel, leadLevel } from 'src/app/model/leads.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';
import { LeadsService } from 'src/app/services/leads.service';
import { LeadChangeLogComponent } from '../lead-change-log/lead-change-log.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { courseService } from 'src/app/services/course.service';
import { Holiday } from 'src/app/model/course.model';


@Component({
  selector: 'app-leads-tat-logs',
  templateUrl: './leads-tat-logs.component.html',
  styleUrls: ['./leads-tat-logs.component.scss']
})
export class LeadsTatLogsComponent implements OnInit {
  isLoading = false
  isavailable = true
  allData: any[] = []
  rowsOnPage = 10;
  sortBy = "start date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  LeadLevelDrop: leadLevel[] = []
  alllang = LeadLanguages;
  Lang = null
  Level = null
  startDate
  endDate
  isTimerStopped = false;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private leadService: LeadsService,
    private alertNotificationService: AlertNotificationsService,
    private employeeService: EmployeeService,
    private exportService: ExportService,
    private router: Router,
    private modalService: NgbModal,
    private CourseService: courseService) {
  }
  allLevel: getLeadLevel[] = []
  allStaff: Employee[] = []
  allTeams: Team[] = []
  LeadStage: Leadstage[] = []
  allStages: Leadstage[] = []
  offSet = 0;
  tatFilter = null;
  stageFilter = null;
  leadownerFilter = null;
  teamFilter = null;
  allholiday: Holiday[] = []
  tat_start_time = new Date();
  tat_end_time = new Date();
  ngOnInit(): void {
    this.isTimerStopped = new Date().getDay() == 0
    this.displayedColumns = ['teamName', 'teamLeadName', 'leadOwner', 'studentName', 'stageName', 'start', 'end', 'ctt', 'is_active', 'logs'];
    this.refresh();
    this.tat_start_time = moment().startOf('day').toDate();
    this.tat_end_time = moment().endOf('day').toDate();
  }

  async refresh() {
    var time = null
    this.CourseService.getHoliday().toPromise()
      .then(res => {
        this.allholiday = res as Holiday[];
        this.allholiday.forEach(e => {
          if (e.type == HolidayTypeEnum.Company_Holiday && moment(e.date).isSame(new Date(), 'day')) {
            this.isTimerStopped = true;
          }
        });
      }).catch(err => this.alertNotificationService.alertError(err));
    await this.leadService.getCurrentTime().toPromise()
      .then(res => {
        time = new Date(res['time'])
        this.tat_start_time = new Date(res['tat_start_time']);
        this.tat_end_time = new Date(res['tat_end_time']);
      }).catch(err => time = new Date())
    this.offSet = new Date().getTime() - (time ? time.getTime() : new Date().getTime());
    await this.leadService.getLevel().toPromise()
      .then(res => {
        this.allLevel = res as getLeadLevel[];
      }).catch(err => this.alertNotificationService.alertError(err))
    this.employeeService.getAllEmployees('all', Departments.Sales, null).toPromise()
      .then(res => {
        this.allStaff = res
      }).catch(err => this.alertNotificationService.alertError(err));
    await this.employeeService.getAllTeams('display', Departments.Sales).toPromise()
      .then(res => {
        var teams = res[0]['teams'];
        this.allTeams = teams && teams.length > 0 ? teams : [];
      }).catch(err => this.alertNotificationService.alertError(err))
    this.leadService.getleadstage().toPromise()
      .then(res => {
        this.allStages = res;
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  async submit() {
    this.isLoading = true;
    var leadowner = [];
    if (this.leadownerFilter) {
      leadowner = [this.leadownerFilter]
    }
    await this.leadService.getLeadTatLog(this.startDate, this.endDate, this.stageFilter, leadowner, this.Lang, this.Level, this.teamFilter).toPromise()
      .then(res => {
        this.allData = res as any[];
        this.allData.forEach(e => {
          this.timeElapsed(e);
        })
        this.isLoading = false
      }).catch(err => this.alertNotificationService.alertError(err))
    if (this.tatFilter) {
      this.leadFilter()
    } else {
      this.dataSource = new MatTableDataSource(this.allData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataLength = this.allData.length;
      if (!this.displayedColumns.includes('logs')) {
        this.displayedColumns.push('logs');
      }
    }
  }

  leadFilter() {
    var data = [...this.allData]
    if (this.tatFilter) {
      switch (this.tatFilter) {
        case 'overdue':
          data = data.filter(e => e['ctt'] < 0)
          break
        case 'intoday':
          data = data.filter(e => e['ctt'] >= 0 && e['ctt'] <= 24 * 60)
          break
        case 'inoneday':
          data = data.filter(e => e['ctt'] >= 0 && e['ctt'] <= 48 * 60)
          break
        case 'intwoday':
          data = data.filter(e => e['ctt'] >= 0 && e['ctt'] <= 72 * 60)
          break
        case 'inthreeday':
          data = data.filter(e => e['ctt'] >= 0 && e['ctt'] <= 96 * 60)
          break
        case 'infourday':
          data = data.filter(e => e['ctt'] >= 0 && e['ctt'] <= 120 * 60)
          break
        case 'infiveday':
          data = data.filter(e => e['ctt'] >= 0 && e['ctt'] <= 144 * 60)
          break
        case 'ideal':
          data = data.filter(e => e['ctt'] > 144 * 60)
          break
        default:
          break
      }
      //console.log(data)
    }
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = data.length;
    if (!this.displayedColumns.includes('logs')) {
      this.displayedColumns.push('logs');
    }
  }

  onChange() {
    if (this.Lang) {
      this.LeadLevelDrop = [];
      var obj = this.allLevel.find(f => this.Lang == f._id);
      this.LeadLevelDrop = obj ? obj.levels : [];
      if (this.LeadLevelDrop.length == 0) {
        this.Level = null;
        this.stageFilter = null;
      }
    }
    if (this.Level && this.Lang) {
      this.LeadStage = []
      var newstages = this.LeadLevelDrop.find(f => f._id == this.Level);
      this.LeadStage = newstages ? newstages.stages : [];
      if (this.LeadStage.length == 0) {
        this.stageFilter = null;
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
      this.exportService.exportonesheet(`Lead Tat Report`, data)
    }
    else {
      this.alertNotificationService.alertInfo('Lead Tat Report is Empty')
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
      console.log(error)
    }
  }

  leaddisplay(row) {
    this.router.navigate(['/admin/leads/lead-details'], { queryParams: { id: row.lead_id } })
    this.leadService.leadid = row.lead_id
    // window.open(`/admin/leads/lead-details?id=${row._id}`, '_blank');
  }

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

  changehistory(id) {
    const modalRef = this.modalService.open(LeadChangeLogComponent, { centered: true, scrollable: true, size: 'xl' })
    modalRef.componentInstance.id = id
    modalRef.result.then((result) => {
      if (result) {

      }
    }).catch(err => { })
  }

  timeElapsed(data) {
    var maxTime = data.maxTime * 86400000;
    var idealTime = data.idealTime * 86400000;
    var start = this.tat_start_time;
    var fromTime = this.CorrectTime();
    if (this.tat_end_time.getTime() < fromTime.getTime()) {
      this.isTimerStopped = true;
    }
    if (data.is_active && maxTime > data.time_elapsed) {
      var time_remaining = maxTime - data.time_elapsed;
      var c = false;
      if (idealTime >= data.time_elapsed) {
        c = moment(start).add((idealTime - data.time_elapsed), 'milliseconds').isAfter(fromTime);
      }
      if (c) {
        data['color'] = 'green';
      } else {
        data['color'] = 'yellow';
      }
      if (this.isTimerStopped) {
        data['tat'] = 'Due ' + moment(start).add(time_remaining, 'milliseconds').from(start, false);
        // data['tat'] = 'Due In ' + moment(start).add((maxTime - data.time_elapsed), 'milliseconds').from(moment(this.CorrectTime()).startOf('day'));
        data['ctt'] = moment(start).add(time_remaining, 'milliseconds').diff(start, 'minutes')
        // data['ctt'] = moment(start).add((maxTime - data.time_elapsed), 'milliseconds').diff(moment(this.CorrectTime()).startOf('day'), 'minutes')
      } else {
        data['tat'] = 'Due In ' + moment(start).add(time_remaining, 'milliseconds').fromNow(true);
        // data['tat'] = 'Due In ' + moment(start).add((maxTime - data.time_elapsed), 'milliseconds').fromNow(true);
        data['ctt'] = moment(start).add(time_remaining, 'milliseconds').diff(this.CorrectTime(), 'minutes')
        // data['ctt'] = moment(start).add((maxTime - data.time_elapsed), 'milliseconds').diff(this.CorrectTime(),'minutes')
      }
      data['isBreached'] = false;
    } else if (data.is_active) {
      var time_exceeded = data.time_elapsed - maxTime;
      data['color'] = 'red';
      if (this.isTimerStopped) {
        data['tat'] = 'Overdue ' + moment(start).subtract(time_exceeded, 'milliseconds').from(start);
        // data['tat'] = 'Overdue ' + moment(start).add((data.time_elapsed - maxTime), 'milliseconds').from(moment(this.CorrectTime()).startOf('day'));
        data['ctt'] = moment(start).subtract(time_exceeded, 'milliseconds').diff(start, 'minutes')
        // data['ctt'] = moment(start).add((data.time_elapsed - maxTime), 'milliseconds').diff(moment(this.CorrectTime()).startOf('day'), 'minutes')
      }
      else {
        data['tat'] = 'Overdue ' + moment(start).subtract(time_exceeded, 'milliseconds').fromNow(true);
        // data['tat'] = 'Overdue ' + moment(start).add((data.time_elapsed - maxTime), 'milliseconds').fromNow(true);
        data['ctt'] = moment(start).subtract(time_exceeded, 'milliseconds').diff(this.CorrectTime(), 'minutes')
        // data['ctt'] = moment(start).add((data.time_elapsed - maxTime), 'milliseconds').diff(this.CorrectTime(), 'minutes')
      }
      data['isBreached'] = true;
    } else {
      if (idealTime >= data.time_elapsed) {
        data['color'] = 'green';
        data['isBreached'] = false;
      } else if (maxTime > data.time_elapsed) {
        data['color'] = 'yellow';
        data['isBreached'] = false;
      } else {
        data['color'] = 'red';
        data['isBreached'] = true;
      }
      data['ctt'] = maxTime - data.time_elapsed;
      data['tat'] = moment.duration(data.time_elapsed, 'milliseconds').humanize(false);
    }
    return data['tat'];
  }

  CorrectTime() {
    return new Date(new Date().getTime() - this.offSet)
  }

}
