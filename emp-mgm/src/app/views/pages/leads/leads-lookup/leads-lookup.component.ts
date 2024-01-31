import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { LeadLanguages } from 'src/app/Enums/staticdata';
import { Employee } from 'src/app/model/employee.model';
import { getLeadLevel, leadLevel, Leads, Leadstage } from 'src/app/model/leads.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';
import { LeadsService } from 'src/app/services/leads.service';
import { LeadChangeLogComponent } from '../lead-change-log/lead-change-log.component';

@Component({
  selector: 'app-leads-lookup',
  templateUrl: './leads-lookup.component.html',
  styleUrls: ['./leads-lookup.component.scss']
})
export class LeadsLookupComponent implements OnInit {

  isTimerStopped = false;
  filterQuery = "";
  dataLength;
  displayedColumns: string[];
  displayedColumns1: string[];
  dataSource: MatTableDataSource<Leads>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  allLevel: getLeadLevel[] = [];
  selection = new SelectionModel<Leads>(true, []);
  LeadStatus = []
  tat_start_time = new Date();
  tat_end_time = new Date();
  constructor(
    private leadService: LeadsService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    private modalService: NgbModal,
    private employeeService: EmployeeService,
    private router: Router,
  ) {
  }

  isavailable = true
  isLoading = false
  pageSizeOptions = 25
  allStages: Leadstage[] = []
  employee: Employee
  tatdisplaylabel: string[] = []
  offSet = 0
  promoteLang
  alllang = LeadLanguages;
  promoteLevels: leadLevel[] = []
  LeadLevelPromote = null;
  LeadAssignEmp = []
  leadLang = null
  LeadLevel = null
  LeadLevelDrop: leadLevel[] = [];
  LeadStage: Leadstage[] = [];
  stageFilter = null
  allEmployee: Employee[] = [];
  statusFilter = []
  filteredLeads: Leads[] = []
  searchLead: string = null;
  async ngOnInit() {
    this.isTimerStopped = new Date().getDay() == 0
    this.displayedColumns = ['select', 'leadowner', 'teamlead', 'leadname', 'leadsource', 'leadstatus', 'leadlevel', 'attempt', 'updatedate', 'leadassigndate', 'leaddate', 'callbackdate', 'campaign_name', 'servicename', 'comment', 'logs'];
    this.displayedColumns1 = ['select', 'leadowner', 'teamlead', 'leadname', 'leadsource', 'leadstatus', 'leadlevel', 'attempt', 'updatedate', 'leadassigndate', 'leaddate', 'callbackdate', 'campaign_name', 'servicename', 'comment', 'whatsappnum', 'city', 'state', 'dob', 'gender', 'occupation', 'experience', 'servicetype', 'servicecode', 'creditcard', 'itrfill', 'monthlyincome', 'logs'];
    //this.displayedColumns1 = ['select', 'leadowner', 'leadownername', 'leadassigndate', 'leaddate', 'leadstatus', 'attempt', 'callbackdate', 'updatedate', 'name', 'phone', 'email', 'leadsource', 'campaign_name', 'whatsappnum', 'city', 'state', 'dob', 'gender', 'occupation', 'experience', 'servicetype', 'servicecode', 'servicename', 'comment', 'logs'];
    var time = null
    this.tat_start_time = moment().startOf('day').toDate();
    this.tat_end_time = moment().endOf('day').toDate();
    await this.leadService.getCurrentTime().toPromise()
      .then(res => {
        time = new Date(res['time'])
        this.tat_start_time = new Date(res['tat_start_time']);
        this.tat_end_time = new Date(res['tat_end_time']);
      }).catch(err => time = new Date())
    this.offSet = new Date().getTime() - (time ? time.getTime() : new Date().getTime());
    this.leadService.getleadstage().toPromise()
      .then(res => {
        this.allStages = res;
      }).catch(err => this.alertNotificationService.alertError(err))

    this.leadService.getLevel().toPromise()
      .then(res => {
        this.allLevel = res as getLeadLevel[];
      }).catch(err => this.alertNotificationService.alertError(err));

    this.employeeService.getAllEmployees('display', Departments.Sales, null).toPromise()
      .then(res => {
        this.allEmployee = res
        this.allEmployee = this.allEmployee.reverse()
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  async Searchleadlist() {
    this.isLoading = true
    await this.leadService.leadlookup(this.searchLead).toPromise()
      .then(res => this.displayLeads = res as any[])
      .catch(err => this.alertNotificationService.alertError(err));
    this.displayLeads.forEach(e => this.timeElapsed(e));
    this.tablefilter();
  }

  async tablefilter() {
    this.isLoading = true
    this.filteredLeads = [...this.displayLeads];

    if (this.filterQuery) {
      if (this.filterQuery == "not found") {
        this.filteredLeads = this.filteredLeads.filter(e => e.leadstatus == "Not Found")
      } else if (this.filterQuery == "existing") {
        this.filteredLeads = this.filteredLeads.filter(e => e.leadstatus != "Not Found")
      }
    }

    if (this.leadLang) {
      this.LeadLevelDrop = [];
      var newObj = this.allLevel.find(f => this.leadLang == f._id);
      this.LeadLevelDrop = newObj ? newObj.levels : [];

      if (this.LeadLevelDrop.length == 0) {
        this.LeadLevel = null;
        this.stageFilter = null;
        this.statusFilter = [];
        this.LeadStatus = []
      }
      this.filteredLeads = this.filteredLeads.filter(e => e.language == this.leadLang)
    }
    if (this.LeadLevel && this.leadLang) {
      this.LeadStage = []
      var newstages = this.LeadLevelDrop.find(f => f._id == this.LeadLevel);
      this.LeadStage = newstages ? newstages.stages : [];
      if (this.LeadStage.length == 0) {
        this.stageFilter = null;
        this.statusFilter = [];
        this.LeadStatus = []

      }
      this.filteredLeads = this.filteredLeads.filter(e => e.level == this.LeadLevel)
    }
    if (this.stageFilter && this.LeadLevel && this.leadLang) {
      this.LeadStatus = []
      var sts = this.LeadStage.find(w =>
        this.stageFilter == w.name
      )
      this.LeadStatus = sts ? sts.status : [];
      if (this.LeadStatus.length == 0) {
        this.statusFilter = []
      }
      this.filteredLeads = this.filteredLeads.filter(e => this.LeadStatus && this.LeadStatus.length > 0 && this.LeadStatus.includes(e.leadstatus));
    }

    if (this.statusFilter && this.statusFilter.length > 0) {
      this.filteredLeads = this.filteredLeads.filter(e => this.statusFilter && this.statusFilter.length > 0 && this.statusFilter.includes(e.leadstatus));
    }

    this.dataSource = new MatTableDataSource(this.filteredLeads);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = this.filteredLeads.length;
    this.selection.clear();
    this.isavailable = this.filteredLeads.length > 0;
    this.isLoading = false
  }


  export() {
    var data = JSON.parse(JSON.stringify(this.dataSource.filteredData));
    var title = 'Leads'
    data.forEach(e => {
      e['Attempted/Unattempted'] = e.leadassigndate ? e.leadassigndate == e.updatedate ? 'Unattempted' : 'Attempted' : 'Unattempted'
      e.callbackdate = e.callbackdate ? new Date(e.callbackdate) : e.callbackdate;
      e.dob = e.dob ? new Date(e.dob) : e.dob;
      e.leadassigndate = e.leadassigndate ? new Date(e.leadassigndate) : e.leadassigndate;
      e.leaddate = e.leaddate ? new Date(e.leaddate) : e.leaddate;
      e.updatedate = e.updatedate ? new Date(e.updatedate) : e.updatedate;
      e.demogiven = e.demogiven ? 'Yes' : 'No';
      e.demodate = e.demodate ? new Date(e.demodate) : e.demodate;
      e.retarget = e.retarget ? 'Yes' : 'No';
      e.creditcard = e.creditcard ? 'Yes' : 'No';
      e['Credit_card_Bank'] = e.ccbank && e.ccbank.length > 0 ? e.ccbank.join(', ') : null;
      e.itrfill = e.itrfill ? 'Yes' : 'No';
    })
    this.exportService.exportonesheet(title, data);
  }

  onassignstaff() {
    if (this.employee) {
      this.alertNotificationService.alertCustomMsg('Do you want to allocate ' + this.selection.selected.length + ' leads to ' + this.employee?.invid + '-' + this.employee?.fullName + ' ?')
        .then(result => {
          if (result.isConfirmed) {
            var data = {
              ids: this.selection.selected.filter(e => e._id).map(e => e._id),
              staffid: this.employee.invid,
              staffname: this.employee.fullName
            }

            this.leadService.leadAssign(data).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Leads Assigned')
                this.Searchleadlist();
                this.employee = null
                this.modalService.dismissAll()
                this.selection.clear()
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    }
  }

  //--------> Leads Delete

  delete() {
    if (this.filterQuery && this.filterQuery == "existing") {
      this.alertNotificationService.alertCustomMsg('Do you want to delete ' + this.selection.selected.length + ' leads?')
        .then(result => {
          if (result.isConfirmed) {
            console.log(this.selection.selected)
            var ids = this.selection.selected.map(e => e._id)
            this.leadService.bulkdelete(ids).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Leads Deleted')
                this.Searchleadlist()
                this.selection.clear()
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    } else {
      this.alertNotificationService.alertInfo("Please Filter by Existing Lead");
    }

  }

  //--------> Leads Promote

  openPromoteModal(content) {
    if (this.LeadLevel && this.leadLang && this.stageFilter && this.filterQuery && this.filterQuery == "existing") {
      var stage = this.allStages.find(e => e.name == this.stageFilter && e.leadLevelID == this.LeadLevel);
      if (stage && stage.islaststage) {
        var s = this.allLevel.find(e => e._id == this.leadLang);
        this.promoteLevels = s ? s.levels : [];
        var c = this.promoteLevels.find(e => e._id == this.LeadLevel);
        this.promoteLevels = this.promoteLevels.filter(e => c && e.order > c.order);
        this.promoteLang = this.leadLang;
        this.onLangSelect();
        this.modalService.open(content, { centered: true })
          .result.then((result) => {
          })
          .catch(err => { })
      } else {
        this.alertNotificationService.alertInfo("This is not a Final Stage. Please select a Final stage.")
      }
    } else {
      this.alertNotificationService.alertInfo("Please Filter Language, Level, Stage & Existing Lead")
    }
  }

  onLangSelect() {
    var s = this.allLevel.find(e => e._id == this.promoteLang);
    this.promoteLevels = s ? s.levels : [];
  }
  onLangChange() {
    if (this.LeadLevelPromote) {
      this.alertNotificationService.alertCustomMsg(`Do you want to promote ${this.selection.selected.length} leads to ${this.LeadLevelPromote?.language} - ${this.LeadLevelPromote?.name}?`)
        .then(result => {
          if (result.isConfirmed) {
            var data = {
              ids: this.selection.selected.filter(e => e._id).map(e => e._id),
              level: this.LeadLevelPromote?._id,
              language: this.LeadLevelPromote?.language,
              level_name: this.LeadLevelPromote?.name
            }

            this.leadService.leadPromote(data).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Leads Promoted')
                this.LeadLevel = this.LeadLevelPromote._id;
                this.leadLang = this.LeadLevelPromote.language;
                this.Searchleadlist();
                this.LeadLevelPromote = null;
                this.modalService.dismissAll()
                this.selection.clear()
                this.promoteLang = null;
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    }
  }


  //--------> Leads Assign 

  currentLevelStatus = [];
  openassignstaffmodal(content) {
    if (this.LeadLevel && this.leadLang && this.filterQuery && this.filterQuery == "existing") {
      this.currentLevelStatus = [];
      var stages = this.allStages.filter(e => e.leadLevelID == this.LeadLevel);
      stages.forEach(e => {
        e.status.forEach(f => {
          this.currentLevelStatus.push({ status: f, stage: e.name, isLastStage: e.islaststage, _id: e._id })
        });
      })
      this.LeadAssignEmp = [];
      var lvl = this.LeadLevelDrop.find(e => e._id == this.LeadLevel);  // for Lead Assign 
      if (lvl && lvl.employee && lvl.employee.length > 0) {
        this.LeadAssignEmp = this.allEmployee.filter(a => lvl.employee.includes(a.invid));
      }
      this.modalService.open(content, { centered: true })
        .result.then((result) => {
        })
        .catch(err => { })
    }
    else {
      this.alertNotificationService.alertInfo("Please Filter Language and Level and Existing Lead")
    }
  }


  // ---------->  Leads Change status

  changeStatus = null;
  restrictStatus = ['Converted', 'Seat Booked', 'Partially Converted'];
  onchangeStatus(content1) {
    if (this.changeStatus) {
      this.alertNotificationService.alertCustomMsg('Do you want to change ' + this.selection.selected.length + ' leads status to ' + this.changeStatus?.status + ' ?')
        .then(result => {
          if (result.isConfirmed) {
            var data = {
              ids: this.selection.selected.filter(e => e._id && !this.restrictStatus.includes(e.leadstatus)).map(e => e._id),
              status: this.changeStatus?.status,
              stage: this.changeStatus?.stage,
              isLastStage: this.changeStatus?.isLastStage,
              stage_id: this.changeStatus?._id
            }
            if (data && data.ids && data.ids.length > 0) {
              this.leadService.leadStatusChange(data).toPromise()
                .then(res => {
                  this.alertNotificationService.toastAlertSuccess('Leads Status Changed')
                  if (this.selection.selected.length === 1) {
                    this.alertNotificationService.alertCustomMsg("Do you want to reassign lead?")
                      .then(res => {
                        if (res.isConfirmed) {
                          this.modalService.open(content1, { centered: true })
                            .result.then((result) => {
                              if (result) {
                              }
                            })
                            .catch(err => { })
                        } else {
                          this.alertNotificationService.toastAlertSuccess('Leads Status Changed');
                          this.Searchleadlist();
                          this.changeStatus = null
                          this.selection.clear()
                          this.modalService.dismissAll()
                        }
                      }).catch(err => { })
                  } else {
                    this.Searchleadlist();
                    this.changeStatus = null
                    this.modalService.dismissAll()
                    this.selection.clear()
                  }
                }).catch(err => this.alertNotificationService.alertError(err))
            } else {
              this.alertNotificationService.alertInfo("No Eligible leads found for Status Change.")
              this.modalService.dismissAll()
            }
          }
        })
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  changePage() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  displayLeads: Leads[] = []


  leaddisplay(row) {
    this.router.navigate(['/admin/leads/lead-details'], { queryParams: { id: row._id } })
    this.leadService.leadid = row._id
    // window.open(`/admin/leads/lead-details?id=${row._id}`, '_blank');
  }

  changehistory(id) {
    const modalRef = this.modalService.open(LeadChangeLogComponent, { centered: true, scrollable: true, size: 'xl' })
    modalRef.componentInstance.id = id
    modalRef.result.then((result) => {
      if (result) {

      }
    }).catch(err => { })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  getTimeDiff(date1: any, date2?: any, max?: number) {
    if (date1 && date2) {
      var c = moment(date1).add(max, 'days').isBefore(date2)
      return [moment(date1).from(date2, true), c];
    } else if (date1) {
      var c = moment(date1).add(max, 'days').isBefore(this.CorrectTime())
      return [moment(date1).fromNow(true), c];
    }
    return [null, null]
  }

  getbreachdetais(row) {
    var s = this.allStages && this.allStages.length > 0 ? this.allStages.find(e => e.status.includes(row.leadstatus) && e.leadLevelID == row.level) : null
    var l = this.allLevel && this.allLevel.length > 0 ? this.allLevel.find(e => e._id == row.language) : null
    row['level_name'] = l && l.levels && l.levels.length > 0 ? l.levels.find(e => e._id == row.level)?.name : ""
    if (s) {
      var t = row.tats ? row.tats.find(e => e.name == s.name.replace(' ', '_')) : null;
      if (!s.islaststage && t && moment(t.start).add(s.maxtime, 'days').isBefore(this.CorrectTime())) {
        //console.log(moment(t.start).add(s.maxtime,'days').toDate(),this.CorrectTime(),moment(t.start).add(s.maxtime,'days').diff(this.CorrectTime(),'minutes'))
        row['ctt'] = moment(t.start).add(s.maxtime, 'days').diff(this.CorrectTime(), 'minutes')
        return ['Overdue ' + moment(t.start).add(s.maxtime, 'days').fromNow(true), 'danger', s.name];
      } else if (!s.islaststage && t && moment(t.start).add(s.maxtime, 'days').isAfter(this.CorrectTime())) {
        //console.log(moment(t.start).add(s.maxtime,'days').toDate(),this.CorrectTime(),moment(t.start).add(s.maxtime,'days').diff(this.CorrectTime(),'minutes'))
        row['ctt'] = moment(t.start).add(s.maxtime, 'days').diff(this.CorrectTime(), 'minutes')
        var c = moment(t.start).add(s.idealtime, 'days').isAfter(this.CorrectTime())
        return ['Due In ' + moment(t.start).add(s.maxtime, 'days').fromNow(true), c ? 'success' : 'warning', s.name];
      } else {
        return [null, null, s.name];
      }
    }
    return [null, null, null];
  }

  timeElapsed(data) {
    data['tat_details'] = null;
    try {
      var s = this.allStages && this.allStages.length > 0 ? this.allStages.find(e => e.status.includes(data.leadstatus) && e.leadLevelID == data.level) : null;
      var l = this.allLevel && this.allLevel.length > 0 ? this.allLevel.find(e => e._id == data.language) : null;
      data['level_name'] = l && l.levels && l.levels.length > 0 ? l.levels.find(e => e._id == data.level)?.name : "";
      data['stage_name'] = s && s?.name ? s?.name : '';
      if (data.tat && s) {
        var start = this.tat_start_time;
        var maxTime = s.maxtime * 86400000;
        var idealTime = s.idealtime * 86400000;
        var fromTime = this.CorrectTime();
        if (this.tat_end_time.getTime() < fromTime.getTime()) {
          this.isTimerStopped = true;
        }
        if (data.tat.is_active && maxTime > data.tat.time_elapsed) {
          var time_remaining = maxTime - data.tat.time_elapsed;
          var c = false;
          if (idealTime >= data.tat.time_elapsed) {
            var c = moment(start).add((idealTime - data.tat.time_elapsed), 'milliseconds').isAfter(fromTime);
          }
          if (c) {
            data['color'] = 'green';
          } else {
            data['color'] = 'yellow';
          }
          if (this.isTimerStopped) {
            data['tat_details'] = 'Due ' + moment(start).add(time_remaining, 'milliseconds').from(start, false);
            // data['tat_details'] = 'Due In ' + moment(start).add((maxTime - data.time_elapsed), 'milliseconds').from(moment(this.CorrectTime()).startOf('day'));
            data['ctt'] = moment(start).add(time_remaining, 'milliseconds').diff(start, 'minutes')
            // data['ctt'] = moment(start).add((maxTime - data.time_elapsed), 'milliseconds').diff(moment(this.CorrectTime()).startOf('day'), 'minutes')
          } else {
            data['tat_details'] = 'Due In ' + moment(start).add(time_remaining, 'milliseconds').fromNow(true);
            // data['tat_details'] = 'Due In ' + moment(start).add((maxTime - data.time_elapsed), 'milliseconds').fromNow(true);
            data['ctt'] = moment(start).add(time_remaining, 'milliseconds').diff(this.CorrectTime(), 'minutes')
            // data['ctt'] = moment(start).add((maxTime - data.time_elapsed), 'milliseconds').diff(this.CorrectTime(),'minutes')
          }
          data['isBreached'] = false;
        } else if (data.tat.is_active) {
          var time_exceeded = data.time_elapsed - maxTime;
          data['color'] = 'red';
          if (this.isTimerStopped) {
            data['tat_details'] = 'Overdue ' + moment(start).subtract(time_exceeded, 'milliseconds').from(start);
            // data['tat_details'] = 'Overdue ' + moment(start).add((data.time_elapsed - maxTime), 'milliseconds').from(moment(this.CorrectTime()).startOf('day'));
            data['ctt'] = moment(start).subtract(time_exceeded, 'milliseconds').diff(start, 'minutes')
            // data['ctt'] = moment(start).add((data.time_elapsed - maxTime), 'milliseconds').diff(moment(this.CorrectTime()).startOf('day'), 'minutes')
          }
          else {
            data['tat_details'] = 'Overdue ' + moment(start).subtract(time_exceeded, 'milliseconds').fromNow(true);
            // data['tat_details'] = 'Overdue ' + moment(start).add((data.time_elapsed - maxTime), 'milliseconds').fromNow(true);
            data['ctt'] = moment(start).subtract(time_exceeded, 'milliseconds').diff(this.CorrectTime(), 'minutes')
            // data['ctt'] = moment(start).add((data.time_elapsed - maxTime), 'milliseconds').diff(this.CorrectTime(), 'minutes')
          }
          data['isBreached'] = true;
        } else {
          if (idealTime >= data.tat.time_elapsed) {
            data['color'] = 'green';
            data['isBreached'] = false;
          } else if (maxTime > data.tat.time_elapsed) {
            data['color'] = 'yellow';
            data['isBreached'] = false;
          } else {
            data['color'] = 'red';
            data['isBreached'] = true;
          }
          data['ctt'] = maxTime - data.tat.time_elapsed;
          data['tat_details'] = moment.duration(data.tat.time_elapsed, 'milliseconds').humanize(false);
        }
        return data['tat_details'];
      }
    } catch (err) {
      console.log(err);
    } finally {
      return data['tat_details'];
    }
  }

  CorrectTime() {
    return new Date(new Date().getTime() - this.offSet)
  }

  getPageData() {
    if (this.dataSource)
      return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
    return []
  }

  isEntirePageSelected() {
    return this.getPageData().every((row) => this.selection.isSelected(row));
  }

  isAllSelected() {
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.filteredData.length;
      return numSelected === numRows;
    }
    return false
  }

  masterToggle() {
    this.isEntirePageSelected() ?
      this.selection.deselect(...this.getPageData()) :
      this.selection.select(...this.getPageData());
  }


  checkboxLabel(row?, i?): string {
    if (!row) {
      return `${this.isEntirePageSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${i}`;
  }

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }


}
