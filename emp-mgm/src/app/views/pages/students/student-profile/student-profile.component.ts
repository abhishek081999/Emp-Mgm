import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { EmailRegex } from 'src/app/Enums/staticdata';
import { Devices, LoginHistory } from 'src/app/model/devices.model';
import { Notifications } from 'src/app/model/notifications.model';
import { Referrals, Transaction } from 'src/app/model/referral.model';
import { installmentlist } from 'src/app/model/sales.model';
import { StateDistricts } from 'src/app/model/statedistrict.model';
import { Countries, User } from 'src/app/model/user.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { LeadsService } from 'src/app/services/leads.service';
import { ReferralService } from 'src/app/services/referral.service';
import { SellsService } from 'src/app/services/sells.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class StudentProfileComponent implements OnInit {
  profilePictureUrl: any;
  dataSource: MatTableDataSource<LoginHistory>;
  displayedColumns: string[];
  user = new User();
  Address
  statewisedistricts: StateDistricts[] = []
  iseditedform = false
  issavedform = false
  imagechange = false;
  dates = ''
  filesToUpload: File;
  imagepath
  fd = new FormData();
  countries: Countries[] = []
  isLoading = false
  isLoading2 = false  // for referral details
  isLoading3 = false  // for device details
  isLoadingTrn = false  // referral transaction
  selection = new SelectionModel<Referrals>(true, []);
  devices: Array<Devices> = [];
  loginghisttory: Array<LoginHistory> = [];
  notification: Notifications = {
    title: null,
    desc: null,
    img: "",
    for: null,
    url: ""
  };
  ordersList: any;
  studentorders: any;
  displayedColumnsorders: string[];
  dataSourceorders: MatTableDataSource<Devices>;
  displayedColumnsorderslist: string[];
  dataSourceorderslist: MatTableDataSource<unknown>;
  installments: any[];
  expandedElement: any;
  // studentorders: any;
  constructor(
    private userService: UserService,
    private alertNotificationService: AlertNotificationsService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private leadsService: LeadsService,
    private referralService: ReferralService,
    private _clipboardService: ClipboardService,
    private router: Router,
    private sellsService: SellsService,
  ) { }
  emailRegex = EmailRegex;
  districts: string[] = []
  states: string[] = []
  invid: string;
  dataSource2: MatTableDataSource<Devices>;  // for device details?
  dataSourceTrn: MatTableDataSource<Transaction>;  // for referral details?

  actv: string[] = ['Active', 'Inactive']
  actvity
  transaction: Transaction = {
    _id: '',
    details: '',
    txn_type: '',
    amount: 0,
    date: null,
    type: '',
    user_name: '',
    user_invid: '',
    ids: []
  }
  txnType: string[] = ['CREDIT', 'DEBIT'];
  Type: string[] = ['BONUS', 'COURSE', 'PRODUCT', 'INSIGNIA'];

  pageSizeOptions = 10
  // pageSizeOptions2 = 10
  displayedColumns2: string[];   // for Device details
  displayedColumnsTrn: string[];   // for referral details

  allData;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.invid = params.get('id');
    });

    this.displayedColumns2 = ['device_id', 'device_token', 'device_name', 'device_type', 'app_lang', 'version_code', 'version_name'];
    this.displayedColumns = ['is_logged_in', 'logged_in_time', 'logged_out_time', 'device_id', 'device_name', 'device_type'];
    this.displayedColumnsTrn = ['txn_type', 'amount', 'type', 'details', 'date']
    this.displayedColumnsorders = ['orderID', 'sales_rep', 'service_code', 'service_name', 'batch_date', 'order_date',
      'payment_mode', 'total_amount', 'payment_received', 'total_additional_charges', 'total_gst', 'total_due', 'coupon_code', 'status'];
    this.refresh()
  }
  isavailable = true
  dataLength;
  Errmsg;
  Errmsg2; // for Devices details
  Errmsg3; // for Login History 

  async refresh() {
    this.isLoading2 = true;
    this.isLoading3 = true;
    this.isLoading = true;
    this.isLoadingTrn = true; //referrral transaction loading
    await this.userService.getUser(this.invid).toPromise()
      .then(res => this.user = res as User)
      .catch(err => this.alertNotificationService.alertError(err))

    await this.userService.getReferralforuser(this.user._id).toPromise()
      .then(res => {
        this.allData = res
        var tran
        this.isLoading2 = false;   // for referral details

        tran = this.allData.transactions.slice(0, 5); // for cut 10 data from all array
        this.dataSourceTrn = new MatTableDataSource(tran.reverse());
        this.dataSourceTrn.paginator = this.paginator;
        this.dataSourceTrn.sort = this.sort;
        this.isLoadingTrn = false;
      })
      .catch(err => this.alertNotificationService.alertError('Referral Details ' + err))


    await this.userService.getCountryCode().toPromise()
      .then(res => {
        this.countries = res as Countries[];
      })
      .catch(err => this.alertNotificationService.alertError(err))
    // console.log(this.user._id)

    await this.userService.getDeviceDetails(this.user._id).toPromise()
      .then(res => {
        console.log(res)
        this.devices = res as Devices[];
        this.devices = this.devices.slice(0, 10); // for cut 10 data from all array
        this.isavailable = this.devices.length > 0;
        this.isLoading3 = false;

        this.dataSource2 = new MatTableDataSource(this.devices.reverse());
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
        this.dataLength = this.devices.length;
      })

    await this.sellsService.getConversionList(null, null, null, null, this.user.invid, null, null).toPromise()
      .then(res => {
        this.studentorders = res as []
        this.isLoading = false
        this.dataSourceorders = new MatTableDataSource(this.studentorders);
        this.dataSourceorders.paginator = this.paginator;
        this.dataSourceorders.sort = this.sort;
        this.dataLength = this.studentorders.length;
      }).catch(err => this.alertNotificationService.alertError(err));

    await this.userService.getloginHistory(this.user._id).toPromise()
      .then(res => {
        this.loginghisttory = res as LoginHistory[];
        this.loginghisttory = this.loginghisttory.slice(0, 10); // for cut 10 data from all array
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(this.loginghisttory.reverse());
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.loginghisttory.length;
      })
    if (!this.user.countryCode) {
      this.user.countryCode = '+91'  //by default 
    }

    this.profilePictureUrl = this.user.profile_image;

    if (this.user) {
      this.Address = this.user.address + ', ' + this.user.city + ', ' + this.user.pincode + ', ' + this.user.state;

    }
    this.leadsService.getstatewisedistrict().toPromise()
      .then(res => {
        this.statewisedistricts = res
        this.states = this.statewisedistricts.map(e => e.state).sort()
      }).catch(err => this.alertNotificationService.alertError(err))

    // this.dataSource2 = new MatTableDataSource(this.allData);
    // this.dataSource2.paginator = this.paginator;
    // this.dataSource2.sort = this.sort;
    if (!this.allData) {
      this.isLoading2 = false
      this.Errmsg = "Referral Details Not found"
    }
    if (!this.devices) {
      this.isLoading3 = false
      this.Errmsg2 = "Device Details Not found"
    }
    if (!this.loginghisttory) {
      this.isLoading = false
      this.Errmsg3 = "Login History Not found"
    }
  }
  async changePassword(u) {
    await Swal.fire({
      title: 'Enter New Password',
      inputAutoTrim: true,
      input: 'password',
      inputLabel: 'New Password',
      inputPlaceholder: 'Enter New Password',
      inputAttributes: {
        autocomplete: 'new-password',
        autofill: 'off'
      }
    }).then(res => {
      if (res.value) {
        var data = {
          _id: u._id,
          newpassword: res.value
        }
        this.userService.resetpassword(data).toPromise()
          .then(res => {
            this.alertNotificationService.toastAlertSuccess('Student Password Updated');
          }).catch(err => this.alertNotificationService.alertError(err));
      }
    })

  }
  loggedUser = new User();
  edit(data, component) {
    this.loggedUser = data
    this.onstateChange();
    this.modalService.open(component, { size: 'xl', scrollable: true }).result
      .then(resp => {
        if (resp == 'Save') {
          this.alertNotificationService.alertChanges()
            .then(result => {
              if (result.isConfirmed) {
                this.userService.updateUserProfile(this.loggedUser._id, this.loggedUser).toPromise()
                  .then(res => {
                    this.alertNotificationService.toastAlertSuccess('Student Profile Updated');
                    this.refresh()
                  }).catch(err => this.alertNotificationService.alertError(err));
              }
            })
        }
      }).catch(err => this.alertNotificationService.alertError(err));
  }
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

  AllTransaction() {
    this.router.navigateByUrl('/admin/referral/referral-transaction/' + this.user.invid)
  } ViewallDeviceDetails() {
    this.router.navigateByUrl('/admin/app/devices/' + this.user.invid)

  }
  ViewallLoginHistory() {
    this.router.navigateByUrl('/admin/app/login-history/' + this.user.invid)
  }

  orderslist() {
    this.router.navigate(['/admin/sales/convertion-list'], { queryParams: { studentfilter: this.user.invid } })
  }
  ordersID(orderID) {
    this.router.navigateByUrl('/admin/orders')

    // this.router.navigate(['/admin/orders'], { queryParams: { filterValue: orderID } })
  }

  isnotregistered(r: installmentlist) {
    return r.installments.filter(e => e._id).map(e => e._id).length < r.installments.length
  }



  dpchange = false
  onFileDropped(event) {

    if (event.target.files.length === 0)
      return
    var mimetype = event.target.files[0].type;
    if (mimetype.match(/image\/*/) == null) {
      this.alertNotificationService.alertInfo('Only images are Supported')
      return
    }
    if (event.target.files[0].size > 307200) {
      this.alertNotificationService.alertInfo('Maximum image size is 300kb')

      return
    }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_e) => {
      var image = new Image()
      image.src = reader.result.toString()
      image.onload = (e) => {

        this.profilePictureUrl = reader.result
        this.imagepath = event.target.files;
        this.imagechange = true
        this.dpchange = true
        this.iseditedform = true
        // this.user.profile_image = this.dates + event.target.files[0].name;
        this.filesToUpload = event.target.files[0]


        this.fd = new FormData()
        this.fd.append("file", this.filesToUpload, this.filesToUpload['name']);
        this.fd.append("_id", this.user._id)
        this.userService.updateProfilePic(this.fd).toPromise()
          .then(res => {

            console.log(res)
            this.alertNotificationService.toastAlertSuccess('Image Updated')

          }
          ).catch(err => this.alertNotificationService.alertError(err))
      }


    }
    // this.imagechange = true
    // this.user.profile_image = event.target.files[0].name;
    // this.filesToUpload = <File>event.target.files[0];

  }



  fileBrowseHandler(event) {
    console.log(event)
    if (event.target.files.length === 0)
      return
    var mimetype = event.target.files[0].type;
    if (mimetype.match(/image\/*/) == null) {
      this.alertNotificationService.alertInfo('Only images are Supported')
      return
    }
    if (event.target.files[0].size > 307200) {
      this.alertNotificationService.alertInfo('Maximum image size is 300kb')
      this.refresh()
      return
    }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_e) => {
      var image = new Image()
      image.src = reader.result.toString()
      image.onload = (e) => {

        this.profilePictureUrl = reader.result
        this.imagepath = event.target.files;
        this.imagechange = true
        this.dpchange = true
        this.iseditedform = true
        // this.user.profile_image = this.dates + event.target.files[0].name;
        this.filesToUpload = event.target.files[0]


        this.fd = new FormData()
        this.fd.append("file", this.filesToUpload, this.filesToUpload['name']);
        this.fd.append("_id", this.user._id)
        this.userService.updateProfilePic(this.fd).toPromise()
          .then(res => {

            console.log(res)
            this.alertNotificationService.toastAlertSuccess('Image Updated')

          }
          ).catch(err => this.alertNotificationService.alertError(err))
      }


    }
    // this.imagechange = true
    // this.user.profile_image = event.target.files[0].name;
    // this.filesToUpload = <File>event.target.files[0];


  }


  imagechangee = false

  handelFileInput(event) {
    this.imagechangee = true
    this.filesToUpload = <File>event.target.files[0];
  }
  isactive() {
    var body = {
      _id: this.user._id,
      isActive: this.user.isActive,
    }
    this.userService.updateUserIsactive(body).toPromise()
      .then(res => {
        if (this.user.isActive) {
          this.alertNotificationService.toastAlertSuccess('User Activated')
        }
        else {
          this.alertNotificationService.toastAlertSuccess('User Blocked')
        }

      }
      ).catch(err => this.alertNotificationService.alertError(err))
  }
  isEntirePageSelected() {
    return this.getPageData().every((row) => this.selection.isSelected(row));
  }
  getPageData() {
    if (this.dataSource)
      return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
    return []
  }

  checkboxLabel(row?, i?): string {
    if (!row) {
      return `${this.isEntirePageSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${i}`;
  }

  SearchFncode(term: string, item: Countries) {
    term = term.toLowerCase();
    return item.name.toLowerCase().indexOf(term) > -1 || item.code.toLowerCase().indexOf(term) > -1;
  }

  masterToggle() {
    this.isEntirePageSelected() ?
      this.selection.deselect(...this.getPageData()) :
      this.selection.select(...this.getPageData());
  }
  postnotification(notificationForm: NgForm) {
    // this.alertNotificationService.alertCustomMsg("Are You sure to proceed furthur?")
    //   .then(result => {
    //     if (result.isConfirmed) {
    //       this.fd = new FormData();
    //       if (this.imagechange) {
    //         const files: File = this.filesToUpload;
    //         this.fd.append("file", files, this.notification.img.toString());
    //       }
    //       this.fd.append("title", this.notification.title)
    //       this.fd.append("desc", this.notification.desc)
    //       this.fd.append("for", this.notification.for)
    //       this.fd.append("url", this.notification.url)
    //       this.notificationService.postNotification(this.fd).toPromise()
    //         .then(res => {
    //           notificationForm.resetForm()
    //           this.alertNotificationService.toastAlertSuccess("Submitted Successfully");
    //           this.refreshList();
    //         }).catch(err => this.alertNotificationService.alertError(err))
    //     }
    //   })
  }

  gotoorder(order) {
    window.open(`/admin/orders/${order.orderID}`, 'blank');
  }


  LogutUser(Id) {
    this.alertNotificationService.alertCustomMsg('Do you want to logout this user?')
      .then(res => {
        if (res.isConfirmed) {
          if (Id) {
            var body = {
              user_id: Id,
            }
            this.userService.logoutUser(body).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Logout Succesfully');
                this.refresh()
              })
          }
        }
      })
  }

  isActive = false
  ReferalActive() {
    this.alertNotificationService.alertCustomMsg(`Do you want ${this.allData.isActive ? 'Active' : 'Inactive'} this Referral ?`)
      .then(res => {
        if (res.isConfirmed) {
          var data = {
            ids: [this.allData._id],
            isActive: this.allData.isActive
          }
          this.referralService.updateRef(data).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Succesfully Updated');
              this.refresh();
            })
        }
        else {
          this.allData.isActive = !this.allData.isActive;
        }

      })
  }

  copied(link) {
    this._clipboardService.copy(link)
    this.alertNotificationService.toastAlertSuccess('Details Copied')
  }

  addTransactionModal(content) {
    this.modalService.open(content, { centered: true, size: 'xl' })
      .result.then((result) => {
        if (result == 'Submit') {
          var id = this.selection.selected.map(e => e._id)
          var data = {
            details: this.transaction.details,
            txn_type: this.transaction.txn_type,
            amount: this.transaction.amount,
            date: this.transaction.date,
            type: this.transaction.type,
            ids: id
          }
          this.referralService.postNewTran(data).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Succesfully Added');
              this.selection.clear()
              this.refresh();

            })


        }
      })
      .catch(err => { })
  }
}
