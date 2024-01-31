import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LeadChangelog, LeadChanges, Leads } from 'src/app/model/leads.model';
import { User } from 'src/app/model/user.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { LeadsService } from 'src/app/services/leads.service';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StateDistricts } from 'src/app/model/statedistrict.model';
import { ExportService } from 'src/app/services/export.service';
import { environment } from 'src/environments/environment';
import { EmployeeService } from 'src/app/services/employee.service';
@Component({
  selector: 'app-onboarding-list',
  templateUrl: './onboarding-list.component.html',
  styleUrls: ['./onboarding-list.component.scss']
})
export class OnboardingListComponent implements OnInit {
  imageurl = environment.imageUrl;
  allData: Leads[] = [];
  allOnboardData: any[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;

  constructor(
    private leadService: LeadsService,
    private alertNotificationService: AlertNotificationsService,
    private userService: UserService,
    private router: Router,
    private modalService: NgbModal,
    private exportService: ExportService,
    private employeeService: EmployeeService
  ) { }

  isLoading = false
  isavailable = false
  allUser: User[] = []
  statewisedistricts: StateDistricts[] = []
  states: string[] = []
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  userDetails
  ngOnInit(): void {
    this.userDetails = this.employeeService.getUserPayload()
    this.displayedColumns = ['leadowner', 'studentid', 'name', 'whatsappnum', 'telegram',
      'mode', 'totalfees', 'paidamount', 'couponcode', 'paymentdate', 'txnid', 'paymentmethod', 'paymentamount', 'secpaymentdate', 'sectxnid',
      'secpaymentmethod', 'secpaymentamount', 'thirdpaymentdate', 'thirdtxnid', 'thirdpaymentmethod', 'thirdpaymentamount', 'forthpaymentdate', 'forthtxnid', 'forthpaymentmethod', 'forthpaymentamount',
      'servicetype', 'servicecode', 'servicename', 'comment_lead', 'comment', 'studentidgencomplete', 'studentidgentime', 'studentregdonebyid',
      'telegramcomplete', 'telegramtime', 'telegramregdonebyid', 'manualregcomplete', 'regcompletetime', 'manualregdonebyid', 'secmanualregcomplete', 'secregcompletetime',
      'secmanualregdonebyid', 'thirdmanualregcomplete', 'thirdregcompletetime', 'thirdmanualregdonebyid', 'forthmanualregcomplete', 'forthregcompletetime', 'forthmanualregdonebyid', 'below_selling_price_reason', 'below_selling_approval', '_id'];
    this.leadService.getstatewisedistrict().toPromise()
      .then(res => {
        this.statewisedistricts = res
        this.states = this.statewisedistricts.map(e => e.state).sort()
      }).catch(err => this.alertNotificationService.alertError(err))

    this.refreshlist()
  }

  async refreshlist() {
    this.isLoading = true

    this.userService.getStudents().toPromise()
      .then(res => {
        this.allUser = res;
      }).catch(err => this.alertNotificationService.alertError(err))

    // await this.leadService.getallLead().toPromise()
    //   .then(res => {
    //     this.allData = res as Leads[]
    //   }).catch(err => this.alertNotificationService.alertError(err));

    this.filter1()
  }

  filter1() {
    this.isLoading = true
    this.leadService.getDispOnboardData(this.filterQuery).toPromise()
      .then(res => {
        this.allOnboardData = res as any[]
        /*if (this.allOnboardData && this.allOnboardData.length > 0) {
          this.allOnboardData.forEach(e => {
            var leads = this.allData.find(f => f._id == e.leadid)
            e['name'] = leads ? leads.name : "";
            e['phone'] = leads ? leads.phone : "";
            e['email'] = leads ? leads.email : "";
            e['whatsappnum'] = leads ? leads.whatsappnum : "";
            e['leadowner'] = leads ? leads.leadowner : "";
            e['leadownername'] = leads ? leads.leadownername : "";
            e['servicetype'] = leads ? leads.servicetype : "";
            e['servicecode'] = leads ? leads.servicecode : "";
            e['servicename'] = leads ? leads.servicename : "";
            e['comment_lead'] = leads ? leads.comment : "";
            e['telegram'] = leads ? leads.telegram : "";
            e['paidamount'] = this.onbpaidamount(e);
            e['status'] = this.onbstatus(e)
          })
        }
        this.allOnboardData.sort(function (a, b) {
          return new Date(b.paymentdate).getTime() - new Date(a.paymentdate).getTime();
        });*/
        this.onChange()
        this.isavailable = this.allOnboardData.length > 0;
        this.isLoading = false
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  onbstatus(e) {
    if (!e.manualregcomplete) {
      return 'pending'
    }
    if (!e.studentidgencomplete) {
      return 'pending'
    }
    if (e.telegramcomplete == "Pending") {
      return 'pending'
    }
    if (e.mode != 'mode1' && !e.secmanualregcomplete && e.secregstarttime) {
      return 'pending'
    }
    if (e.mode == 'mode3' && !e.thirdmanualregcomplete && e.thirdregstarttime) {
      return 'pending'
    }
    return 'completed'
  }

  onbpaidamount(currentOnboard) {
    var paidamount = 0
    if (currentOnboard.mode == 'mode3') {
      var a = currentOnboard.paymentamount ? currentOnboard.paymentamount : 0;
      var b = currentOnboard.secpaymentamount ? currentOnboard.secpaymentamount : 0;
      var c = currentOnboard.thirdpaymentamount ? currentOnboard.thirdpaymentamount : 0;
      paidamount = Number(a) + Number(b) + Number(c);
    } else if (currentOnboard.mode == 'mode2') {
      var a = currentOnboard.paymentamount ? currentOnboard.paymentamount : 0;
      var b = currentOnboard.secpaymentamount ? currentOnboard.secpaymentamount : 0;
      paidamount = Number(a) + Number(b);
    } else if (currentOnboard.mode == 'mode1') {
      var a = currentOnboard.paymentamount ? currentOnboard.paymentamount : 0;
      paidamount = Number(a);
    } else {
      paidamount = 0;
    }
    return paidamount != 0 ? paidamount : currentOnboard.paidamount
  }

  studentreg(data) {
    var newUser = new User();
    // var lead = this.allData.find(l => l._id == data.leadid)
    // if (lead) {
    //   newUser.city = lead.city ? lead.city : null
    //   newUser.dob = lead.dob ? lead.dob : null
    //   newUser.gender = lead.gender ? lead.gender : null
    //   newUser.state = lead.state ? lead.state : null
    //   newUser.address = lead.address ? lead.address : null;
    //   newUser.gstin = lead.gstin ? lead.gstin : null;
    //   newUser.pincode = lead.pincode ? lead.pincode : null;
    // }
    newUser.city = data.city ? data.city : null
    newUser.dob = data.dob ? data.dob : null
    newUser.gender = data.gender ? data.gender : null
    newUser.state = data.state ? data.state : null
    newUser.address = data.address ? data.address : null;
    newUser.gstin = data.gstin ? data.gstin : null;
    newUser.pincode = data.pincode ? data.pincode : null;
    newUser.telephone = data.phone
    newUser.alternatenum = data.whatsappnum
    newUser.secondarynum = data.alternatenumber ? data.alternatenumber : null;
    newUser.email = data.email
    newUser.fullName = data.name
    newUser.password = data.phone
    newUser.telegram = data.telegram
    newUser.role = 'student'
    this.alertNotificationService.alertCustomMsg('Do you want to register this student?')
      .then(async result => {
        if (result.isConfirmed) {
          if (data && !data.studentidgencomplete) {
            var user = this.allUser.filter(e => e.telephone == data.phone || e.email == data.email)
            var time = null
            await this.leadService.getCurrentTime().toPromise()
              .then(res => time = new Date(res['time']))
              .catch(err => time = new Date())
            if (user.length > 0) {
              data.studentid = user[0].invid
              data.studentidgencomplete = true
              data.studentidgentime = time;
              this.leadService.postOnboardData(data, 'student').toPromise()
                .then(res => {
                  var change = new LeadChanges();
                  change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
                  change.date = time;
                  change.change = 'Existing Student. Student Registration Completed.'
                  this.postlog(change, data.leadid)
                  this.alertNotificationService.alertInfo('Already Registered Student.')
                  this.refreshlist()
                }).catch(err => this.alertNotificationService.alertError(err))
            } else {
              this.userService.postUser(newUser).toPromise()
                .then(res => {
                  if (data) {
                    data.studentid = res.invid
                    data.studentidgencomplete = true
                    data.studentidgentime = time;
                    data.studentregdonebyid = this.userDetails.invid;
                    data.studentregdonebyname = this.userDetails.name;
                    this.leadService.postOnboardData(data, 'student').toPromise()
                      .then(res => {
                        var change = new LeadChanges();
                        change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
                        change.date = time;
                        change.change = 'New Student. Student Registration Completed.'
                        this.postlog(change, data.leadid)
                        this.alertNotificationService.alertInfo('Student Registered.')
                        this.refreshlist()
                      }).catch(err => this.alertNotificationService.alertError(err))
                  } else {
                    this.alertNotificationService.alertInfo('Student Registered.')
                  }
                }).catch(err => this.alertNotificationService.alertError(err));
            }
          }
        }
      }).catch(err => { });
  }

  telegramjoin(ob) {
    this.alertNotificationService.alertCustomMsg('Do you want to Complete Telegram Joining?')
      .then(async result => {
        if (result.isConfirmed) {
          var time = null
          await this.leadService.getCurrentTime().toPromise()
            .then(res => time = new Date(res['time']))
            .catch(err => time = new Date())
          if (ob) {
            if (ob.telegramcomplete == 'Pending') {
              ob.telegramtime = time;
              ob.telegramregdonebyid = this.userDetails.invid;
              ob.telegramregdonebyname = this.userDetails.name;
            }
            ob.telegramcomplete = 'Complete';
            this.leadService.postOnboardData(ob, 'telegram').toPromise()
              .then(res => {
                var change = new LeadChanges();
                change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
                change.date = time;
                change.change = 'Telegram Joining Completed.'
                this.postlog(change, ob.leadid)
                this.alertNotificationService.toastAlertSuccess('Telegram Joined')
                this.refreshlist()
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        }
      })
  }

  telegramjoinpendinguser(ob) {
    this.alertNotificationService.alertCustomMsg('Do you want to update Telegram Joining?')
      .then(async result => {
        if (result.isConfirmed) {
          var time = null
          await this.leadService.getCurrentTime().toPromise()
            .then(res => time = new Date(res['time']))
            .catch(err => time = new Date())
          if (ob) {
            ob.telegramcomplete = 'Not Done By Client';
            ob.telegramtime = time;
            ob.telegramregdonebyid = this.userDetails.invid;
            ob.telegramregdonebyname = this.userDetails.name;
            this.leadService.postOnboardData(ob, 'telegram').toPromise()
              .then(res => {
                var change = new LeadChanges();
                change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
                change.date = time;
                change.change = 'Telegram Joining Not Done By Client.'
                this.postlog(change, ob.leadid)
                this.alertNotificationService.toastAlertSuccess('Telegram Updated')
                this.refreshlist()
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        }
      })
  }

  manualreg(ob) {
    if (ob.below_selling_price && !ob.below_selling_approval) {
      this.alertNotificationService.alertInfo("Please Approve Minimum Price Selling by Admin")
      return;
    }
    this.alertNotificationService.alertCustomMsg('Do you want to Complete Manual Registration?')
      .then(async result => {
        if (result.isConfirmed) {
          var time = null
          await this.leadService.getCurrentTime().toPromise()
            .then(res => time = new Date(res['time']))
            .catch(err => time = new Date())
          if (ob) {
            var update = true
            var change = new LeadChanges();
            change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
            change.date = time;
            var type
            if (!ob.manualregcomplete) {
              ob.manualregcomplete = true
              ob.regcompletetime = time;
              ob.manualregdonebyid = this.userDetails.invid;
              ob.manualregdonebyname = this.userDetails.name;
              change.change = 'First Installment Completed.'
              type = 'first'
            } else if (!ob.secmanualregcomplete && ob.mode != 'mode1' && ob.secregstarttime) {
              ob.secmanualregcomplete = true
              ob.secregcompletetime = time
              ob.secmanualregdonebyid = this.userDetails.invid;
              ob.secmanualregdonebyname = this.userDetails.name;
              change.change = 'Second Installment Completed.'
              type = 'second'
            } else if (!ob.thirdmanualregcomplete && (ob.mode == 'mode3' || ob.mode == 'mode4') && ob.thirdregstarttime) {
              ob.thirdmanualregcomplete = true
              ob.thirdregcompletetime = time
              ob.thirdmanualregdonebyid = this.userDetails.invid;
              ob.thirdmanualregdonebyname = this.userDetails.name;
              change.change = 'Third Installment Completed.'
              type = 'third'
            } else if (!ob.forthmanualregcomplete && ob.mode == 'mode4' && ob.forthregstarttime) {
              ob.thirdmanualregcomplete = true
              ob.thirdregcompletetime = time
              ob.thirdmanualregdonebyid = this.userDetails.invid;
              ob.thirdmanualregdonebyname = this.userDetails.name;
              change.change = 'Forth Installment Completed.'
              type = 'forth'
            } else {
              update = false
            }
            if (update) {
              this.leadService.postOnboardData(ob, type).toPromise()
                .then(res => {
                  this.postlog(change, ob.leadid)
                  this.alertNotificationService.toastAlertSuccess('Manual Registration Complete')
                  this.refreshlist()
                }).catch(err => this.alertNotificationService.alertError(err))
            }
          }
        }
      })
  }

  manualreginco(ob) {
    this.alertNotificationService.alertCustomMsg('Do you want to Change Manual Registration to Pending?')
      .then(async result => {
        if (result.isConfirmed) {
          var time = null
          await this.leadService.getCurrentTime().toPromise()
            .then(res => time = new Date(res['time']))
            .catch(err => time = new Date())
          var change = new LeadChanges();
          change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
          change.date = time;
          if (ob) {
            var update = true
            var type
            if (ob.forthmanualregcomplete && ob.mode == 'mode4' && ob.forthregstarttime) {
              ob.forthmanualregcomplete = false
              ob.forthregcompletetime = null
              ob.forthmanualregdonebyid = null;
              ob.forthmanualregdonebyname = null;
              change.change = 'Forth Installment Changed to Pending.'
              type = 'forth';
            } else if (ob.thirdmanualregcomplete && (ob.mode == 'mode3' || ob.mode == 'mode4') && ob.thirdregstarttime) {
              ob.thirdmanualregcomplete = false
              ob.thirdregcompletetime = null
              ob.thirdmanualregdonebyid = null;
              ob.thirdmanualregdonebyname = null;
              change.change = 'Third Installment Changed to Pending.'
              type = 'third';
            } else if (ob.secmanualregcomplete && ob.mode != 'mode1' && ob.secregstarttime) {
              ob.secmanualregcomplete = false
              ob.secregcompletetime = null
              ob.secmanualregdonebyid = null
              ob.secmanualregdonebyname = null
              change.change = 'Second Installment Changed to Pending.'
              type = 'second';
            } else if (ob.manualregcomplete) {
              ob.manualregcomplete = null
              ob.regcompletetime = null
              ob.manualregdonebyid = null;
              ob.manualregdonebyname = null;
              change.change = 'First Installment Changed to Pending.'
              type = 'first';
            } else {
              update = false
            }
            if (update) {
              this.leadService.postOnboardData(ob, type).toPromise()
                .then(res => {
                  this.postlog(change, ob.leadid)
                  this.alertNotificationService.toastAlertSuccess('Manual Registration Changed to Pending')
                  this.refreshlist()
                }).catch(err => this.alertNotificationService.alertError(err))
            }
          }
        }
      })
  }

  comment: string = null;
  onAddCmnt(content, ob) {
    this.comment = null
    this.alertNotificationService.alertCustomMsg("Do you want to add Comment?")
      .then(result => {
        if (result.isConfirmed) {
          this.modalService.open(content, { centered: true }).result.then((result) => {
            if (result == 'Save') {
              if (ob) {
                ob.comment = this.comment
                this.leadService.postOnboardData(ob, 'comment').toPromise()
                  .then(async res => {
                    var time = null
                    await this.leadService.getCurrentTime().toPromise()
                      .then(res => time = new Date(res['time']))
                      .catch(err => time = new Date())
                    var change = new LeadChanges();
                    change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
                    change.date = time;
                    change.change = 'Support Comment: ' + this.comment
                    this.postlog(change, ob.leadid)
                    this.alertNotificationService.toastAlertSuccess('Comment Added')
                    this.refreshlist()
                  }).catch(err => this.alertNotificationService.alertError(err))
              }
            }
          }).catch((res) => { this.comment = null });
        }
      })
  }

  sellingPriceApproval(ob) {
    this.alertNotificationService.alertApprove()
      .then(async result => {
        if (result.isConfirmed) {
          var time = null
          await this.leadService.getCurrentTime().toPromise()
            .then(res => time = new Date(res['time']))
            .catch(err => time = new Date())
          var change = new LeadChanges();
          change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
          change.date = time;
          if (ob) {
            var update = true
            if (ob.below_selling_price && !ob.below_selling_approval) {
              ob.below_selling_approval = true;
              ob.below_selling_approval_by = this.userDetails.name + ' - ' + this.userDetails.invid;
              change.change = 'Minumum Selling Approved.'
            } else {
              update = false
            }
            if (update) {
              this.leadService.postOnboardData(ob, 'minselling').toPromise()
                .then(res => {
                  this.postlog(change, ob.leadid)
                  this.alertNotificationService.toastAlertSuccess('Minumum Selling Approved')
                  this.refreshlist()
                }).catch(err => this.alertNotificationService.alertError(err))
            }
          }
        }
      })
  }

  goto(data) {
    if (data.below_selling_price && !data.below_selling_approval) {
      this.alertNotificationService.alertInfo("Please Approve Minimum Price Selling by Admin")
      return;
    }
    let url = `/admin/orders/new-order?lead_id=${data.leadid}`;
    if (data.orderID) {
      url = `/admin/orders/${data.orderID}`;
    }
    window.open(url, '_blank');
  }

  loggedUser = new User();
  edit(data, component) {
    this.loggedUser = null
    this.loggedUser = this.allUser.filter(e => data.studentidgencomplete && e.invid == data.studentid)[0]
    if (data.studentidgencomplete && this.loggedUser) {
      this.onstateChange();
      this.modalService.open(component, { size: 'xl', scrollable: true }).result
        .then(resp => {
          if (resp == 'Save') {
            this.alertNotificationService.alertChanges()
              .then(result => {
                if (result.isConfirmed) {
                  this.userService.updateUserProfile(this.loggedUser._id, this.loggedUser).toPromise()
                    .then(res => {
                      this.loggedUser = null
                      this.alertNotificationService.toastAlertSuccess('Student Profile Updated');
                    }).catch(err => this.alertNotificationService.alertError(err));
                }
              })
          }
        }).catch(err => this.alertNotificationService.alertError(err));
    }
    else {
      this.alertNotificationService.alertInfo('Student Not Registerd. Goto Leads to update student details then register the student')
    }
  }

  districts: string[] = []

  onstateChange() {
    if (this.loggedUser && this.loggedUser.state) {
      this.districts = this.statewisedistricts.filter(e => e.state == this.loggedUser.state)[0].districts;
      if (!this.districts.includes(this.loggedUser.city)) {
        this.loggedUser.city = ''
      }
    } else {
      this.districts = []
    }
  }

  chkReg(ob) {
    if (!ob.manualregcomplete) {
      return true
    } else if (!ob.secmanualregcomplete && ob.mode != 'mode1') {
      return true
    } else if (!ob.thirdmanualregcomplete && (ob.mode == 'mode3' || ob.mode == 'mode4')) {
      return true
    } else if (!ob.forthmanualregcomplete && ob.mode == 'mode4') {
      return true
    } else {
      return false
    }
  }
  chkReg1(ob) {
    if (ob.forthmanualregcomplete && ob.mode == 'mode4') {
      return true
    } else if (ob.thirdmanualregcomplete && (ob.mode == 'mode3' || ob.mode == 'mode4')) {
      return true
    } else if (ob.secmanualregcomplete && ob.mode != 'mode1') {
      return true
    } else if (ob.manualregcomplete) {
      return true
    } else {
      return false
    }
  }

  gotoleads(data) {
    this.router.navigate(['/admin/leads/lead-details'], { queryParams: { id: data.leadid } })
    this.leadService.leadid = data.leadid
    // window.open(`/admin/leads/lead-details?id=${data.leadid}`, '_blank');
  }

  filterQuery: string = 'pending';
  filterQuery1: string = 'all';
  filterQuery2: string = 'all';
  displayData: any[] = []
  onChange() {
    this.displayData = [...this.allOnboardData]
    switch (this.filterQuery1) {
      case 'course':
        this.displayData = this.displayData.filter(e => e.servicetype == 'course')
        break;
      case 'product':
        this.displayData = this.displayData.filter(e => e.servicetype == 'product')
        break;
      case 'insignia':
        this.displayData = this.displayData.filter(e => e.servicetype == 'insignia')
        break;
      case 'subscription':
        this.displayData = this.displayData.filter(e => e.servicetype == 'subscription')
        break;
      case 'insignia_subscription':
        this.displayData = this.displayData.filter(e => e.servicetype == 'insignia_subscription')
        break;
      case 'invesmentor':
        this.displayData = this.displayData.filter(e => e.servicetype == 'invesmentor')
        break;
    }
    switch (this.filterQuery2) {
      case 'minsellingpend':
        this.displayData = this.displayData.filter(e => e.below_selling_price && !e.below_selling_approval)
        break;
      case 'minsellingcomp':
        this.displayData = this.displayData.filter(e => e.below_selling_price && e.below_selling_approval)
        break;
    }
    this.dataSource = new MatTableDataSource(this.displayData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = this.displayData.length;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getTimeDiff(date1: any, date2?: any) {
    if (date1 && date2) {
      return moment(date1).from(date2, true);
    } else if (date1) {
      return moment(date1).fromNow(true);
    }
    else null
  }

  postlog(change: LeadChanges, id) {
    var logs = new LeadChangelog();
    logs.leadid = id;
    logs.changes = [];
    logs.changes.push(change)
    this.leadService.postleadchangelogs([logs]).toPromise()
      .then(res => { })
      .catch(err => console.log(err))
  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet("Onboarding Data", this.dataSource.filteredData)
    }
  }
}
