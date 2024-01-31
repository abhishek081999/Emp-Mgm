import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getLeadLevel, leadLevel, Leads, Leadstage } from 'src/app/model/leads.model';
import { Regstucount } from 'src/app/model/regstucount.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { LeadsService } from 'src/app/services/leads.service';
import { ImportXlsxLeadComponent } from '../import-xlsx-lead/import-xlsx-lead.component';
import { LeadChangeLogComponent } from '../lead-change-log/lead-change-log.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as moment from 'moment';
import { Employee } from 'src/app/model/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { EmailRegex, LeadLanguages } from 'src/app/Enums/staticdata';
import { courseService } from 'src/app/services/course.service';
import { PackageService } from 'src/app/services/package.service';
import { InsigniaService } from 'src/app/services/insignia.service';
import { Course } from 'src/app/model/course.model';
import { Products } from 'src/app/model/product.model';
import { Insignia } from 'src/app/model/insignia.model';
import { Invesmentor } from 'src/app/model/invesmentor.model';
import { InvesmentorService } from 'src/app/services/invesmentor.service';

@Component({
  selector: 'app-lead-management',
  templateUrl: './lead-management.component.html',
  styleUrls: ['./lead-management.component.scss']
})
export class LeadManagementComponent implements OnInit {

  allData: Array<Leads> = [];
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  displayedColumns1: string[];
  dataSource: MatTableDataSource<Leads>;
  newSingleLead: Leads = {
    uploaddate: this.CorrectTime(),
    leaddate: this.CorrectTime(),
    leadsource: '',
    leadstatus: "New",
    language: '',
    level: '',
    name: '',
    phone: '',
    email: '',
    campaign_name: null,
    retarget: false,
    alternatenumber: '',
    ivr_call_recv_time: null
  }
  employee: Employee
  staff: Employee[] = []
  allEmployee: Employee[] = []
  settings = {
    name: 'Lead Settings',
    settings: []
  }
  newDate = moment("12:00 AM", ["h:mm A"]).startOf('day').format('YYYY-MM-DD');
  threeOldMonth = moment("12:00 AM", ["h:mm A"]).startOf('day').subtract(30, 'days').format('YYYY-MM-DD');
  allServices = []
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  arrayBuffer: ArrayBuffer;
  filesToUpload: any;
  emailRegex = EmailRegex;
  selection = new SelectionModel<Leads>(true, []);
  allLeadSource: string[] = []
  tat_start_time = new Date();
  tat_end_time = new Date();
  constructor(
    private leadService: LeadsService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    private modalService: NgbModal,
    private employeeService: EmployeeService,
    private router: Router,
    private courseService: courseService,
    private packageService: PackageService,
    private insigniaService: InsigniaService,
    private invesmentorService: InvesmentorService
  ) {
  }
  allCourse: Course[] = []
  allProduct: Products[] = []
  allInsignia: Insignia[] = []
  allInvesmentor: Invesmentor[] = []
  allLevel: getLeadLevel[] = [];
  leaduploadFromDate1: Date = null
  leaduploadToDate1: Date = null
  toDate: Date = null
  fromDate: Date = null
  leadStatus = []
  LeadLevelExport = null
  leadLangExport = null
  isavailable = true
  isLoading = false
  unassignedleadscount = 0
  pageSizeOptions = 25
  allStages: Leadstage[]
  allstatus: string[] = []
  leadstatuscounts: Regstucount[] = []
  allcampaign: string[] = []
  leadsource = {
    name: 'Lead Source',
    sources: []
  }
  leadcap: number = 0;
  retargetcap: number = 0;
  tatdisplaylabel: string[] = []
  finalstatus: string[] = []
  offSet = 0;
  async ngOnInit() {
    this.isTimerStopped = new Date().getDay() == 0
    this.displayedColumns = ['select', 'leadowner', 'leadname', 'leadsource', 'leadstatus', 'leadlevel', 'attempt', 'updatedate', 'leadassigndate', 'leaddate', 'callbackdate', 'campaign_name', 'servicename', 'comment', 'logs'];
    this.displayedColumns1 = ['select', 'leadowner', 'leadname', 'leadsource', 'leadstatus', 'leadlevel', 'attempt', 'updatedate', 'leadassigndate', 'leaddate', 'callbackdate', 'campaign_name', 'servicename', 'comment', 'logs', 'isInsigniaProspect', 'whatsappnum', 'city', 'state', 'dob', 'gender', 'occupation', 'experience', 'servicetype', 'servicecode', 'creditcard', 'itrfill', 'monthlyincome'];
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

    this.employeeService.getAllEmployees('display', Departments.Sales.toString(), null).toPromise()
      .then(res => {
        this.allEmployee = res
        this.allEmployee = this.allEmployee.reverse()
      }).catch(err => this.alertNotificationService.alertError(err));

    this.leadService.getleadsource().toPromise()
      .then(res => {
        this.leadsource = res as any;
        if (!this.leadsource || !this.leadsource.sources) {
          this.leadsource = {
            name: 'Lead Source',
            sources: []
          }
        }
      }).catch(err => this.alertNotificationService.alertError(err))

    this.refreshlist();

  }

