import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { Course } from 'src/app/model/course.model';
import { DemoScheduleDisp } from 'src/app/model/demoschedule.model';
import { LeadChangelog, LeadChanges, Leads, Leadstage, Onboardstudent } from 'src/app/model/leads.model';
import { Package } from 'src/app/model/package.model';
import { StateDistricts } from 'src/app/model/statedistrict.model';
import { User } from 'src/app/model/user.model';
import { Webinar } from 'src/app/model/webinar.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { LeadsService } from 'src/app/services/leads.service';
import { PackageService } from 'src/app/services/package.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { LeadChangeLogComponent } from '../lead-change-log/lead-change-log.component';
import { SelectPriceComponent } from '../select-price/select-price.component';
import { SelectServiceComponent } from '../select-service/select-service.component';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import * as moment from 'moment';
import { Insignia } from 'src/app/model/insignia.model';
import { InsigniaService } from 'src/app/services/insignia.service';
import { VideoPlayerComponent } from '../../others/video-player/video-player.component';
import { EmailRegex, YearOfExperiences } from 'src/app/Enums/staticdata';
import { InvesmentorService } from 'src/app/services/invesmentor.service';
import { Invesmentor } from 'src/app/model/invesmentor.model';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { OrdersService } from 'src/app/services/orders.service';
import { Orders } from 'src/app/model/orders.model';
const colors: any = {
  red: '#FAE3E3',
  blue: '#1e90ff',
  yellow: '#e3bc08'
};


@Component({
  selector: 'app-lead-display',
  templateUrl: './lead-display.component.html',
  styleUrls: ['./lead-display.component.scss'],
  providers: [DatePipe]
})
export class LeadDisplayComponent implements OnInit, OnChanges {
  imageurl = environment.imageUrl;
  @Input() currentLead = new Leads()
  @Input() currentOnboard = new Onboardstudent()
  @Input() currentTat;
  @Output() onboardChanged = new EventEmitter<Onboardstudent>();
  @Output() leadhist = new EventEmitter<any>();
  @Output() leadSubmit = new EventEmitter<any>();

