import { Component, OnInit } from '@angular/core';
import { Rolespermission, Roles } from 'src/app/model/roles.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {

  constructor(
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService) { }

  newrole: string = ''
  permission: Rolespermission = {
    recordedcourse: {
      addforself: false,
      addforothers: false,
      updateforself: false,
      updateforothers: false,
      view: false,
      approve: false,
      delete: false,
    },
    livecourse: {
      addforself: false,
      addforothers: false,
      updateforself: false,
      updateforothers: false,
      view: false,
      approve: false,
      delete: false,
    },
    coursebundle: {
      add: false,
      update: false,
      view: false,
      approve: false,
      delete: false,
    },
    questionset: {
      addforself: false,
      addforothers: false,
      updateforself: false,
      updateforothers: false,
      view: false,
      approve: false,
      delete: false,
    },
    schedule: {
      add: false,
      update: false,
      view: false,
      viewown: false,
      export: false,
      addholiday: false,
      deleteholiday: false,
      deleteschedule: false,
      approvePostponeSchedule: false
    },
    webinar: {
      add: false,
      update: false,
      delete: false,
      view: false,
    },
    review: {
      view: false,
      export: false,
      add: false,
      delete: false,
      approve: false,
    },
    feedback: {
      view: false,
      export: false,
      sendtoinstructor: false,
      reply: false,
    },
    coupon: {
      add: false,
      delete: false,
      view: false,
      viewown: false,
      approval: false,
    },
    subscription: {
      add: false,
      edit: false,
      view: false,
      delete: false,
      approval: false,
    },
    messages: {
      viewownmessages: false,
      viewallmessages: false,
      replyownmessages: false,
      replyallmessages: false,
      export: false,
      delete: false,
    },
    announcements: {
      send: false,
      delete: false,
      view: false,
      approval: false,
      sendNotice: false,
      deleteNotice: false,
      approveNotice: false
    },
    product: {
      add: false,
      edit: false,
      view: false,
      delete: false,
      purchasehistory: false,
      approval: false,
      exportproduct: false,
      exportpurchase: false,
      changeexpiry: false,
      CreateMentorshipSchedule: false,
      ExportMentorshipSchedule: false,
      ViewAllMentorshipSubscriptionDetails: false,
      ViewOwnMentorshipSubscriptionDetails: false,
      ExportMentorshipDetails: false,
      ChangeMentorshipSchedule: false,
      DeleteMentorshipSchedule: false,
      AssignPortfolioCheckup: false,
      ViewAllPortfolioCheckup: false,
      ViewOwnPortfolioCheckup: false,
      ExportPortfolioCheckup: false,
      CreateLiveMarketPSchedule: false,
      ExportLiveMarketPSchedule: false,
      ChangeLiveMarketPSchedule: false,
      ExportLiveMarketPDetails: false,
      ViewAllLiveMarketPDetails: false,
      ViewOwnLiveMarketPDetails: false,
      DeleteLiveMarketPSchedule: false,
      bookslots: false,
      sendMarketResearch: false,
      viewMarketResearch: false,
      deleteMarketResearch: false,
      approveMarketResearch: false,
      exportMarketResearchDetails: false,
      viewstocklist: false,
      sendInvesletter: false,
      viewInvesletter: false,
      deleteInvesletter: false,
      approveInvesletter: false,
      viewFollowMyPortfolio: false,
      manageFollowMyPortfolio: false,
      exportFollowMyPortfolio: false,
      sendWealthInsights: false,
      viewWealthInsights: false,
      deleteWealthInsights: false,
      approveWealthInsights: false,
      AddAwarnessVideos: false,
      viewAwarnessVideos: false,
      deleteAwarnessVideos: false,
      approveAwarnessVideos: false
    },
    students: {
      allcourseregdetails: false,
      owncourseregdetails: false,
      exportcourseregdetails: false,
      addmanualreg: false,
      viewmanualreg: false,
      approvemanualreg: false,
      exportmanualreg: false,
      deletemanualreg: false,
      stulist: false,
      exportstulist: false,
      viewallmarks: false,
      viewownmarks: false,
      exportmarks: false,
      approvecert: false,
      rejectcert: false,
      viewcert: false,
      updatestudentreg: false,
      approveupdatestudentreg: false,
      exportupdatestudentreg: false,
      editstudent: false,
      addstudent: false,
      studentactivity: false
    },
    instructor: {
      viewlists: false,
      viewprofile: false,
      activate: false,
      deactivate: false,
      reject: false,
      senddeactivationrequest: false,
      readdeactivaterequest: false,
      deletedeactivaterequest: false,
      export: false,
    },
    payments: {
      paymenthistory: false,
      exportpaymenthistory: false,
      partpaymenthistory: false,
      exportpartpaymenthistory: false,
      allaccountsstats: false,
      ownaccountsstats: false,
      exportaccounts: false,
      createrefund: false,
      viewallrefundhistory: false,
      viewownrefundhistory: false,
      exportrefundhistory: false,
      banaccount: false,
      viewbannedaccountlist: false,
      exportbannedaccountlist: false,
      viewleads: false,
      exportleads: false,
      gsthistory: false,
      exportgsthistory: false
    },
    jobs: {
      post: false,
      edit: false,
      delete: false,
      activate: false,
      deactivate: false,
      close: false,
      open: false,
      viewjob: false,
      viewapplications: false,
      exportapplications: false,
    },
    adbanner: {
      add: false,
      view: false,
      delete: false,
      approval: false,
    },
    books: {
      add: false,
      view: false,
      delete: false,
      approval: false,
    },
    trainerKits: {
      add: false,
      view: false,
      delete: false,
      approval: false,
    },
    tutorial: {
      add: false,
      edit: false,
      view: false,
      delete: false,
      approval: false,
    },
    employees: {
      createrole: false,
      editrole: false,
      viewrole: false,
      addemployee: false,
      updateemployeerole: false,
      viewemployees: false,
      exportemployee: false,
      manageDepartments: false,
      manageTeams: false,
      manageDesignations: false,
      editEmployee: false,
      updateEmployeeAllocation: false,
      vieworgchart: false,
      changeEmployeePassword: false
    },
    sells: {
      createteam: false,
      viewteam: false,
      viewownteam: false,
      editteam: false,
      deleteteam: false,
      exportteam: false,
      viewownconversionlist: false,
      viewallconversionlist: false,
      viewteamsconversionlist: false,
      exportconversionlist: false,
      viewownsellsreport: false,
      viewallsellsreport: false,
      viewteammemssellsreport: false,
      exportsellsreport: false,
      viewallteamsellsreport: false,
      viewownteamsellsreport: false,
      exportteamsellsreport: false,
      shortclose: false,
      reopen: false,
      tagemployee: false,
      addPl: false,
      viewPl: false,
      exportPl: false,
      addprojection: false,
      approveprojection: false,
      viewownprojection: false,
      viewteamsprojection: false,
      editprojection: false,
      exportprojection: false
    },
    shorturl: {
      add: false,
      update: false,
      view: false,
      delete: false,
    },
    leads: {
      viewall: false,
      viewown: false,
      viewteams: false,
      delete: false,
      upload: false,
      leadassign: false,
      edit: false,
      addleadstatus: false,
      export: false,
      viewallonboarding: false,
      viewownonboarding: false,
      viewteamsonboarding: false,
      viewownleadsreport: false,
      viewallleadsreport: false,
      viewteammemsleadsreport: false,
      exportleadsreport: false,
      viewallteamleadsreport: false,
      viewownteamleadsreport: false,
      exportteamleadsreport: false,
      addleadsource: false,
      addoccupation: false,
      addsupportcomment: false,
      viewownonbtatreport: false,
      viewteamsonbtatreport: false,
      managelevels: false,
      promoteleads: false,
      updatesettings: false,
      modifyStatus: false,
      approveminimumprice: false
    },
    insignia: {
      add: false,
      update: false,
      view: false,
      delete: false,
      viewregistrations: false,
      bookregistrations: false,
      approve: false,
      insigniareport: false,
      temporarybanned: false
    },
    invesmentor: {
      add: false,
      update: false,
      view: false,
      delete: false,
      viewregistrations: false,
      approve: false,
    },
    notifications: {
      send: false,
      delete: false,
      view: false,
      approval: false,
    },
    referrals: {
      viewreferrals: false,
      viewtransactions: false,
      addtransactions: false,
      changestatus: false,
      export: false,
      settings: false
    },
    supports: {
      liveMarketSupportChat: false,
      settings: false,
      liveMarketSupportReport: false,
      export: false
    },
    devices: {
      viewdevices: false,
      settings: false,
      export: false,
      viewloginhistory: false,
      logoutusers: false
    },
    reports: {
      bcmbreports: false,
      ivrreports: false,
      ownivrreports: false,
      owndeptivrreports: false,
      ownbcmbreportins: false,
      appreports: false,
      ownteamivrreports: false
    },
    attendanceleave: {
      approveAttendance: false,
      exportAttendance: false,
      viewAllAttendance: false,
      viewTeamAttendance: false,
      editAttendance: false,
      approveRegularize: false,
      exportRegularize: false,
      viewAllRegularize: false,
      viewTeamRegularize: false,
      editRegularize: false,
      deleteRegularize: false,
      approveLeave: false,
      exportLeave: false,
      viewAllLeave: false,
      viewTeamLeave: false,
      deleteLeave: false,
      addLeaveBalance: false,
      manageLeavePolicy: false,
      manageAttendanceSettings: false,
      viewownteamroster: false,
      viewallroster: false,
      viewowndeptroster: false,
      createroster: false,
      deleteroster: false,
      approveroster: false
    },
    orders: {
      viewAllOrder: false,
      viewOwnOrder: false,
      viewTeamOrder: false,
      createOrder: false,
      updateOrder: false,
      modifyInstallment: false,
      verifyInstallment: false,
      requestAdjustment: false,
      approveAdjustment: false,
      shortClose: false,
      requestRefund: false,
      viewRefundList: false,
      approveRefund: false,
      approveBatchChange: false,
      viewBatchChangeList: false,
      requestBatchChange: false,
      viewPaymentHistory: false,
      changeCourseExpiry: false,
      export: false,
      addPayments: false,
      cancelPaymentLink: false
    }
  }
  allRoles: Roles[] = []
  recordedcourse = false
  livecourse = false
  coursebundle = false
  questionset = false
  schedule = false
  webinar = false
  review = false
  feedback = false
  coupon = false
  subscription = false
  messages = false
  announcements = false
  product = false
  students = false
  instructor = false
  payments = false
  jobs = false
  adbanner = false
  books = false
  trainerKits = false
  tutorial = false
  employees = false
  sells = false;
  shorturl = false
  leads = false
  insignia = false
  notifications = false
  referrals = false
  supports = false
  devices = false
  invesmentor = false
  reports = false
  attendanceleave = false
  orders = false
  rolescomplete = [false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false]
  ngOnInit() {
    this.refresh()
  }

  refresh() {
    this.employeeService.getallrole().toPromise()
      .then(res => {
        this.allRoles = res as Roles[]
        this.allRoles.forEach(e => {
          if (!e.permission.notifications) {
            e.permission['notifications'] = this.permission.notifications
          }
          if (!e.permission.referrals) {
            e.permission['referrals'] = this.permission.referrals
          }
          if (!e.permission.supports) {
            e.permission['supports'] = this.permission.supports
          }
          if (!e.permission.devices) {
            e.permission['devices'] = this.permission.devices
          }
          if (!e.permission.invesmentor) {
            e.permission['invesmentor'] = this.permission.invesmentor
          }
          if (!e.permission.reports) {
            e.permission['reports'] = this.permission.reports
          }
          if (!e.permission.attendanceleave) {
            e.permission['attendanceleave'] = this.permission.attendanceleave
          }
          if (!e.permission.orders) {
            e.permission['orders'] = this.permission.orders
          }
        })
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  createRole() {
    var newRole = new Roles();
    newRole.name = this.newrole.toLowerCase().trim();
    newRole.editable = true;
    newRole.permission = this.permission;
    this.allRoles.push(newRole)

    this.employeeService.addrole(newRole).toPromise()
      .then(res => {
        this.newrole = ''
        this.alertNotificationService.toastAlertSuccess('New Role Added')
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  editrole(role: Roles) {
    this.employeeService.editrole(role).toPromise()
      .then(res => this.alertNotificationService.toastAlertSuccess('Role Updated'))
      .catch(err => this.alertNotificationService.alertError(err))
  }



  updateAllComplete(arr, flag, num) {
    flag[num] = arr != null && Object.values(arr).every(t => t);
    //console.log('all',flag)

  }

  someComplete(arr, flag) {
    if (arr == null) {
      return false;
    }
    //console.log('some',Object.values(arr).filter(t => t).length > 0 && !flag)
    return Object.values(arr).filter(t => t).length > 0 && !flag;
  }

  setAll(completed: boolean, arr: Object, flag, num, p?: Rolespermission) {
    flag[num] = completed
    if (arr == null) {
      return false;
    }
    var s = Object.keys(arr)
    s.forEach((e) => {
      arr[e] = completed
    })

    if (num == 3) {
      this.change5(p)
    }
    else if (num == 1) {
      this.change3(p)
    }

  }

  panelopen() {
    this.recordedcourse = false
    this.livecourse = false
    this.coursebundle = false
    this.questionset = false
    this.schedule = false
    this.webinar = false
    this.review = false
    this.feedback = false
    this.coupon = false
    this.subscription = false
    this.messages = false
    this.announcements = false
    this.product = false
    this.students = false
    this.instructor = false
    this.payments = false
    this.jobs = false
    this.adbanner = false
    this.books = false
    this.trainerKits = false
    this.tutorial = false
    this.employees = false
    this.sells = false
    this.shorturl = false;
    this.leads = false
    this.insignia = false
    this.notifications = false
    this.referrals = false
    this.supports = false
    this.devices = false
    this.rolescomplete = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
  }

  change1(p) {
    if (p.addforothers || p.addforself || p.updateforothers || p.updateforself || p.approve || p.delete) {
      p.view = true
    }
  }
  change2(p) {
    if (!p.view) {
      p.addforothers = false
      p.addforself = false
      p.updateforothers = false
      p.updateforself = false
      p.approve = false
      p.delete = false
    }
  }
  change3(p: Rolespermission) {
    if (p.livecourse.addforothers || p.livecourse.addforself || p.livecourse.updateforothers || p.livecourse.updateforself || p.livecourse.approve || p.livecourse.delete) {
      p.livecourse.view = true
    }
    if (p.livecourse.addforothers || p.livecourse.addforself || p.livecourse.updateforothers || p.livecourse.updateforself) {
      p.schedule.add = true;
      p.schedule.view = true;
    }
    else {
      p.schedule.add = false;
    }
  }
  change4(p: Rolespermission) {
    if (!p.livecourse.view) {
      p.livecourse.addforothers = false
      p.livecourse.addforself = false
      p.livecourse.updateforothers = false
      p.livecourse.updateforself = false
      p.livecourse.approve = false
      p.livecourse.delete = false
      p.schedule.add = false;
    }
  }
  change5(p: Rolespermission) {
    if (p.schedule.add || p.schedule.addholiday || p.schedule.deleteholiday || p.schedule.deleteschedule || p.schedule.update || p.schedule.export) {
      p.schedule.view = true
    }
    if (p.schedule.add) {
      p.livecourse.addforothers = true
      p.livecourse.addforself = true
      p.livecourse.updateforothers = true
      p.livecourse.updateforself = true
      p.livecourse.view = true
    }
    else {
      p.livecourse.addforothers = false
      p.livecourse.addforself = false
      p.livecourse.updateforothers = false
      p.livecourse.updateforself = false
    }
  }
  change6(p: Rolespermission) {
    if (!p.schedule.view) {
      p.schedule.add = false
      p.schedule.addholiday = false
      p.schedule.deleteholiday = false
      p.schedule.deleteschedule = false
      p.schedule.update = false
      p.schedule.export = false
      p.livecourse.addforothers = false
      p.livecourse.addforself = false
      p.livecourse.updateforothers = false
      p.livecourse.updateforself = false
    }
  }
  change7(p, num) {
    if (num == 0 && (p.add || p.update || p.approve || p.delete)) {
      p.view = true
    }
    else if (num == 1 && (p.add || p.export || p.approve || p.delete)) {
      p.view = true
    }
  }
  change8(p, num) {
    if (!p.view && num == 0) {
      p.add = false
      p.update = false
      p.approve = false
      p.delete = false
    }
    else if (!p.view && num == 1) {
      p.add = false
      p.export = false
      p.approve = false
      p.delete = false
    }
  }
  change9(p) {
    if ((p.add || p.edit || p.approval || p.delete)) {
      p.view = true
    }
  }
  change10(p) {
    if (!p.view) {
      p.add = false
      p.edit = false
      p.approval = false
      p.delete = false
    }
  }
  change11(p) {
    if ((p.add || p.approval || p.delete || p.edit)) {
      p.view = true
    }
  }
  change12(p) {
    if (!p.view) {
      p.add = false
      p.approval = false
      p.delete = false
      p.edit = false
    }
  }
  change13(p, num) {
    if (num == 0 && (p.add || p.update || p.delete)) {
      p.view = true
    }
    else if (num == 1 && (p.sendtoinstructor || p.export || p.reply)) {
      p.view = true
    }
    else if (num == 2 && (p.send || p.delete || p.approval)) {
      p.view = true
    }
  }
  change14(p, num) {
    if (!p.view && num == 0) {
      p.add = false
      p.update = false
      p.delete = false
    }
    else if (!p.view && num == 1) {
      p.sendtoinstructor = false
      p.export = false
      p.reply = false
    }
    else if (!p.view && num == 2) {
      p.send = false
      p.delete = false
      p.approval = false
    }
  }
  change15(p) {
    if (p.add || p.edit || p.delete || p.approval || p.exportproduct)
      p.view = true
    if (p.exportpurchase)
      p.purchasehistory = true
  }
  change16(p) {
    if (!p.view) {
      p.add = false
      p.edit = false
      p.delete = false
      p.approval = false
      p.exportproduct = false
    }
    if (!p.purchasehistory) {
      p.exportpurchase = false
    }
  }
  change17(p) {
    if (p.viewprofile || p.activate || p.deactivate || p.reject || p.readdeactivaterequest || p.deletedeactivaterequest || p.export)
      p.viewlists = true
    if (p.deletedeactivaterequest)
      p.readdeactivaterequest = true
  }
  change18(p) {
    if (!p.viewlists) {
      p.viewprofile = false
      p.activate = false
      p.deactivate = false
      p.reject = false
      p.readdeactivaterequest = false
      p.deletedeactivaterequest = false
      p.export = false
    }
    if (!p.readdeactivaterequest) {
      p.deletedeactivaterequest = false
    }
    else {
      p.viewlists = true
    }
  }
  change19(p) {
    if (p.replyownmessages || p.delete || p.export)
      p.viewownmessages = true
    if (p.replyallmessages || p.delete || p.export)
      p.viewallmessages = true
  }
  change20(p) {
    if (!p.viewownmessages) {
      p.replyownmessages = false
    }
    if (!p.viewallmessages) {
      p.replyallmessages = false
    }
    if (!p.viewallmessages && !p.viewownmessages) {
      p.delete = false
      p.export = false
    }
  }
  change21(p) {
    if (p.post || p.delete || p.edit || p.activate || p.deactivate || p.close || p.open)
      p.viewjob = true
    if (p.exportapplications)
      p.viewapplications = true
  }
  change22(p) {
    if (!p.viewownmessages) {
      p.post = false
      p.delete = false
      p.edit = false
      p.activate = false
      p.deactivate = false
      p.close = false
      p.open = false
    }
    if (!p.viewapplications) {
      p.exportapplications = false
    }
    if (!p.viewallmessages && !p.viewownmessages) {
      p.delete = false
      p.export = false
    }
  }
  change23(p) {
    if (p.addmanualreg || p.approvemanualreg || p.exportmanualreg)
      p.viewmanualreg = true
    if (p.exportstulist)
      p.stulist = true
    if (p.editstudent)
      p.stulist = true
    if (p.exportcourseregdetails) {
      p.allcourseregdetails = true
      p.owncourseregdetails = true
    }
    if (p.exportmarks) {
      p.viewallmarks = true
      p.viewownmarks = true
    }
    if (p.approvecert || p.rejectcert) {
      p.viewcert = true
    }
  }
  change24(p) {
    if (!p.viewmanualreg) {
      p.addmanualreg = false
      p.approvemanualreg = false
      p.exportmanualreg = false
    }
    if (!p.stulist) {
      p.exportstulist = false
      p.editstudent = false
    }
    if (!p.allcourseregdetails && !p.owncourseregdetails) {
      p.exportcourseregdetails = false
    }
    if (!p.viewallmarks && !p.viewownmarks) {
      p.exportmarks = false
    }
    if (!p.viewcert) {
      p.approvecert = false
      p.rejectcert = false
    }
  }
  change25(p) {
    if (p.createrole || p.editrole)
      p.viewrole = true
    if (p.addemployee || p.updateemployeerole || p.exportemployee) {
      p.viewemployees = true
    }
  }
  change26(p) {
    if (!p.viewrole) {
      p.createrole = false
      p.editrole = false
    }
    if (!p.viewemployees) {
      p.addemployee = false
      p.updateemployeerole = false
      p.exportemployee = false
    }
  }
  change27(p) {
    if (p.banaccount || p.exportbannedaccountlist)
      p.viewbannedaccountlist = true
    if (p.exportpaymenthistory)
      p.paymenthistory = true
    if (p.exportgsthistory)
      p.gsthistory = true
    if (p.exportrefundhistory || p.createrefund) {
      p.viewallrefundhistory = true
      p.viewownrefundhistory = true
    }
    if (p.exportaccounts) {
      p.allaccountsstats = true
      p.ownaccountsstats = true
    }
    if (p.exportleads) {
      p.viewleads = true
    }
    if (p.exportpartpaymenthistory) {
      p.partpaymenthistory = true
    }
  }
  change28(p) {
    if (!p.viewbannedaccountlist) {
      p.banaccount = false
      p.exportbannedaccountlist = false
    }
    if (!p.paymenthistory) {
      p.exportpaymenthistory = false
    }
    if (!p.gsthistory) {
      p.exportgsthistory = false
    }
    if (!p.viewallrefundhistory && !p.viewownrefundhistory) {
      p.exportrefundhistory = false
      p.createrefund = false
    }
    if (!p.ownaccountsstats && !p.allaccountsstats) {
      p.exportaccounts = false
    }
    if (!p.viewleads) {
      p.exportleads = false
    }
    if (!p.partpaymenthistory) {
      p.exportpartpaymenthistory = false
    }
  }
  change29(p) {
    if (p.createteam || p.editteam || p.deleteteam || p.exportteam) {
      p.viewteam = true;
    }
    if (p.viewallconversionlist) {
      p.viewownconversionlist = true
      p.viewteamsconversionlist = true
    }
    if (p.viewteamsconversionlist) {
      p.viewownconversionlist = true
    }
    if (p.exportconversionlist) {
      p.viewownconversionlist = true
    }
    if (p.viewallsellsreport) {
      p.viewownsellsreport = true
      p.viewteammemssellsreport = true
    }
    if (p.viewteammemssellsreport) {
      p.viewownsellsreport = true
    }
    if (p.exportsellsreport) {
      p.viewownsellsreport = true
    }
    if (p.viewallteamsellsreport) {
      p.viewownteamsellsreport = true
    }
    if (p.exportteamsellsreport) {
      p.viewownteamsellsreport = true
    }
    if (p.addPl || p.exportPl) {
      p.viewPl = true;
    }
  }

  change30(p) {
    if (!p.viewteam) {
      p.createteam = false;
      p.editteam = false;
      p.deleteteam = false;
      p.exportteam = false;
    }
    if (!p.viewownconversionlist) {
      p.viewallconversionlist = false
      p.viewteamsconversionlist = false
      p.exportconversionlist = false
    }
    if (!p.viewownsellsreport) {
      p.viewallsellsreport = false
      p.viewteammemssellsreport = false
      p.exportsellsreport = false
    }
    if (!p.viewownteamsellsreport) {
      p.viewallteamsellsreport = false
      p.exportteamsellsreport = false
    }
    if (!p.viewPl) {
      p.addPl = false
      p.exportPl = false
    }
  }
  change31(p) {
    if (!p.view) {
      p.add = false
      p.update = false
      p.delete = false
    }
  }
  change32(p) {
    if ((p.add || p.delete || p.update)) {
      p.view = true
    }
  }

  change33(p) {
    if (p.upload || p.delete || p.leadassign || p.export) {
      p.viewall = true
      p.viewown = true
      p.viewteams = true
    }
    if (p.edit) {
      p.viewown = true
    }

    if (p.viewall) {
      p.viewallonboarding = true
      p.viewownonboarding = true
      p.viewteamsonboarding = true
    }
    if (p.viewown) {
      p.viewownonboarding = true
    }
    if (p.viewteams) {
      p.viewteamsonboarding = true
      p.viewownonboarding = true
    }
    if (p.viewallleadsreport) {
      p.viewownleadsreport = true
      p.viewteammemsleadsreport = true
    }
    if (p.viewteammemsleadsreport) {
      p.viewownleadsreport = true
    }
    if (p.exportleadsreport) {
      p.viewownleadsreport = true
    }
    if (p.viewallteamleadsreport) {
      p.viewownteamleadsreport = true
    }
    if (p.exportteamleadsreport) {
      p.viewownteamleadsreport = true
    }
  }

  change34(p) {
    if (!p.viewall) {
      p.upload = false
      p.delete = false
      p.leadassign = false
      p.export = false
    }
    if (!p.viewown || !p.viewteams || !p.viewall) {
      p.edit = false
    }
    if (!p.viewownleadsreport) {
      p.viewallleadsreport = false
      p.viewteammemsleadsreport = false
      p.exportleadsreport = false
    }
    if (!p.viewownteamleadsreport) {
      p.viewallteamleadsreport = false
      p.exportteamleadsreport = false
    }
  }


}