  activecallbackcount = 0
  newleadcount = 0
  assignedunattemptedcount = 0
  retargetedcount = 0
  seatbookedcount = 0
  convertedcount = 0
  insigniaProspectCount = 0


  async refreshlist() {
    this.isLoading = true
    await this.leadService.getLevel().toPromise()
      .then(res => {
        this.allLevel = res as getLeadLevel[];
      }).catch(err => this.alertNotificationService.alertError(err));

    this.leadService.getleadstatuscount().toPromise()
      .then(res => {
        this.leadstatuscounts = res
      }).catch(err => this.alertNotificationService.alertError(err))

    this.leadService.getCampaignList().toPromise()
      .then(res => {
        this.allcampaign = res
      }).catch(err => this.alertNotificationService.alertError(err))

    this.fromDateFilter = sessionStorage.getItem('fromDate') != 'null' ? sessionStorage.getItem('fromDate') : null;
    this.toDateFilter = sessionStorage.getItem('toDate') != 'null' ? sessionStorage.getItem('toDate') : null;
    var localStsFilter = sessionStorage.getItem('status') != 'null' ? sessionStorage.getItem('status') : null;
    this.statusFilter = localStsFilter ? JSON.parse(localStsFilter) : [];
    var localEmpFilter = sessionStorage.getItem('employee') != 'null' ? sessionStorage.getItem('employee') : null;
    this.employeeFilter = localEmpFilter ? JSON.parse(localEmpFilter) : [];
    this.campaignFilter = sessionStorage.getItem('campaign') != 'null' ? sessionStorage.getItem('campaign') : null;
    this.stageFilter = sessionStorage.getItem('stage') != 'null' ? sessionStorage.getItem('stage') : null;
    this.leadLang = sessionStorage.getItem('language') != 'null' ? sessionStorage.getItem('language') : null;
    this.LeadLevel = sessionStorage.getItem('level') != 'null' ? sessionStorage.getItem('level') : null;
    this.sourceFilter = sessionStorage.getItem('source') != 'null' ? sessionStorage.getItem('source') : null;
    this.tatFilter = sessionStorage.getItem('tat') != 'null' ? sessionStorage.getItem('tat') : null;
    this.leaduploadFromDate = sessionStorage.getItem('uploadStartDate') != 'null' ? sessionStorage.getItem('uploadStartDate') : null;
    this.leaduploadToDate = sessionStorage.getItem('uploadEndDate') != 'null' ? sessionStorage.getItem('uploadEndDate') : null;
    if (!this.leaduploadFromDate) {
      this.leaduploadFromDate = this.threeOldMonth
    }
    if (!this.leaduploadToDate) {
      this.leaduploadToDate = this.newDate
    }
    this.serviceFilter = sessionStorage.getItem('current_batch') != 'null' ? sessionStorage.getItem('current_batch') : null;
    this.prevserviceFilter = sessionStorage.getItem('prev_batch') != 'null' ? sessionStorage.getItem('prev_batch') : null;
    this.onlevelchange();
    if (this.serviceFilter || this.prevserviceFilter || this.tatFilter || this.sourceFilter || this.fromDateFilter || this.toDateFilter || this.statusFilter || this.employeeFilter || this.campaignFilter || this.stageFilter || this.leadLang || this.LeadLevel || this.LeadLevel) {
      this.tablefilter()
    }

    await this.courseService.getAllCourse().toPromise()
      .then(res => this.allCourse = res)
      .catch(err => this.alertNotificationService.alertError(err));

    await this.insigniaService.getInsigniaList().toPromise()
      .then(res => this.allInsignia = res)
      .catch(err => this.alertNotificationService.alertError(err));

    await this.packageService.getallPackage().toPromise()
      .then(res => this.allProduct = res)
      .catch(err => this.alertNotificationService.alertError(err));

    await this.invesmentorService.getInvesmentorList().toPromise()
      .then(res => this.allInvesmentor = res)
      .catch(err => this.alertNotificationService.alertError(err));
    this.allCourse.forEach(e => {
      if (e.approved) {
        this.servicecodes = this.servicecodes.concat([{ serviceCode: e.coursecode, name: `${e.short_code} - ${moment(e.coursestartdate).format('DD-MM-YYYY')}` }])
      }
    })
    this.servicecodes = this.servicecodes.reverse();
    this.allInsignia.forEach(e => {
      if (e.approved) {
        this.servicecodes = this.servicecodes.concat([{ serviceCode: e.code, name: e.name }])
      }
    })
    this.allProduct.forEach(e => {
      if (e.approve) {
        this.servicecodes = this.servicecodes.concat([{ serviceCode: e.productid, name: e.name }])
      }
    })
    this.allInvesmentor.forEach(e => {
      if (e.approved) {
        this.servicecodes = this.servicecodes.concat([{ serviceCode: e.code, name: e.name }])
      }
    })

  }

