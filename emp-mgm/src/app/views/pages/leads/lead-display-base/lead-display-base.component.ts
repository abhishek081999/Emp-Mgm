import { Component, OnInit } from '@angular/core';
import { Leads, Leadstage, Onboardstudent } from 'src/app/model/leads.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { LeadsService } from 'src/app/services/leads.service';
import { Subscription as subs } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LeadHistoryComponent } from '../lead-history/lead-history.component';
import * as moment from 'moment';

@Component({
  selector: 'app-lead-display-base',
  templateUrl: './lead-display-base.component.html',
  styleUrls: ['./lead-display-base.component.scss']
})
export class LeadDisplayBaseComponent implements OnInit {

  currentLead = new Leads()
  currentOnboard = new Onboardstudent()
  constructor(
    private modalService: NgbModal,
    private leadService: LeadsService,
    private alertNotificationService: AlertNotificationsService,
    private router: Router,
    private route: ActivatedRoute) { }

  isavailable = true
  isLoading = false
  paramSub: subs
  id: string = ''
  offSet = 0;
  async ngOnInit() {
    var time = null
    await this.leadService.getCurrentTime().toPromise()
      .then(res => time = new Date(res['time']))
      .catch(err => time = new Date())
    this.offSet = new Date().getTime() - (time ? time.getTime() : new Date().getTime());
    console.log(time, new Date(), this.offSet, this.CorrectTime())
    await this.leadService.getleadstage().toPromise()
      .then(res => {
        this.allStages = res;
      }).catch(err => this.alertNotificationService.alertError(err))
    this.route.queryParamMap.subscribe(query => {
      this.id = query.get('id');
      this.refreshlist()
    })
  }
  allStages: Leadstage[]
  newDate = moment("12:00 AM", ["h:mm A"]).startOf('day').format('YYYY-MM-DD');
  threeOldMonth = moment("12:00 AM", ["h:mm A"]).startOf('day').subtract(30, 'days').format('YYYY-MM-DD');
  async refreshlist() {
    this.isLoading = true
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
    if (this.serviceFilter || this.prevserviceFilter || this.tatFilter || this.sourceFilter || this.fromDateFilter || this.toDateFilter || this.statusFilter || this.employeeFilter || this.campaignFilter || this.stageFilter || this.leadLang || this.LeadLevel || this.LeadLevel) {
      this.tablefilter()
    }
    // this.checkcurrent()
  }

  serviceFilter = null;
  prevserviceFilter = null;
  statusFilter = null
  employeeFilter = null
  toDateFilter = null
  fromDateFilter = null
  campaignFilter = null
  stageFilter = null
  sourceFilter = null
  tatFilter = null
  leadLang = null
  LeadLevel = null
  leaduploadFromDate = null
  leaduploadToDate = null;
  currentTat = null;
    async tablefilter() {
    this.isLoading = true
    await this.leadService.displayspecificLeads(this.statusFilter, this.employeeFilter, this.toDateFilter, this.fromDateFilter, this.campaignFilter, this.stageFilter, this.sourceFilter, this.leaduploadToDate, this.leaduploadFromDate, this.leadLang, this.LeadLevel, this.serviceFilter, this.prevserviceFilter, this.id).toPromise()
      .then(res => {
        this.currentLead = res['currentLead'] as Leads;
        this.currentOnboard = res['currentOnboard'] as Onboardstudent;
        this.currentTat = res['currentTat']
        this.nextLead = res['nextLead']
        this.prevLead = res['prevLead']
      }).catch(err => this.alertNotificationService.alertError(err));

    this.isLoading = false
  }
  nextLead = null
  prevLead = null
  time = new Date()
  tatFilterfunc(ele) {
    try {
      var s = this.allStages.find(e => e.status.includes(ele.leadstatus))
      if (s) {
        var t = ele.tats ? ele.tats.find(e => e.name == s.name.replace(' ', '_')) : null;
        if (!s.islaststage && t) {
          var a = moment(t.start).add(s.maxtime, 'days').diff(this.time, 'minutes');
          switch (this.tatFilter) {
            case 'overdue':
              return a < 0;
              break
            case 'intoday':
              return a >= 0 && a <= 24 * 60;
              break
            case 'inoneday':
              return a >= 0 && a <= 48 * 60;
              break
            case 'intwoday':
              return a >= 0 && a <= 72 * 60;
              break
            case 'inthreeday':
              return a >= 0 && a <= 96 * 60;
              break
            case 'infourday':
              return a >= 0 && a <= 120 * 60;
              break
            case 'infiveday':
              return a >= 0 && a <= 144 * 60;
              break
            case 'ideal':
              return a > 144 * 60;
              break
          }
        }
      }
      return false;
    } catch (error) {
      console.log(error)
      return false;
    }
  }

 

  gotoprev() {
    if (this.prevLead) {
      this.router.navigate(['/admin/leads/lead-details'], { queryParams: { id: this.prevLead } })
    }
  }

  gotonext() {
    if (this.nextLead) {
      this.router.navigate(['/admin/leads/lead-details'], { queryParams: { id: this.nextLead } })
    }
  }

  getonboard() {

  }

  async leadhistory() {
    try {
      var leads = [];
      var allOnboardData = [];
      await this.leadService.leadhistory(this.currentLead.phone, this.currentLead.email, this.currentLead.whatsappnum, this.currentLead.telegram, this.currentLead.alternatenumber).toPromise()
        .then(res => {
          leads = res['leads'] as Leads[];
          var index = leads.findIndex(e => e._id == this.currentLead._id)
          leads.splice(index, 1)
          allOnboardData = res['onboarding'] as Onboardstudent[]
        }).catch(err => this.alertNotificationService.alertError(err));
      const modalRef = this.modalService.open(LeadHistoryComponent, { centered: true, scrollable: true, size: 'xl' })
      modalRef.componentInstance.data = {
        leads: leads && leads.length > 0 ? leads : [],
        onboarding: allOnboardData && allOnboardData.length > 0 ? allOnboardData : [],
      }
      modalRef.result.then((result) => {
        if (result) {
        }
      }).catch(err => { console.log(err) })
    }
    catch (err) {
      console.log(err)
    }
  }

  CorrectTime() {
    return new Date(new Date().getTime() - this.offSet)
  }
}