  emailRegex = EmailRegex;
  states: string[] = []
  statewisedistricts: StateDistricts[] = []
  explist = YearOfExperiences
  constructor(
    private modalService: NgbModal,
    private leadsService: LeadsService,
    private courseService: courseService,
    private packageService: PackageService,
    private alertNotificationService: AlertNotificationsService,
    private userService: UserService,
    private datePipe: DatePipe,
    private _clipboardService: ClipboardService,
    private insigniaService: InsigniaService,
    private invesmentorService: InvesmentorService,
    private employeeService: EmployeeService,
    private router: Router,
    private orderService: OrdersService) { }
  allInvesmentor: Invesmentor[] = []
  allCourse: Course[] = []
  allCurrentCourse = []
  allPrevCourse: Course[] = []
  allInsignia: Insignia[] = []
  allProduct: Package[] = []
  allStages: Leadstage[] = []
  allstatus: string[] = []
  allUser: User[] = []
  duplicateLead = new Leads()
  duplicateOnboard = new Onboardstudent()
  ismandatory = false
  occupations = {
    name: 'Occupations',
    lists: []
  }
  allbanks: string[] = []
  allDemoSchedule: DemoScheduleDisp[] = []
  events: EventInput[] = [];
  @ViewChild('externalEvents', { static: true }) externalEvents: ElementRef;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin, listPlugin]; // important!
  displayStatusList: string[] = []
  allUpcomingCourse = []
  isTimerStopped = false;

  orderDetails: Orders = null;
  onboardingStatus = ['Converted', 'Partially Converted', 'Seat Booked', 'Seat Bkd-not Cnvrtd']
  deviceHeldDrop = [
    'Android Only',
    'IOS Only',
    'Android + IOS'
  ]


  isExistingOrder = false;
  tat_start_time = new Date();
  tat_end_time = new Date();
  ngOnChanges(changes: SimpleChanges): void {
    //console.log(this.currentLead,this.CorrectTime())
    this.hide = false;
    this.submitf = false
    this.errormsg = ''
    this.isdateacceptable = true
    if (!this.currentLead) {
      this.currentLead = new Leads()
    } else {
      this.isconverted = this.currentLead.leadstatus == 'Converted'
      var allow = false
      this.displayStatusList = []
      this.allStages.forEach(e => {
        if (e.leadLevelID == this.currentLead.level) {
          if ((e.status.includes(this.currentLead.leadstatus) && !e.islaststage) || allow) {
            this.displayStatusList = this.displayStatusList.concat(e.status)
            allow = true
          } else if (e.status.includes(this.currentLead.leadstatus) && e.islaststage) {
            this.displayStatusList = this.displayStatusList.concat(e.status)
          }
        }
      })

      console.log(this.currentLead)
      if (this.onboardingStatus.includes(this.currentLead.leadstatus)) {
        this.orderService.getOrderByLeadID(this.currentLead._id).toPromise()
          .then(res => {
            this.orderDetails = res['orderDetails'];
            if (this.orderDetails && this.orderDetails?.orderID) {
              this.isExistingOrder = true;
            }
          }).catch(err => this.alertNotificationService.alertError(err));
      }
    }
    if (!this.currentOnboard) {
      this.currentOnboard = new Onboardstudent()
    } else {
      if ((this.currentOnboard.mode == 'mode2' || this.currentOnboard.mode == 'mode3' || this.currentOnboard.mode == 'mode4' || this.currentOnboard.mode == 'mode5') && this.currentOnboard.secregstarttime) {
        this.secinsstarted = true
        this.secinsstart = true
      }
      if ((this.currentOnboard.mode == 'mode3' || this.currentOnboard.mode == 'mode4') && this.currentOnboard.thirdregstarttime) {
        this.thirdinsstarted = true
        this.thirdinsstart = true
      }
      if ((this.currentOnboard.mode == 'mode4') && this.currentOnboard.forthregstarttime) {
        this.forthinsstarted = true
        this.forthinsstart = true
      }
    }
    if (this.currentLead.isdemoschedule) {
      this.courseService.getmywebinar(this.currentLead._id).toPromise()
        .then(res => {
          this.webinarres = res[0];
        }).catch(err => this.alertNotificationService.alertError(err))
    } else {
      this.webinarres = new Webinar();
    }
    this.duplicateOnboard = JSON.parse(JSON.stringify(this.currentOnboard))
    this.duplicateLead = JSON.parse(JSON.stringify(this.currentLead))
    this.onOnboardingCheck();
    this.onstateChange()
  }
  userDetails;
  isconverted
  imgavailable = false;
  followupstatus: string[] = []
  offSet = 0;
  async ngOnInit() {
    this.isTimerStopped = new Date().getDay() == 0
    this.tat_start_time = moment().startOf('day').toDate();
    this.tat_end_time = moment().endOf('day').toDate();
    var time = null
    await this.leadsService.getCurrentTime().toPromise()
      .then(res => {
        time = new Date(res['time'])
        this.tat_start_time = new Date(res['tat_start_time']);
        this.tat_end_time = new Date(res['tat_end_time']);
      }).catch(err => time = new Date())
    this.offSet = new Date().getTime() - (time ? time.getTime() : new Date().getTime());
    console.log(time, new Date(), this.offSet, this.CorrectTime())
    this.userDetails = this.employeeService.getUserPayload()
    await this.userService.getStudents().toPromise()
      .then(res => {
        this.allUser = res;
        if (this.currentLead) {
          this.onOnboardingCheck();
        }
      }).catch(err => this.alertNotificationService.alertError(err))
    this.leadsService.getleadstage().toPromise()
      .then(res => {
        this.allStages = res;
        this.allStages.forEach(e => {
          if (e.followup) {
            this.followupstatus = this.followupstatus.concat(e.status);
          }
          this.allstatus = this.allstatus.concat(e.status)
        })
        this.displayStatusList = []
        if (this.currentLead && this.currentLead.level && this.currentLead.leadstatus) {
          var allow = false
          this.allStages.forEach(e => {
            if (e.leadLevelID == this.currentLead.level) {
              if ((e.status.includes(this.currentLead.leadstatus) && !e.islaststage) || allow) {
                this.displayStatusList = this.displayStatusList.concat(e.status)
                allow = true
              } else if (e.status.includes(this.currentLead.leadstatus) && e.islaststage) {
                this.displayStatusList = this.displayStatusList.concat(e.status)
              }
            }
          })
        }
        this.allstatus = this.allstatus.sort()
        //console.log(this.allstatus)
      }).catch(err => this.alertNotificationService.alertError(err))

    var currentDate = this.CorrectTime();

    await this.courseService.getClassSchedule(null, null, null, null).toPromise()
      .then(res => {
        this.allUpcomingCourse = res;
        try {
          this.allUpcomingCourse = this.allUpcomingCourse.filter(e => Number(e?.registration_count) >= 0 && Number(e?.max_student) >= 0 && Number(e?.registration_count) < Number(e?.max_student)).map(e => e.course_code)
        } catch (err) {
          this.allUpcomingCourse = res;
          console.log(err);
        }
      }).catch(err => this.alertNotificationService.alertError(err))

    this.courseService.getAllCourse().toPromise()
      .then(res => {
        this.allCourse = res as Course[]
        this.allCourse = this.allCourse.reverse()
        this.allCourse.forEach(e => {
          if (e.coursetype.includes('Recorded') && e.approved) {
            this.allCurrentCourse.push(e);
            this.allPrevCourse.push(e)
          } else if (e.approved) {
            var date = e.coursestartdate ? new Date(e.coursestartdate) : e.coursestartdate
            date.setHours(23, 59, 59, 999);
            if (e.coursestartdate && date.getTime() >= currentDate.getTime()) {
              if (this.allUpcomingCourse.includes(e.coursecode)) {
                this.allCurrentCourse.push(e)
              }
            } else {
              this.allPrevCourse.push(e)
            }
          }
        })

        this.allCurrentCourse = this.allCurrentCourse.sort(function (a, b) {
          return new Date(b.coursestartdate).getTime() - new Date(a.coursestartdate).getTime();
        });
        this.allPrevCourse = this.allPrevCourse.sort(function (a, b) {
          return new Date(a.coursestartdate).getTime() - new Date(b.coursestartdate).getTime();
        });
      }).catch(err => this.alertNotificationService.alertError(err));

    this.insigniaService.getInsigniaList().toPromise()
      .then(res => {
        this.allInsignia = res as Insignia[]
        this.allInsignia = this.allInsignia.filter((e) => e.approved)
      }).catch(err => this.alertNotificationService.alertError(err));

    this.packageService.getallPackage().toPromise()
      .then(res => this.allProduct = res as Package[])
      .catch(err => this.alertNotificationService.alertError(err));

    this.invesmentorService.getInvesmentorList().toPromise()
      .then(res => this.allInvesmentor = res)
      .catch(err => this.alertNotificationService.alertError(err));

    this.leadsService.getoccupations().toPromise()
      .then(res => {
        this.occupations = res as any;
        if (!this.occupations || !this.occupations.lists) {
          this.occupations = {
            name: 'Occupations',
            lists: []
          }
        }
      }).catch(err => this.alertNotificationService.alertError(err))

    this.leadsService.getstatewisedistrict().toPromise()
      .then(res => {
        this.statewisedistricts = res
        this.states = this.statewisedistricts.map(e => e.state).sort()
        this.onstateChange()
      }).catch(err => this.alertNotificationService.alertError(err))

    this.leadsService.getbanks().toPromise()
      .then(res => {
        this.allbanks = res
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  progressvalue
  fd = new FormData()
  thirdinsstart = false;
  secinsstart = false;
  forthinsstart = false;
  secinsstarted = false;
  thirdinsstarted = false;
  forthinsstarted = false;
  async submit() {
    var time = null
    await this.leadsService.getCurrentTime().toPromise()
      .then(res => time = new Date(res['time']))
      .catch(err => time = new Date())
    this.offSet = new Date().getTime() - (time ? time.getTime() : new Date().getTime());
    console.log(time, new Date(), this.offSet)
    this.onbstatuschange()
    if (this.currentOnboard && this.currentLead.leadstatus == 'Converted') {
      if (this.currentOnboard.totalfees != this.currentOnboard.paidamount) {
        this.alertNotificationService.alertError('Total Fees and Paid Amount is not equal');
        return;
      }
    }
    /*if (this.currentLead.leadstatus == 'Converted' || this.currentLead.leadstatus == 'Seat Booked') {
      if(!this.currentOnboard.paymentimage){
        this.alertNotificationService.alertInfo('Please Upload First Installment Txn Image');
        return
      }
      else if(this.currentOnboard.manualregcomplete && this.currentOnboard.mode!='mode1' && !this.currentOnboard.secpaymentimage){
        this.alertNotificationService.alertInfo('Please Upload Second Installment Txn Image');
        return
      }
      else if(this.currentOnboard.secmanualregcomplete && this.currentOnboard.mode=='mode3' && !this.currentOnboard.thirdpaymentimage){
        this.alertNotificationService.alertInfo('Please Upload Third Installment Txn Image');
        return
      }
    }*/
    this.currentLead.updatedate = this.CorrectTime();
    if (this.isfollowup(this.currentLead.leadstatus) && this.currentLead.callbackdate) {
      try {
        this.currentLead.callbackdate = new Date(this.currentLead.callbackdate)
      } catch (error) {
        this.alertNotificationService.alertError('Invalid Callback Date Format')
        this.currentLead.callbackdate = null
      }
    } else {
      this.currentLead.callbackdate = null
    }
    if (!this.currentLead.demogiven) {
      this.currentLead.demodate = null
      this.currentLead.demolink = null
    } else if (this.currentLead.demogiven && this.currentLead.isdemoschedule) {
      this.currentLead.demodate = new Date(this.webinarres.start_time);
      // this.currentLead.demolink = this.webinarres.join_url;
    }
    //console.log(this.currentLead)
    var s = this.currentStage(this.currentLead.leadstatus)
    if (this.currentLead.tats) {
      var found = false
      this.currentLead.tats.forEach(e => {
        if (s && e.name != s.name.replace(' ', '_') && !e.end) {
          e.end = this.CorrectTime();
        } else if (s && e.name == s.name.replace(' ', '_')) {
          found = true
        }
      })
      if (!found) {
        if (s && s.islaststage) {
          this.currentLead.tats.push({ name: s.name.replace(' ', '_'), start: this.CorrectTime(), end: this.CorrectTime() })
        } else if (s && !s.islaststage) {
          this.currentLead.tats.push({ name: s.name.replace(' ', '_'), start: this.CorrectTime(), end: null })
        }
      }
    }
    else {
      this.currentLead.tats = []
      if (s && s.islaststage) {
        this.currentLead.tats.push({ name: s.name.replace(' ', '_'), start: this.CorrectTime(), end: this.CorrectTime() })
      } else if (s && !s.islaststage) {
        this.currentLead.tats.push({ name: s.name.replace(' ', '_'), start: this.CorrectTime(), end: null })
      }
    }

    var obj = Object.keys(this.currentLead);
    this.allStages.forEach(e => {
      var a = e.name.replace(' ', '_') + '_TAT_End_Time'
      var b = e.name.replace(' ', '_') + '_TAT_Start_Time'
      var c = e.name.replace(' ', '_') + '_TAT_MAX'
      if (obj.includes(a)) {
        delete this.currentLead[a];
      }
      if (obj.includes(b)) {
        delete this.currentLead[b];
      }
      if (obj.includes(c)) {
        delete this.currentLead[c];
      }
      if (obj.includes('ctt')) {
        delete this.currentLead['ctt'];
      }
    })
    var isStageChanged = false;
    if (this.currentStage(this.currentLead.leadstatus) != this.currentStage(this.duplicateLead.leadstatus)) {
      isStageChanged = true;
    }
    await this.leadsService.leadupdate(this.currentLead, isStageChanged).toPromise()
      .then(res => {
        this.createLog()
        this.duplicateLead = JSON.parse(JSON.stringify(this.currentLead))
        this.alertNotificationService.toastAlertSuccess('Lead Updated')
        // if (this.isSubmitAndCreateOrder) {
        //   this.newOrder();
        // }
      }).catch(err => this.alertNotificationService.alertError(err))

    if (this.onboardingStatus.includes(this.currentLead.leadstatus)) {
      this.currentOnboard.leadid = this.currentLead._id
      this.currentOnboard.createdAt = this.currentOnboard.createdAt ? this.currentOnboard.createdAt : this.CorrectTime()
      this.currentOnboard.manualregcomplete = this.currentOnboard.manualregcomplete ? true : false
      this.currentOnboard.secmanualregcomplete = (this.currentOnboard.mode == 'mode2' || this.currentOnboard.mode == 'mode3' || this.currentOnboard.mode == 'mode4' || this.currentOnboard.mode == 'mode5') && this.currentOnboard.secmanualregcomplete ? true : false
      this.currentOnboard.thirdmanualregcomplete = (this.currentOnboard.mode == 'mode3' || this.currentOnboard.mode == 'mode4') && this.currentOnboard.thirdmanualregcomplete ? true : false
      this.currentOnboard.forthmanualregcomplete = this.currentOnboard.mode == 'mode4' && this.currentOnboard.forthmanualregcomplete ? true : false
      if (this.currentLead.deviceHeld && this.currentLead.deviceHeld == 'IOS Only') {
        this.currentOnboard.telegramcomplete = this.currentOnboard.telegramcomplete ? this.currentOnboard.telegramcomplete : 'Pending'
      }
      else {
        this.currentOnboard.telegramcomplete = 'Complete';
        this.currentOnboard.telegramtime = this.currentOnboard.telegramtime ? this.currentOnboard.telegramtime : new Date();
        this.currentOnboard.telegramregdonebyid = '';
        this.currentOnboard.telegramregdonebyname = '';
      }
      if ((this.currentOnboard.mode == 'mode2' || this.currentOnboard.mode == 'mode3' || this.currentOnboard.mode == 'mode4' || this.currentOnboard.mode == 'mode5') && this.secinsstart) {
        this.currentOnboard.secregstarttime = this.currentOnboard.secregstarttime ? this.currentOnboard.secregstarttime : this.CorrectTime();
      } else {
        this.currentOnboard.secpaymentamount = null
        this.currentOnboard.secpaymentdate = null
        this.currentOnboard.secpaymentimage = null
        this.currentOnboard.secpaymentmethod = null;
        this.currentOnboard.sectxnid = null
      }
      if ((this.currentOnboard.mode == 'mode3' || this.currentOnboard.mode == 'mode4') && this.thirdinsstart) {
        this.currentOnboard.thirdregstarttime = this.currentOnboard.thirdregstarttime ? this.currentOnboard.thirdregstarttime : this.CorrectTime();
      } else {
        this.currentOnboard.thirdpaymentamount = null
        this.currentOnboard.thirdpaymentdate = null
        this.currentOnboard.thirdpaymentimage = null
        this.currentOnboard.thirdpaymentmethod = null;
        this.currentOnboard.thirdtxnid = null
      }
      if ((this.currentOnboard.mode == 'mode4') && this.forthinsstart) {
        this.currentOnboard.forthregstarttime = this.currentOnboard.forthregstarttime ? this.currentOnboard.forthregstarttime : this.CorrectTime();
      } else {
        this.currentOnboard.forthpaymentamount = null
        this.currentOnboard.forthpaymentdate = null
        this.currentOnboard.forthpaymentimage = null
        this.currentOnboard.forthpaymentmethod = null;
        this.currentOnboard.forthtxnid = null
      }
      if (!this.currentOnboard.studentidgencomplete) {
        var user = this.allUser.filter(e => e.telephone == this.currentLead.phone || e.email == this.currentLead.email)
        if (user.length == 1) {
          this.currentOnboard.studentid = user[0].invid;
          this.currentOnboard.studentidgencomplete = true;
          this.currentOnboard.studentidgentime = this.CorrectTime();
        } else {
          this.currentOnboard.studentid = ''
          this.currentOnboard.studentidgencomplete = false
        }
      }
      if (this.imgavailable) {
        if (this.filesToUpload1)
          this.fd.append("file", this.filesToUpload1, this.currentOnboard.paymentimage);
        if (this.filesToUpload2)
          this.fd.append("file", this.filesToUpload2, this.currentOnboard.secpaymentimage);
        if (this.filesToUpload3)
          this.fd.append("file", this.filesToUpload3, this.currentOnboard.thirdpaymentimage);
        if (this.filesToUpload4)
          this.fd.append("file", this.filesToUpload4, this.currentOnboard.forthpaymentimage);

        this.courseService.postFile(this.fd).subscribe(
          res => {
            if (res.type === HttpEventType.UploadProgress) {
              this.progressvalue = Math.round(100 * res.loaded / res.total);
            }
            if (res.type === HttpEventType.Response) {
              this.filesToUpload1 = null
              this.filesToUpload2 = null
              this.filesToUpload3 = null
              this.filesToUpload4 = null
              this.imgavailable = false
            }
          },
          err => this.alertNotificationService.alertError(err)
        );
      }
      if (!this.currentOnboard.below_selling_approval) {
        this.currentOnboard.below_selling_approval = false;
        this.currentOnboard.below_selling_approval_by = '';
      }
      await this.leadsService.postOnboardData(this.currentOnboard, 'update').toPromise()
        .then(res => {
          this.currentOnboard = res as Onboardstudent
          this.createLog()
          this.duplicateOnboard = JSON.parse(JSON.stringify(this.currentOnboard))
          this.onboardChanged.emit(this.currentOnboard);
          if (this.currentLead.leadstatus != 'Seat Bkd-not Cnvrtd') {
            this.alertNotificationService.toastAlertSuccess('Student Onboarding Process Initiated')
          }
        }).catch(err => this.alertNotificationService.alertError(err))
    }
    this.leadSubmit.emit();
  }

  selectservice() {
    const modalRef = this.modalService.open(SelectServiceComponent, { centered: true, scrollable: true, size: 'xl' })
    modalRef.componentInstance.lists = {
      allCurrentCourse: this.allCurrentCourse,
      allPrevCourse: this.allPrevCourse,
      allInsignia: this.allInsignia,
      allProduct: this.allProduct,
      allInvesmentor: this.allInvesmentor
    }
    modalRef.result.then((result) => {
      if (result) {
        this.currentLead.servicecode = result.servicecode
        this.currentLead.servicename = result.servicename
        this.currentLead.servicetype = result.servicetype
      }
    }).catch(err => { })
  }

  selectprice() {
    var service
    switch (this.currentLead.servicetype) {
      case 'course':
        service = this.allCurrentCourse.filter(e => e.approved && e.coursecode == this.currentLead.servicecode)[0]
        break;
      case 'insignia':
        service = this.allInsignia.filter(e => e.approved && e.code == this.currentLead.servicecode)[0]
        break;
      case 'product':
        service = this.allProduct.filter(e => e.approve && e.productid == this.currentLead.servicecode)[0]
        break;
      case 'subscription':
        service = this.allPrevCourse.filter(e => e.approved && e.coursecode == this.currentLead.servicecode)[0]
        break;
      case 'invesmentor':
        service = this.allInvesmentor.filter(e => e.approved && e.code == this.currentLead.servicecode)[0]
        break;
      default:
        service = null
        break;
    }
    const modalRef = this.modalService.open(SelectPriceComponent, { centered: true, scrollable: true, size: 'xl' })
    modalRef.componentInstance.data = {
      service: service,
      servicetype: this.currentLead.servicetype,
      staff: this.currentLead.leadowner
    }
    modalRef.result.then((result) => {
      if (result) {

      }
    }).catch(err => { })
  }

  onstatuschange() {
    this.onOnboardingCheck();
    this.currentLead.callbackdate = null;
  }

  onOnboardingCheck() {
    if (this.onboardingStatus.includes(this.currentLead.leadstatus)) {
      this.checkStudent();
    } else {
      this.ismandatory = false
    }
  }
  checkStudent() {
    this.ismandatory = true
    var user = this.allUser.filter(e => e.telephone == this.currentLead.phone || e.email == this.currentLead.email)
    if (user.length == 1) {
      var inv = user[0].invid;
      this.isNewStudent = false
    } else {
      this.isNewStudent = true
    }
  }
  isNewStudent: boolean = false;

  isSubmitAndCreateOrder = false;
  newOrder() {
    // this.router.navigate(['/admin/orders/new-order'], { queryParams: { lead_id: this.currentLead._id } })
    const url = `/admin/orders/new-order?lead_id=${this.currentLead._id}`;
    window.open(url, '_blank');
  }
  goToOrder() {
    // this.router.navigate(['/admin/orders/new-order'], { queryParams: { lead_id: this.currentLead._id } })
    if (this.orderDetails && this.orderDetails?.orderID) {
      const url = `/admin/orders/${this.orderDetails.orderID}`;
      window.open(url, '_blank');
    }
  }
  studentreg() {
    this.alertNotificationService.alertCustomMsg('Please verify the email and mobile number before proceeding further')
      .then(async result => {
        if (result.isConfirmed) {
          var user = this.allUser.filter(e => e.telephone == this.currentLead.phone || e.email == this.currentLead.email)
          if (user.length == 1) {
            this.ismandatory = true
          } else {
            var newUser = new User();
            newUser.city = this.currentLead.city ? this.currentLead.city : null
            newUser.dob = this.currentLead.dob ? this.currentLead.dob : null
            newUser.gender = this.currentLead.gender ? this.currentLead.gender : null
            newUser.state = this.currentLead.state ? this.currentLead.state : null
            newUser.address = this.currentLead.address ? this.currentLead.address : null;
            newUser.gstin = this.currentLead.gstin ? this.currentLead.gstin : null;
            newUser.pincode = this.currentLead.pincode ? this.currentLead.pincode : null;
            newUser.telephone = this.currentLead.phone
            newUser.alternatenum = this.currentLead.whatsappnum ? this.currentLead.whatsappnum : null;
            newUser.secondarynum = this.currentLead.alternatenumber ? this.currentLead.alternatenumber : null;
            newUser.email = this.currentLead.email
            newUser.fullName = this.currentLead.name
            newUser.password = this.currentLead.phone
            newUser.telegram = this.currentLead.telegram
            newUser.role = 'student'
            this.alertNotificationService.alertCustomMsg('Do you want to register this student?')
              .then(async result => {
                if (result.isConfirmed) {
                  this.userService.postUser(newUser).toPromise()
                    .then(res => {
                      this.isNewStudent = false;
                      this.ismandatory = true
                    }).catch(err => this.alertNotificationService.alertError(err));
                }
              }).catch(err => { });
          }
        }
      }).catch(err => { });
  }

  onbstatuschange() {
    if (this.currentLead.leadstatus != 'Seat Bkd-not Cnvrtd') {
      if (this.currentOnboard.mode == 'mode1') {
        this.currentLead.leadstatus = 'Converted';
      } else if ((this.currentOnboard.mode == 'mode2' || this.currentOnboard.mode == 'mode5') && this.secinsstart) {
        this.currentLead.leadstatus = 'Converted';
      } else if (this.currentOnboard.mode == 'mode2') {
        this.currentLead.leadstatus = 'Seat Booked';
      } else if (this.currentOnboard.mode == 'mode3' && this.thirdinsstart) {
        this.currentLead.leadstatus = 'Converted';
      } else if (this.currentOnboard.mode == 'mode4' && this.forthinsstart) {
        this.currentLead.leadstatus = 'Converted';
      } else if ((this.currentOnboard.mode == 'mode3' || this.currentOnboard.mode == 'mode4') && this.secinsstart) {
        this.currentLead.leadstatus = 'Partially Converted';
      } else if (this.currentOnboard.mode == 'mode4' && this.thirdinsstart) {
        this.currentLead.leadstatus = 'Partially Converted';
      } else if (this.currentOnboard.mode == 'mode3' || this.currentOnboard.mode == 'mode4') {
        this.currentLead.leadstatus = 'Seat Booked';
      } else if (this.currentOnboard.mode == 'mode5') {
        this.currentLead.leadstatus = 'Partially Converted';
      }
    }
  }

  ondemochange() {
    if (this.currentLead.demogiven && this.currentLead.isdemoschedule) {
      this.currentLead.demodate = new Date(this.webinarres.start_time);
      // this.currentLead.demolink = this.webinarres.join_url;
    }
  }

  isfollowup(s) {
    return this.followupstatus.includes(s)
  }

  leadhistory() {
    this.leadhist.emit()
  }
  hide = false;
  webinarres = new Webinar()
  leaddemo = new DemoScheduleDisp();
  submitf = false
  errormsg = ''
  type = 'Demo'
  submitForm() {
    this.errormsg = ''
    this.submitf = true
    if (this.currentLead.isdemoschedule) {
      var s = {
        start_time: this.datePipe.transform(this.leaddemo.start_time.toString(), "yyyy-MM-ddTHH:mm:ss"),
        end_time: this.addMinutes(new Date(this.leaddemo.start_time), 75),
        leadid: this.currentLead._id,
        topic: this.leaddemo.topic
      }
      this.leadsService.updateschedule(s).toPromise()
        .then(res => {
          this.webinarres = res as Webinar;
          this.hide = true;
          this.modalService.dismissAll();
          this.alertNotificationService.toastAlertSuccess('Demo Class Schedule Time Changed');
          this.courseService.getmywebinar(this.currentLead._id).toPromise()
            .then(res => {
              this.webinarres = res[0];
            }).catch(err => this.alertNotificationService.alertError(err))
        }).catch(err => {
          this.alertNotificationService.alertError(err)
          this.submitf = false;
        })
    }
    else {
      var s = {
        start_time: this.datePipe.transform(this.leaddemo.start_time.toString(), "yyyy-MM-ddTHH:mm:ss"),
        end_time: this.addMinutes(new Date(this.leaddemo.start_time), 75),
        leadid: this.currentLead._id,
        topic: this.leaddemo.topic
      }
      this.leadsService.createschedule(s).toPromise()
        .then(res => {
          this.webinarres = res as Webinar;
          this.hide = true;
          this.currentLead.isdemoschedule = true;
          this.submit();
          this.alertNotificationService.toastAlertSuccess('Demo Class Scheduled');
        }).catch(err => {
          this.alertNotificationService.alertError(err)
          this.submitf = false;
        })
    }
  }


  async schedule(content) {
    await this.leadsService.getallschedule('all').toPromise()
      .then(res => {
        this.allDemoSchedule = res;
        this.createevent();
      }).catch(err => this.alertNotificationService.alertError(err));
    if (!this.currentLead.isdemoschedule) {
      this.leaddemo.start_time = null;
      this.leaddemo.topic = `Demo Class for ${this.currentLead.name}(${this.currentLead.phone}) - ${this.currentLead.leadowner}`;
    } else {
      this.hide = true
      this.submitf = true
      this.leaddemo.topic = this.webinarres.topic;
      this.leaddemo.start_time = new Date(this.webinarres.start_time);
    }
    this.modalService.open(content, { centered: true, size: 'lg', scrollable: true }).result.then((result) => {

    }).catch((res) => { });
  }

  deleteschedule() {
    this.alertNotificationService.alertDelete()
      .then(result => {
        if (result.isConfirmed) {
          var s = this.allDemoSchedule.find(e => e.leadid == this.currentLead._id)
          if (s) {
            this.leadsService.deleteschedule(s._id, this.webinarres.id).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Webinar Deleted Successfully');
                this.currentLead.isdemoschedule = false;
                this.submit();
                this.modalService.dismissAll();
                this.webinarres = new Webinar();
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        }
      })
  }
  isdateacceptable = true
  ontimechange() {
    this.isdateacceptable = true;
    var flag = 0
    this.allDemoSchedule.forEach(e => {
      if (e.leadid != this.currentLead._id && (moment(this.leaddemo.start_time).isBetween(e.start_time, e.end_time, undefined, "[]") || moment(this.leaddemo.start_time).add(75, 'minute').isBetween(e.start_time, e.end_time, undefined, "[]"))) {
        flag++;
        if (flag >= 2) {
          this.isdateacceptable = false;
        }
      }
    })
    if (!this.isdateacceptable) {
      this.alertNotificationService.alertInfo("Time Slot Not Available. Select Another Time");
    }
  }

  createevent() {
    this.events = []
    this.allDemoSchedule.forEach(
      e => {
        try {
          var a = {
            start: new Date(e.start_time.toString().replace('Z', '')),
            end: new Date(e.end_time.toString()),
            title: 'Booked at ' + this.datePipe.transform(e.start_time.toString().replace('Z', ''), 'h:mm a') + ' - ' + this.datePipe.transform(e.end_time.toString(), 'h:mm a'),
            backgroundColor: e.leadid != this.currentLead._id ? colors.yellow : colors.blue,
          }
          this.events.push(a)
        } catch (err) {
          console.error(err)
        }
      }
    )
  }


  districts: string[] = []

  onstateChange() {
    if (this.currentLead && this.currentLead.state && this.statewisedistricts && this.statewisedistricts.length > 0) {
      var state = this.statewisedistricts.filter(e => e.state == this.currentLead.state)[0]
      if (!state) {
        this.currentLead.state = ''
      }
      this.districts = state ? state.districts : [];
      if (!this.districts.includes(this.currentLead.city)) {
        this.currentLead.city = ''
      }
    } else {
      this.districts = []
    }
  }
  filesToUpload1: File
  filesToUpload2: File
  filesToUpload3: File
  filesToUpload4: File
  handelFileInput(event) {
    if (event.target.files[0]) {
      this.imgavailable = true
      this.currentOnboard.paymentimage = this.currentLead._id + '_1st_' + event.target.files[0].name;
      this.filesToUpload1 = <File>event.target.files[0]
    } else {
      this.currentOnboard.paymentimage = this.duplicateOnboard.paymentimage;
      this.filesToUpload1 = null
    }
  }

  handelFileInput1(event) {
    if (event.target.files[0]) {
      this.imgavailable = true
      this.currentOnboard.secpaymentimage = this.currentLead._id + '_2nd_' + event.target.files[0].name
      this.filesToUpload2 = <File>event.target.files[0]
      //this.currentOnboard.secregstarttime=this.CorrectTime();
    } else {
      this.currentOnboard.secpaymentimage = this.duplicateOnboard.secpaymentimage;
      //this.currentOnboard.secregstarttime=this.duplicateOnboard.secregstarttime;
      this.filesToUpload2 = null
    }
  }



  handelFileInput2(event) {
    if (event.target.files[0]) {
      this.imgavailable = true
      this.currentOnboard.thirdpaymentimage = this.currentLead._id + '_3rd_' + event.target.files[0].name
      this.filesToUpload3 = <File>event.target.files[0]
      //this.currentOnboard.thirdregstarttime=this.CorrectTime();
    } else {
      this.currentOnboard.thirdpaymentimage = this.duplicateOnboard.thirdpaymentimage;
      //this.currentOnboard.thirdregstarttime=this.duplicateOnboard.thirdregstarttime;
      this.filesToUpload3 = null
    }
  }

  handelFileInput3(event) {
    if (event.target.files[0]) {
      this.imgavailable = true
      this.currentOnboard.forthpaymentimage = this.currentLead._id + '_4th_' + event.target.files[0].name
      this.filesToUpload4 = <File>event.target.files[0]
      //this.currentOnboard.thirdregstarttime=this.CorrectTime();
    } else {
      this.currentOnboard.forthpaymentimage = this.duplicateOnboard.forthpaymentimage;
      //this.currentOnboard.thirdregstarttime=this.duplicateOnboard.thirdregstarttime;
      this.filesToUpload4 = null
    }
  }

  onamountadded() {
    if (this.currentOnboard.mode == 'mode4') {
      var a = this.currentOnboard.paymentamount ? this.currentOnboard.paymentamount : 0;
      var b = this.currentOnboard.secpaymentamount ? this.currentOnboard.secpaymentamount : 0;
      var c = this.currentOnboard.thirdpaymentamount ? this.currentOnboard.thirdpaymentamount : 0;
      var d = this.currentOnboard.forthpaymentamount ? this.currentOnboard.forthpaymentamount : 0;
      this.currentOnboard.paidamount = Number(a) + Number(b) + Number(c) + Number(d);
    } else if (this.currentOnboard.mode == 'mode3') {
      var a = this.currentOnboard.paymentamount ? this.currentOnboard.paymentamount : 0;
      var b = this.currentOnboard.secpaymentamount ? this.currentOnboard.secpaymentamount : 0;
      var c = this.currentOnboard.thirdpaymentamount ? this.currentOnboard.thirdpaymentamount : 0;
      this.currentOnboard.paidamount = Number(a) + Number(b) + Number(c);
    } else if (this.currentOnboard.mode == 'mode2' || this.currentOnboard.mode == 'mode5') {
      var a = this.currentOnboard.paymentamount ? this.currentOnboard.paymentamount : 0;
      var b = this.currentOnboard.secpaymentamount ? this.currentOnboard.secpaymentamount : 0;
      this.currentOnboard.paidamount = Number(a) + Number(b);
    } else if (this.currentOnboard.mode == 'mode1') {
      var a = this.currentOnboard.paymentamount ? this.currentOnboard.paymentamount : 0;
      this.currentOnboard.paidamount = Number(a);
    } else {
      this.currentOnboard.paidamount = 0;
    }
  }

  copied() {
    var text = "Demo Class ID: " + this.webinarres.id;
    text += "\r\nDemo Class Password: " + this.webinarres.password;
    text += "\r\nDemo Class Link: " + this.webinarres.join_url;
    text += "\r\nTime: " + this.datePipe.transform(this.webinarres.start_time, 'medium');
    this._clipboardService.copy(text)
    this.alertNotificationService.toastAlertSuccess('Details Copied')
  }

  changehistory() {
    const modalRef = this.modalService.open(LeadChangeLogComponent, { centered: true, scrollable: true, size: 'xl' })
    modalRef.componentInstance.id = this.currentLead._id
    modalRef.result.then((result) => {
      if (result) {

      }
    }).catch(err => { })
  }

  currentStage(s) {
    return this.allStages && this.allStages.length > 0 ? this.allStages.find(e => e.status.includes(s) && e.leadLevelID == this.currentLead.level) : null;
  }

  getbreachdetais() {
    var s = this.currentStage(this.currentLead.leadstatus)
    if (s) {
      var t = this.currentLead.tats ? this.currentLead.tats.find(e => e.name == s.name.replace(' ', '_')) : null;
      if (!s.islaststage && t && moment(t.start).add(s.maxtime, 'days').isBefore(this.CorrectTime())) {
        //console.log(moment(t.start).add(s.maxtime,'days').toDate(),this.CorrectTime(),moment(t.start).add(s.maxtime,'days').diff(this.CorrectTime(),'hours'))
        return ['Overdue ' + moment(t.start).add(s.maxtime, 'days').fromNow(true), 'danger'];
      } else if (!s.islaststage && t && moment(t.start).add(s.maxtime, 'days').isAfter(this.CorrectTime())) {
        //console.log(moment(t.start).add(s.maxtime,'days').toDate(),this.CorrectTime(),moment(t.start).add(s.maxtime,'days').diff(this.CorrectTime(),'hours'))
        var c = moment(t.start).add(s.idealtime, 'days').isAfter(this.CorrectTime())
        return ['Due In ' + moment(t.start).add(s.maxtime, 'days').fromNow(true), c ? 'success' : 'warning'];
      }
    }
    return [null, null];
  }

  timeElapsed() {
    try {
      var s = this.currentStage(this.currentLead.leadstatus);
      if (this.currentTat && s && this.currentTat.stage_id == s._id) {
        var start = this.tat_start_time;
        var maxTime = s.maxtime * 86400000;
        var idealTime = s.idealtime * 86400000;
        var fromTime = this.CorrectTime();
        if (this.tat_end_time.getTime() < fromTime.getTime()) {
          this.isTimerStopped = true;
        }
        if (this.currentTat?.is_active && maxTime > this.currentTat?.time_elapsed) {
          var time_remaining = maxTime - this.currentTat?.time_elapsed;
          var c = false;
          if (idealTime >= this.currentTat?.time_elapsed) {
            c = moment(start).add((idealTime - this.currentTat?.time_elapsed), 'milliseconds').isAfter(fromTime)
          }
          if (this.isTimerStopped) {
            return ['Due ' + moment(start).add(time_remaining, 'milliseconds').from(start, false), c ? 'success' : 'warning'];
          } else {
            return ['Due In ' + moment(start).add(time_remaining, 'milliseconds').fromNow(true), c ? 'success' : 'warning'];
          }
        } else if (this.currentTat?.is_active) {
          var time_exceeded = this.currentTat?.time_elapsed - maxTime;
          if (this.isTimerStopped) {
            return ['Overdue ' + moment(start).subtract(time_exceeded, 'milliseconds').from(start), 'danger'];
          }
          else {
            return ['Overdue ' + moment(start).subtract(time_exceeded, 'milliseconds').fromNow(true), 'danger'];
          }
        } else {
          return [null, null];
        }
      } else {
        return [null, null];
      }
    } catch (err) {
      console.log(err);
      return [null, null];
    }
  }

  createLog() {
    //console.log(this.currentLead,this.duplicateLead)
    var logs = new LeadChangelog();
    logs.leadid = this.currentLead._id;
    logs.changes = [];
    if (this.currentLead.leadstatus != this.duplicateLead.leadstatus) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Lead Status has been Changed to ' + this.currentLead.leadstatus
      logs.changes.push(change)
    }
    if (this.currentLead.name != this.duplicateLead.name) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Name has been Changed to ' + this.currentLead.name
      logs.changes.push(change)
    }
    if (this.currentLead.email != this.duplicateLead.email) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Email has been Changed From ' + this.currentLead.email + ' to ' + this.currentLead.email
      logs.changes.push(change)
    }
    if (this.currentLead.phone != this.duplicateLead.phone) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Phone has been Changed From ' + this.duplicateLead.phone + ' to ' + this.currentLead.phone
      logs.changes.push(change)
    }
    if (this.currentLead.whatsappnum != this.duplicateLead.whatsappnum) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Whatsapp has been Changed From ' + this.duplicateLead.whatsappnum + ' to ' + this.currentLead.whatsappnum
      logs.changes.push(change)
    }
    if (this.currentLead.alternatenumber != this.duplicateLead.alternatenumber) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Alternate Number has been Changed From ' + this.duplicateLead.alternatenumber + ' to ' + this.currentLead.alternatenumber
      logs.changes.push(change)
    }
    if (this.currentLead.telegram != this.duplicateLead.telegram) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Telegram has been Changed From ' + this.duplicateLead.telegram + ' to ' + this.currentLead.telegram
      logs.changes.push(change)
    }
    if (this.currentLead.gender != this.duplicateLead.gender) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Gender has been Changed to ' + this.currentLead.gender
      logs.changes.push(change)
    }
    if (this.currentLead.dob != this.duplicateLead.dob) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'D.O.B has been Changed to ' + this.datePipe.transform(this.currentLead.dob, 'dd/MM/yyyy')
      logs.changes.push(change)
    }
    if (this.currentLead.occupation != this.duplicateLead.occupation) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Occupation has been Changed to ' + this.currentLead.occupation
      logs.changes.push(change)
    }
    if (this.currentLead.experience != this.duplicateLead.experience) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Experience has been Changed to ' + this.currentLead.experience
      logs.changes.push(change)
    }
    if (this.currentLead.address != this.duplicateLead.address) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Address has been Changed to ' + this.currentLead.address
      logs.changes.push(change)
    }
    if (this.currentLead.state != this.duplicateLead.state) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'State has been Changed to ' + this.currentLead.state
      logs.changes.push(change)
    }
    if (this.currentLead.city != this.duplicateLead.city) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'District has been Changed to ' + this.currentLead.city;//previously city
      logs.changes.push(change)
    }
    if (this.currentLead.pincode != this.duplicateLead.pincode) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Pincode has been Changed to ' + this.currentLead.pincode
      logs.changes.push(change)
    }
    if (this.currentLead.gstin != this.duplicateLead.gstin) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'GSTIN has been Changed to ' + this.currentLead.gstin
      logs.changes.push(change)
    }
    if (this.isfollowup(this.currentLead.leadstatus) && this.currentLead.callbackdate != this.duplicateLead.callbackdate) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Callback/ Followup Date has been Changed to ' + this.datePipe.transform(this.currentLead.callbackdate, 'dd/MM/yy, hh:mm a')
      logs.changes.push(change)
    }
    if (this.currentLead.servicetype != this.duplicateLead.servicetype) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Service Type has been Changed to ' + this.currentLead.servicetype
      logs.changes.push(change)
    }
    if (this.currentLead.servicecode != this.duplicateLead.servicecode) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Service Code has been Changed to ' + this.currentLead.servicecode
      logs.changes.push(change)
    }
    if (this.currentLead.servicename != this.duplicateLead.servicename) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Service Name has been Changed to ' + this.currentLead.servicename
      logs.changes.push(change)
    }
    if (this.currentLead.isdemoschedule != this.duplicateLead.isdemoschedule && this.currentLead.isdemoschedule) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Demo Scheduled for ' + this.datePipe.transform(this.webinarres.start_time, 'dd/MM/yy, h:mm a')
      logs.changes.push(change)
    }
    var cd = this.currentLead.demodate ? new Date(this.currentLead.demodate) : null
    var dd = this.duplicateLead.demodate ? new Date(this.duplicateLead.demodate) : null
    if (cd != dd) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Demo Date has been Changed to ' + this.datePipe.transform(this.currentLead.demodate, 'dd/MM/yy')
      logs.changes.push(change)
    }
    if (this.currentLead.demogiven != this.duplicateLead.demogiven) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Demo Given has been Changed to ' + (this.currentLead.demogiven ? 'Yes' : 'No')
      logs.changes.push(change)
    }
    if (this.currentLead.demolink != this.duplicateLead.demolink) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Demo Link has been Changed to ' + this.currentLead.demolink
      logs.changes.push(change)
    }
    if (this.currentLead.comment != this.duplicateLead.comment) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Comment: ' + this.currentLead.comment
      logs.changes.push(change)
    }
    if (this.currentLead.creditcard != this.duplicateLead.creditcard) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Credit Card has been Changed to ' + (this.currentLead.creditcard ? 'Yes' : 'No')
      logs.changes.push(change)
    }
    var a = this.currentLead.ccbank ? this.currentLead.ccbank.toString() : null
    var b = this.duplicateLead.ccbank ? this.duplicateLead.ccbank.toString() : null
    if (a != b) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Credit Card Banks has been Changed to ' + this.currentLead.ccbank.join(', ')
      logs.changes.push(change)
    }
    if (this.currentLead.itrfill != this.duplicateLead.itrfill) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'ITR Filling has been Changed to ' + (this.currentLead.itrfill ? 'Yes' : 'No')
      logs.changes.push(change)
    }
    if (this.currentLead.isInsigniaProspect != this.duplicateLead.isInsigniaProspect) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Insignia Prospect has been Changed to ' + (this.currentLead.isInsigniaProspect ? 'Yes' : 'No')
      logs.changes.push(change)
    }
    if (this.currentLead.isDematAccountOpened != this.duplicateLead.isDematAccountOpened) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Demat Account opened has been Changed to ' + (this.currentLead.isDematAccountOpened ? 'Yes' : 'No')
      logs.changes.push(change)
    }
    if (this.currentLead.monthlyincome != this.duplicateLead.monthlyincome) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Monthly Income has been Changed to ' + this.currentLead.monthlyincome
      logs.changes.push(change)
    }
    if (this.currentLead.deviceHeld != this.duplicateLead.deviceHeld) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Device Held has been Changed to ' + this.currentLead.deviceHeld
      logs.changes.push(change)
    }
    if (this.currentOnboard.studentidgencomplete != this.duplicateOnboard.studentidgencomplete && this.currentOnboard.secmanualregcomplete) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Existing Student. Student Registration Completed.';
      logs.changes.push(change)
    }
    if (this.currentOnboard.createdAt != this.duplicateOnboard.createdAt) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'First Installment Initiated ' + this.datePipe.transform(this.currentOnboard.createdAt, 'dd/MM/yyyy')
      logs.changes.push(change)
    }
    if (this.currentOnboard.mode != this.duplicateOnboard.mode) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Mode has been Changed to ' + this.currentOnboard.mode
      logs.changes.push(change)
    }
    if (this.currentOnboard.couponcode != this.duplicateOnboard.couponcode) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Coupon Code has been Changed to ' + this.currentOnboard.couponcode
      logs.changes.push(change)
    }
    if (this.currentOnboard.totalfees != this.duplicateOnboard.totalfees) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Total Fees has been Changed to Rs. ' + this.currentOnboard.totalfees
      logs.changes.push(change)
    }
    if (this.currentOnboard.paidamount != this.duplicateOnboard.paidamount) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Paid Amount has been Changed to Rs. ' + this.currentOnboard.paidamount
      logs.changes.push(change)
    }
    if (this.currentOnboard.paymentdate != this.duplicateOnboard.paymentdate) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'First Ins Payment Date has been Changed to ' + this.datePipe.transform(this.currentOnboard.paymentdate, 'dd/MM/yyyy')
      logs.changes.push(change)
    }
    if (this.currentOnboard.paymentmethod != this.duplicateOnboard.paymentmethod) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'First Ins Payment Method has been Changed to ' + this.currentOnboard.paymentmethod
      logs.changes.push(change)
    }
    if (this.currentOnboard.txnid != this.duplicateOnboard.txnid) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'First Ins Txn ID has been Changed to ' + this.currentOnboard.txnid
      logs.changes.push(change)
    }

    if (this.currentOnboard.paymentamount != this.duplicateOnboard.paymentamount) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'First Ins amount has been Changed to ' + this.currentOnboard.paymentamount
      logs.changes.push(change)
    }

    if (this.currentOnboard.paymentimage != this.duplicateOnboard.paymentimage) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'First Ins Image has been Changed to ' + this.currentOnboard.paymentimage
      logs.changes.push(change)
    }
    if (this.currentOnboard.secregstarttime != this.duplicateOnboard.secregstarttime) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Second Installment Initiated ' + this.datePipe.transform(this.currentOnboard.secregstarttime, 'dd/MM/yyyy')
      logs.changes.push(change)
    }
    if (this.currentOnboard.secpaymentdate != this.duplicateOnboard.secpaymentdate) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Second Ins Payment Date has been Changed to ' + this.datePipe.transform(this.currentOnboard.secpaymentdate, 'dd/MM/yyyy')
      logs.changes.push(change)
    }
    if (this.currentOnboard.secpaymentmethod != this.duplicateOnboard.secpaymentmethod) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Second Ins Payment Method has been Changed to ' + this.currentOnboard.secpaymentmethod
      logs.changes.push(change)
    }

    if (this.currentOnboard.sectxnid != this.duplicateOnboard.sectxnid) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Second Ins Txn ID has been Changed to ' + this.currentOnboard.sectxnid
      logs.changes.push(change)
    }

    if (this.currentOnboard.secpaymentamount != this.duplicateOnboard.secpaymentamount) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Second Ins amount has been Changed to ' + this.currentOnboard.secpaymentamount
      logs.changes.push(change)
    }

    if (this.currentOnboard.secpaymentimage != this.duplicateOnboard.secpaymentimage) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Second Ins Image has been Changed to ' + this.currentOnboard.secpaymentimage
      logs.changes.push(change)
    }
    if (this.currentOnboard.thirdregstarttime != this.duplicateOnboard.thirdregstarttime) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Third Installment Initiated ' + this.datePipe.transform(this.currentOnboard.thirdregstarttime, 'dd/MM/yyyy')
      logs.changes.push(change)
    }
    if (this.currentOnboard.thirdpaymentdate != this.duplicateOnboard.thirdpaymentdate) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Third Ins Payment Date has been Changed to ' + this.datePipe.transform(this.currentOnboard.thirdpaymentdate, 'dd/MM/yyyy')
      logs.changes.push(change)
    }
    if (this.currentOnboard.thirdpaymentmethod != this.duplicateOnboard.thirdpaymentmethod) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Third Ins Payment Method has been Changed to ' + this.currentOnboard.thirdpaymentmethod
      logs.changes.push(change)
    }

    if (this.currentOnboard.thirdtxnid != this.duplicateOnboard.thirdtxnid) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Third Ins Txn ID has been Changed to ' + this.currentOnboard.thirdtxnid
      logs.changes.push(change)
    }

    if (this.currentOnboard.thirdpaymentamount != this.duplicateOnboard.thirdpaymentamount) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Third Ins amount has been Changed to ' + this.currentOnboard.thirdpaymentamount
      logs.changes.push(change)
    }

    if (this.currentOnboard.thirdpaymentimage != this.duplicateOnboard.thirdpaymentimage) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Third Ins Image has been Changed to ' + this.currentOnboard.thirdpaymentimage
      logs.changes.push(change)
    }
    if (this.currentOnboard.forthregstarttime != this.duplicateOnboard.forthregstarttime) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Forth Installment Initiated ' + this.datePipe.transform(this.currentOnboard.forthregstarttime, 'dd/MM/yyyy')
      logs.changes.push(change)
    }
    if (this.currentOnboard.forthpaymentdate != this.duplicateOnboard.forthpaymentdate) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Forth Ins Payment Date has been Changed to ' + this.datePipe.transform(this.currentOnboard.forthpaymentdate, 'dd/MM/yyyy')
      logs.changes.push(change)
    }
    if (this.currentOnboard.forthpaymentmethod != this.duplicateOnboard.forthpaymentmethod) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Forth Ins Payment Method has been Changed to ' + this.currentOnboard.forthpaymentmethod
      logs.changes.push(change)
    }

    if (this.currentOnboard.forthtxnid != this.duplicateOnboard.forthtxnid) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Forth Ins Txn ID has been Changed to ' + this.currentOnboard.forthtxnid
      logs.changes.push(change)
    }

    if (this.currentOnboard.forthpaymentamount != this.duplicateOnboard.forthpaymentamount) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Forth Ins amount has been Changed to ' + this.currentOnboard.forthpaymentamount
      logs.changes.push(change)
    }

    if (this.currentOnboard.forthpaymentimage != this.duplicateOnboard.forthpaymentimage) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Forth Ins Image has been Changed to ' + this.currentOnboard.forthpaymentimage
      logs.changes.push(change)
    }
    if (this.currentOnboard.below_selling_price != this.duplicateOnboard.below_selling_price) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = 'Service is Selling Below the Service Minimum Price';
      logs.changes.push(change)
    }
    if (this.currentOnboard.below_selling_price_reason != this.duplicateOnboard.below_selling_price_reason) {
      var change = new LeadChanges();
      change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
      change.date = this.CorrectTime();
      change.change = `Below Minumum Price Reason: ${this.currentOnboard.below_selling_price_reason}`;
      logs.changes.push(change)
    }
    logs.changes = logs.changes.reverse()
    this.leadsService.postleadchangelogs([logs]).toPromise()
      .then(res => { })
      .catch(err => console.log(err))
  }

  addMinutes(date: Date, mm: number) {
    var d = new Date(date)
    d.setMinutes(d.getMinutes() + mm);
    return d
  }

  CorrectTime() {
    return new Date(new Date().getTime() - this.offSet)
  }

  playvideo() {
    if (this.currentLead.demogiven && this.currentLead.demolink) {
      const modalRef = this.modalService.open(VideoPlayerComponent, { centered: true, scrollable: true, size: 'lg' })
      modalRef.componentInstance.data = {
        link: this.currentLead.demolink
      }
    }
  }
}