  getstatuscount(s) {
    var d = this.leadstatuscounts.find(e => e._id == s)
    return d ? d.count : 0
  }
  LeadLevelDrop: leadLevel[] = [];
  servicecodes = []
  tatFilter = null
  statusFilter = []
  employeeFilter = []
  toDateFilter = null
  fromDateFilter = null
  campaignFilter = null
  stageFilter = null
  sourceFilter = null
  prevserviceFilter = null
  leaduploadToDate = this.newDate
  leaduploadFromDate = this.threeOldMonth
  leadLang = null
  LeadLevel = null
  LeadStage: Leadstage[] = [];
  LeadStatus = []
  LeadAssignEmp = []
  serviceFilter = null
  isTimerStopped = false;
  isSearchRequired = false
  onlevelchange() {
    this.isSearchRequired = true;
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
    }
    if (this.stageFilter && this.LeadLevel && this.leadLang) {
      this.LeadStatus = []
      var sts = this.LeadStage.find(w => this.stageFilter == w.name)
      this.LeadStatus = sts ? sts.status : [];
      if (this.LeadStatus.length == 0) {
        this.statusFilter = []
      }
    }
  }

  async tablefilter() {
    this.isLoading = true
    this.onlevelchange();
    this.isSearchRequired = false
    sessionStorage.setItem('uploadStartDate', this.leaduploadFromDate);
    sessionStorage.setItem('uploadEndDate', this.leaduploadToDate);
    sessionStorage.setItem('fromDate', this.fromDateFilter);
    sessionStorage.setItem('toDate', this.toDateFilter);
    sessionStorage.setItem('employee', JSON.stringify(this.employeeFilter));
    sessionStorage.setItem('campaign', this.campaignFilter);
    sessionStorage.setItem('language', this.leadLang);
    sessionStorage.setItem('level', this.LeadLevel);
    sessionStorage.setItem('stage', this.stageFilter);
    sessionStorage.setItem('status', JSON.stringify(this.statusFilter));
    sessionStorage.setItem('source', this.sourceFilter);
    sessionStorage.setItem('tat', this.tatFilter);
    sessionStorage.setItem('current_batch', this.serviceFilter);
    sessionStorage.setItem('prev_batch', this.prevserviceFilter);
    await this.leadService.displayLeads(this.statusFilter, this.employeeFilter, this.toDateFilter, this.fromDateFilter, this.campaignFilter, this.stageFilter, this.sourceFilter, this.leaduploadToDate, this.leaduploadFromDate, this.leadLang, this.LeadLevel, this.serviceFilter, this.prevserviceFilter).toPromise()
      .then(res => this.allData = res as any[])
      .catch(err => this.alertNotificationService.alertError(err));

    this.allData.forEach(e => this.timeElapsed(e));
    this.selection.clear();
    this.isavailable = this.allData.length > 0;
    this.isLoading = false
    this.dataSource = new MatTableDataSource(this.allData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = this.allData.length;
    this.assignedunattemptedcount = this.allData.filter(e => e.leadassigndate && e.leadassigndate == e.updatedate).length;
    this.unassignedleadscount = this.allData.filter(e => !e.leadowner).length;
    this.retargetedcount = this.allData.filter(e => e.retarget).length;
    this.insigniaProspectCount = this.allData.filter(e => e.isInsigniaProspect).length;
    this.leadstatuscounts.push({ _id: 'Retargeted', count: this.retargetedcount })
    this.leadstatuscounts.push({ _id: 'Assigned Unattempted', count: this.assignedunattemptedcount })
    this.leadstatuscounts.push({ _id: 'Unassigned', count: this.unassignedleadscount })

    if (!this.displayedColumns.includes('logs')) {
      this.displayedColumns.push('logs');
    }
    if (this.tatFilter) {
      this.leadFilter()
    }
  }

  leadFilter() {
    var data = [...this.allData] as Leads[]
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
    data = data.sort((a, b) => a['ctt'] - b['ctt']);
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = data.length;
    if (!this.displayedColumns.includes('logs')) {
      this.displayedColumns.push('logs');
    }
  }

  unassignedLeads() {
    var data = this.allData.filter(e => !e.leadowner);
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = data.length;
    if (!this.displayedColumns.includes('logs')) {
      this.displayedColumns.push('logs');
    }
  }

  retargatedLeads() {
    var data = this.allData.filter(e => e.retarget);
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = data.length;
    if (!this.displayedColumns.includes('logs')) {
      this.displayedColumns.push('logs');
    }
  }

  assignedUnattemptedLeads() {
    var data = this.allData.filter(e => e.leadassigndate && e.leadassigndate == e.updatedate);
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = data.length;
    if (!this.displayedColumns.includes('logs')) {
      this.displayedColumns.push('logs');
    }
  }

  insigniaProspect() {
    var data = this.allData.filter(e => e.isInsigniaProspect);
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = data.length;
    if (!this.displayedColumns.includes('logs')) {
      this.displayedColumns.push('logs');
    }
  }

  ExportChanges() {

    if (this.leadLangExport) {
      this.LeadLevelDrop = [];
      var newObj = this.allLevel.find(f => this.leadLangExport == f._id);
      this.LeadLevelDrop = newObj ? newObj.levels : [];
      if (this.LeadLevelDrop.length == 0) {
        this.LeadLevelExport = null;
        this.stage = null;
        this.leadStatus = [];
        this.LeadStatus = []
      }
    }
    if (this.LeadLevelExport && this.leadLangExport) {
      this.LeadStage = []
      var newstages = this.LeadLevelDrop.find(f => f._id == this.LeadLevelExport);
      this.LeadStage = newstages ? newstages.stages : [];
      if (this.LeadStage.length == 0) {
        this.stage = null;
        this.leadStatus = [];
        this.LeadStatus = []
      }
    }
    if (this.LeadLevelExport && this.leadLangExport && this.stage) {
      this.LeadStatus = []
      var sts = this.LeadStage.find(w =>
        this.stage == w.name
      )
      this.LeadStatus = sts ? sts.status : [];
      if (this.LeadStatus.length == 0) {
        this.leadStatus = []
      }
    }


  }

  openexportModal(content) {
    this.modalService.open(content, { centered: true, size: 'xl' })
      .result.then((result) => {
        this.fromDate = null
        this.toDate = null
        this.staff = []
        this.leadStatus = null
        this.campaign = null
        this.stage = null
        this.source = null
      })
      .catch(err => { })
  }

  isExistingCampaign = false;
  currentLevelStatus = [];
  isSingleLeadSelected = false
  openassignstaffmodal(content) {
    if (this.isSearchRequired) {
      this.alertNotificationService.alertInfo("Please Click on Search Button");
      return;
    }
    if (this.LeadLevel && this.leadLang) {
      this.currentLevelStatus = [];
      var stages = this.allStages.filter(e => e.leadLevelID == this.LeadLevel);
      stages.forEach(e => {
        e.status.forEach(f => {
          this.currentLevelStatus.push({ status: f, stage: e.name, isLastStage: e.islaststage, _id: e._id })
        });
      })
      this.LeadAssignEmp = [];
      var lvl = this.LeadLevelDrop.find(e => e._id == this.LeadLevel);  // for Lead Assign 
      if (lvl && lvl.employee.length > 0) {
        this.LeadAssignEmp = this.allEmployee.filter(a => lvl.employee.includes(a.invid));
      }
      this.isSingleLeadSelected = this.selection.selected.length == 1;
      this.modalService.open(content, { centered: true })
        .result.then((result) => {
        })
        .catch(err => { })
    }
    else {
      this.alertNotificationService.alertInfo("Please Filter Language and Level")
    }
  }

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
                  this.alertNotificationService.toastAlertSuccess('Leads Status Changed');
                  if (this.isSingleLeadSelected) {
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
                          this.tablefilter();
                          this.changeStatus = null
                          this.selection.clear()
                          this.modalService.dismissAll()
                        }
                      }).catch(err => { })
                  } else {
                    this.tablefilter();
                    this.changeStatus = null
                    this.selection.clear()
                    this.modalService.dismissAll()
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

  openPromoteModal(content) {
    if (this.isSearchRequired) {
      this.alertNotificationService.alertInfo("Please Click on Search Button");
      return;
    }
    if (this.LeadLevel && this.leadLang && this.stageFilter) {
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
      this.alertNotificationService.alertInfo("Please Filter Language, Level & Stage")
    }
  }

  promoteLevels: leadLevel[] = []
  LeadLevelPromote = null;

  onPromote() {
    if (this.LeadLevelPromote) {
      this.alertNotificationService.alertCustomMsg('Do you want to promote ' + this.selection.selected.length + ' leads to ' + this.LeadLevelPromote?.name + ' ?')
        .then(result => {
          if (result.isConfirmed) {
            var data = {
              ids: this.selection.selected.filter(e => e._id).map(e => e._id),
              level: this.LeadLevelPromote?._id,
              language: this.leadLang,
              level_name: this.LeadLevelPromote?.name
            }

            this.leadService.leadPromote(data).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Leads Promoted')
                this.LeadLevel = this.LeadLevelPromote._id;
                this.tablefilter();
                this.LeadLevelPromote = null;
                this.modalService.dismissAll()
                this.selection.clear()
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    }
  }
  openchangelangmodal(content) {
    this.modalService.open(content, { centered: true })
      .result.then((result) => {
      })
      .catch(err => { })
  }
  promoteLang
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
                this.tablefilter();
                this.LeadLevelPromote = null;
                this.modalService.dismissAll()
                this.selection.clear()
                this.promoteLang = null;
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    }
  }
  campaign: string = null
  source: string = null
  stage: string = null
  async export() {
    var data = [];
    if (this.dataSource) {
      data = JSON.parse(JSON.stringify(this.dataSource.filteredData));
    } else {
      this.alertNotificationService.alertInfo("No Data Found to Export");
      return;
    }

    var title = '';
    title = 'Leads'

    data.forEach(e => {
      e['Attempted/Unattempted'] = e.leadassigndate ? e.leadassigndate == e.updatedate ? 'Unattempted' : 'Attempted' : 'Unattempted'
      e.callbackdate = e.callbackdate ? new Date(e.callbackdate) : e.callbackdate;
      e.dob = e.dob ? new Date(e.dob) : e.dob;
      e.leadassigndate = e.leadassigndate ? new Date(e.leadassigndate) : e.leadassigndate;
      e.leaddate = e.leaddate ? new Date(e.leaddate) : e.leaddate;
      e.updatedate = e.updatedate ? new Date(e.updatedate) : e.updatedate;
      e.uploaddate = e.uploaddate ? new Date(e.uploaddate) : e.uploaddate;
      e.ivr_call_recv_time = e.ivr_call_recv_time ? new Date(e.ivr_call_recv_time) : e.ivr_call_recv_time;
      e.demogiven = e.demogiven ? 'Yes' : 'No';
      e.demodate = e.demodate ? new Date(e.demodate) : e.demodate;
      e.retarget = e.retarget ? 'Yes' : 'No';
      e.creditcard = e.creditcard ? 'Yes' : 'No';
      e['Credit_card_Bank'] = e.ccbank && e.ccbank.length > 0 ? e.ccbank.join(', ') : null;
      e.itrfill = e.itrfill ? 'Yes' : 'No';
      e.isInsigniaProspect = e.isInsigniaProspect ? 'Yes' : 'No';
      var s = this.allStages.find(f => f.status.includes(e.leadstatus))
      e['lead_stage'] = s ? s.name : null
    })
    this.exportService.exportonesheet(title, data);
  }

  delete() {
    this.alertNotificationService.alertCustomMsg('Do you want to delete ' + this.selection.selected.length + ' leads?')
      .then(result => {
        if (result.isConfirmed) {
          console.log(this.selection.selected)
          var ids = this.selection.selected.map(e => e._id)
          this.leadService.bulkdelete(ids).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Leads Deleted')
              this.refreshlist()
              this.selection.clear()
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
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
                this.tablefilter();
                this.employee = null
                this.modalService.dismissAll()
                this.selection.clear()
              }).catch(err => this.alertNotificationService.alertError(err))
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

  openfileuploadModal() {
    this.modalService.open(ImportXlsxLeadComponent, { centered: true, scrollable: true, size: 'xl' })
      .result.then((result) => {
        if (result) {
          var newLeads = result as Leads[]
          //console.log(newLeads)
          if (newLeads && newLeads.length > 0) {
            this.leadService.uploadLeads(newLeads, newLeads[0].level, newLeads[0].language).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('New Leads Uploaded')
                this.refreshlist()
              }).catch(err => this.alertNotificationService.alertError(err))
          } else {
            this.alertNotificationService.toastAlertSuccess('No Lead Uploaded.')
          }
        }
      }).catch((res) => { });
  }
  campaignDate;
  alllang = LeadLanguages;
  CampaignLevelDrop: leadLevel[] = [];
  NewAllLvl = new getLeadLevel();
  Lang;
  leadSource;
  LevelObj = new leadLevel()
  levelObj2; // for valifation extra varrieble needed
  existingCampaign = []
  Onchange() {
    if (this.newSingleLead.leadsource && !this.isExistingCampaign) {
      this.newSingleLead.campaign_name = this.newSingleLead.leadsource;
    }
    if (this.campaignDate && !this.isExistingCampaign) {
      var D = moment(this.campaignDate).format('DD_MMM_YY');
      this.newSingleLead.campaign_name += '_' + D;
    }
    if (this.newSingleLead.language) {
      this.CampaignLevelDrop = [];
      console.log(this.LevelObj)
      this.NewAllLvl = this.allLevel.find(f => this.newSingleLead.language == f._id);
      this.CampaignLevelDrop = this.NewAllLvl ? this.NewAllLvl.levels : [];
      if (!this.isExistingCampaign) {
        this.newSingleLead.campaign_name += '_' + this.newSingleLead.language;
      } else {
        this.existingCampaign = this.allcampaign.filter(e => e.indexOf(this.newSingleLead.language) > 0);
        if (this.existingCampaign.length == 0 || !this.existingCampaign.includes(this.newSingleLead.campaign_name)) {
          this.newSingleLead.campaign_name = null;
        }
      }

      this.LevelObj = this.levelObj2   // any object assign to leadLevel variable [its need for validation] 

      // if (this.LevelObj && this.newSingleLead.language != this.LevelObj.language) {
      //   this.LevelObj.name = '';
      // }
    }
    // if (this.LevelObj && !this.isExistingCampaign) {
    //   this.newSingleLead.campaign_name += '_' + this.LevelObj.name;
    // }
  }

  opensingleleadModal(content) {
    this.isExistingCampaign = false;
    this.modalService.open(content, { centered: true, scrollable: true, size: 'lg' })
      .result.then((result) => {
        if (result == 'Submit') {
          try {
            this.newSingleLead.uploaddate = this.CorrectTime();
            this.newSingleLead.level = this.LevelObj._id;
            this.newSingleLead.leaddate = this.campaignDate ? new Date(this.campaignDate) : this.CorrectTime();
            this.leadService.uploadLeads([this.newSingleLead], this.newSingleLead.level, this.newSingleLead.language).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('New Lead Uploaded')
                this.newSingleLead = new Leads()
                this.newSingleLead = {
                  leaddate: this.CorrectTime(),
                  leadsource: '',
                  leadstatus: "New",
                  name: '',
                  phone: '',
                  email: '',
                  alternatenumber: '',
                  campaign_name: '',
                  retarget: false,
                  uploaddate: this.CorrectTime(),
                  ivr_call_recv_time: null
                }
                this.refreshlist()
              }).catch(err => this.alertNotificationService.alertError(err))
          } catch (error) {
            console.log(error)
          }
        }
        else {
          this.newSingleLead.level = null;
          this.newSingleLead.language = null;
          this.campaignDate = null;
          this.newSingleLead.campaign_name = null;
          this.newSingleLead.leadsource = null;

        }
      }).catch((res) => { });
  }

  getPageData() {
    if (this.dataSource)
      return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
    return []
  }

  isEntirePageSelected() {
    return this.getPageData().every((row) => this.selection.isSelected(row));
  }

  CourseSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return (item.serviceCode && item.serviceCode.toLowerCase().indexOf(term) > -1) ||
      (item.name && item.name.toLowerCase().indexOf(term) > -1);
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

  leaddisplay(row) {
    this.router.navigate(['/admin/leads/lead-details'], { queryParams: { id: row._id } })
    this.leadService.leadid = row._id
    // window.open(`/admin/leads/lead-details?id=${row._id}`, '_blank');
  }

  isSticky(buttonToggleGroup: MatButtonToggleGroup, id: string) {
    return (buttonToggleGroup.value || []).indexOf(id) !== -1;
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
    var s = this.allStages && this.allStages.length > 0 ? this.allStages.find(e => e.status.includes(row.leadstatus) && e.leadLevelID == row.level) : null;
    var l = this.allLevel && this.allLevel.length > 0 ? this.allLevel.find(e => e._id == row.language) : null;
    row['level_name'] = l && l.levels && l.levels.length > 0 ? l.levels.find(e => e._id == row.level)?.name : "";
    if (s) {
      var t = row.tats && row.tats.length ? row.tats.find(e => e.name == s.name.replace(' ', '_')) : null;
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

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

  CorrectTime() {
    return new Date(new Date().getTime() - this.offSet)
  }

}
