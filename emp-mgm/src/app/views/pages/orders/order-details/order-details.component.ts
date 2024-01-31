import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Coupon } from 'src/app/model/coupon.model';
import { Course } from 'src/app/model/course.model';
import { Insignia } from 'src/app/model/insignia.model';
import { Instructor } from 'src/app/model/instructor.model';
import { OrderHistory, OrderInstallments, OrderLines, Orders, PaymentLinks, RequestAdjustment, RequestBatchChange } from 'src/app/model/orders.model';
import { Products } from 'src/app/model/product.model';
import { Referrals, ReferralSetting } from 'src/app/model/referral.model';
import { Subscription } from 'src/app/model/subscription.model';
import { Subscriptionpackage } from 'src/app/model/subscriptionpackage.model';
import { User } from 'src/app/model/user.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { ExportService } from 'src/app/services/export.service';
import { InsigniaService } from 'src/app/services/insignia.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { OrdersService } from 'src/app/services/orders.service';
import { PackageService } from 'src/app/services/package.service';
import { ReferralService } from 'src/app/services/referral.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UserService } from 'src/app/services/user.service';
import { gstAmount } from 'src/app/utility/gstAmount';
import { roundOff } from 'src/app/utility/roundOff';
import { RequestAdjustmentHistoryComponent } from '../request-adjustment-history/request-adjustment-history.component';
import { RequestAdjustmentsComponent } from '../request-adjustments/request-adjustments.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/model/employee.model';
import { RefundRequest } from 'src/app/model/refund.model';
import { RequestRefundComponent } from '../request-refund/request-refund.component';
import { Invesmentor } from 'src/app/model/invesmentor.model';
import { InvesmentorService } from 'src/app/services/invesmentor.service';
import { LeadsService } from 'src/app/services/leads.service';
import { Leads } from 'src/app/model/leads.model';
import * as moment from 'moment';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrderDetailsComponent implements OnInit {


  allStudent: User[] = [];
  allEmployee: Employee[] = [];
  allCourse: Course[] = [];
  allInsignia: Insignia[] = [];
  allProduct: Products[] = [];

  allInvesmentor: Invesmentor[] = []

  allInstructor: Instructor[] = [];
  student = new User();
  employee = new Employee();
  coupon_code: Coupon = null;
  allCoupon: Coupon[] = [];
  coursecodes: string[] = [];
  allinsigniaids: string[] = [];
  productids: string[] = [];
  installments: OrderInstallments[] = []
  isAmountEditable = false
  orderDetails: Orders = {
    order_date: new Date(),
    student_id: null,
    orderID: null,
    status: null,
    total_amount: 0,
    payment_mode: '',
    original_amount: 0,
    total_discount: 0,
    is_submitted: false,
    is_saved: false
  };
  displayedColumns: string[] = ['item_no', 'item_type', 'item_code', 'original_amount', 'amount', 'options'];
  displayedColumns1: string[] = ['installment_number', 'installment_date', 'installment_amount', 'gst', 'charges', 'net_amount', 'due', 'status'];
  displayedColumns2: string[] = ['installment_number', 'payment_date', 'txnid', 'invoice_number', 'installment_amount', 'gst', 'charges', 'net_amount', 'status', 'options'];
  displayedColumns3: string[] = ['installment_number', 'id', 'created_at', 'amount', 'short_url', 'status', 'options'];
  orderLines: OrderLines[] = []
  dataSource: MatTableDataSource<OrderLines>;
  dataSource1: MatTableDataSource<OrderInstallments>;
  dataSource3: MatTableDataSource<OrderInstallments>;
  dataSource2: MatTableDataSource<OrderHistory>;
  dataSource4: MatTableDataSource<PaymentLinks>;
  allPaymentLinks: PaymentLinks[] = [];
  expandedElement: OrderLines | null;
  expandedElement1: OrderInstallments | null;
  subscribe = new Subscription()
  subscribepackage: Subscriptionpackage[] = []
  subscriptionFound = false;
  errMsg = ''
  groupedInstallment = new Map<string, OrderInstallments[]>();
  orderInstallments: OrderInstallments[] = []
  paidInstallments: OrderInstallments[] = []
  mode_available: boolean[] = []
  defaultNavActiveId = 1
  isInsAmountEditable = false
  isError = false;
  orderId = '';
  lead_id = '';
  currentLead: Leads = null
  isEditable = true;
  isFullDisable = false;
  isSave = true;
  isSaveandClose = false
  orderHistory: OrderHistory[] = []
  totalInsAmount = 0
  totalInsGst = 0
  totalInsDue = 0
  totalInsNetAmount = 0
  totalAdditionalCharges = 0
  totalOrderItemAmount = 0
  isPayDue = false
  isButtonDisable = false
  isCouponApplied = false
  eligibleUpgrades = [];
  invesmentorUpgradeFounds = false;
  constructor(
    private userService: UserService,
    private alertNotificationService: AlertNotificationsService,
    private courseService: courseService,
    private insigniaService: InsigniaService,
    private productService: PackageService,
    private instructorService: InstructorService,
    private subscriptionService: SubscriptionService,
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private exportService: ExportService,
    private modalService: NgbModal,
    private referralService: ReferralService,
    private employeeService: EmployeeService,
    private invesmentorService: InvesmentorService,
    private leadService: LeadsService,

  ) { }

  available_Modes = [{
    title: 'Mode 1',
    value: 'mode1',
    disabled: false
  }, {
    title: 'Mode 2',
    value: 'mode2',
    disabled: false
  }, {
    title: 'Mode 3',
    value: 'mode3',
    disabled: false
  }, {
    title: 'Mode 4',
    value: 'mode4',
    disabled: false
  }, {
    title: 'Mode 5',
    value: 'mode5',
    disabled: false
  }]

  maxdate;
  async ngOnInit() {
    this.maxdate = moment().format('YYYY-MM-DD');
    this.route.paramMap.subscribe(params => {
      this.orderId = params.get('orderId');
      if (this.orderId) {
        this.getOrder();
      } else {
        this.AddService()
      }
    });


    await this.refreshStudent();
    await this.refreshEmployee();
    this.refreshCoupon();
    await this.refreshCourse();
    await this.refreshInsignia();
    await this.refreshProducts();
    this.refreshInstructor();
    await this.refreshInvesmentor();
    this.route.queryParams.subscribe(params => {
      this.lead_id = params['lead_id'];
      console.log(this.lead_id);
      if (this.lead_id) {
        this.getLead()
      }
    });
  }

  AddService() {
    this.orderLines.push(new OrderLines());
    this.dataSource = new MatTableDataSource(this.orderLines);
  }

  history(component) {
    this.orderService.history(this.orderId)
      .toPromise()
      .then(res => {
        this.orderHistory = res
        this.dataSource2 = new MatTableDataSource(this.orderHistory);
        const modalRef = this.modalService.open(component, { centered: true, scrollable: true, size: 'xl' })
        modalRef.result.then((result) => {
          if (result) {

          }
        }).catch(err => { })
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  updateOrder() {
    this.isError = false;
    this.errMsg = '';
    this.validateOrder()
    if (this.isError) {
      this.errMsg += ` First Clear all Error.`
      this.isError = true
      return
    }
    this.alertNotificationService.alertCustomMsg("are you sure you want to save the order?")
      .then(result => {
        if (result.isConfirmed) {
          this.orderDetails.invescashAmount = 0 //need to fix
          console.log(this.orderDetails)
          console.log(this.orderLines)
          console.log(this.orderInstallments)
          var data = {
            orderDetails: this.orderDetails,
            orderLines: this.orderLines,
            orderInstallments: this.orderInstallments
          }
          this.orderService.updateOrder(data).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Order Updated")
              this.getOrder();
            }).catch(err => this.alertNotificationService.alertError(err));
        }
      })
  }

  submit() {
    this.isError = false;
    this.errMsg = '';
    if (!this.student.state) {
      this.alertNotificationService.alertInfo('State Not added by student. Please add state to Create order');
      this.errMsg = 'State Not added by student. Please add state to Create order'
      this.isError = true;
    }
    this.validateOrder();
    this.validateRegistrations();
    if (this.isError) {
      this.errMsg += ` First Clear all Error.`
      this.isError = true
      return
    }
    this.alertNotificationService.alertCustomMsg("are you sure you want to save the order?")
      .then(result => {
        if (result.isConfirmed) {
          this.orderDetails.invescashAmount = 0 //need to fix
          console.log(this.orderDetails)
          console.log(this.orderLines)
          console.log(this.orderInstallments)
          this.orderDetails.lead_id = this.lead_id ? this.lead_id : null;
          var data = {
            orderDetails: this.orderDetails,
            orderLines: this.orderLines,
            orderInstallments: this.orderInstallments
          }
          this.orderService.newOrder(data).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Order Created")
              this.orderDetails = res['orderDetails'];
              this.orderLines = [];
              this.orderInstallments = [];
              this.dataSource1 = new MatTableDataSource(this.orderInstallments);
              this.router.navigate(['/admin/orders', this.orderDetails.orderID])
            }).catch(err => this.alertNotificationService.alertError(err));
        }
      })
  }

  save() {
    this.isError = false;
    this.errMsg = '';
    this.validateOrder()
    this.validateRegistrations()
    if (!this.student.state) {
      this.alertNotificationService.alertInfo('State Not added by student. Please add state to Create order');
      this.errMsg = 'State Not added by student. Please add state to Create order'
      this.isError = true;
    }
    if (this.isError) {
      this.errMsg += ` First Clear all Error.`
      this.isError = true
      return
    }
    this.alertNotificationService.alertCustomMsg("are you sure you want to save the order?")
      .then(result => {
        if (result.isConfirmed) {
          this.orderDetails.invescashAmount = 0 //need to fix
          console.log(this.orderDetails)
          console.log(this.orderLines)
          console.log(this.orderInstallments)
          var data = {
            orderDetails: this.orderDetails,
            orderLines: this.orderLines,
            orderInstallments: this.orderInstallments
          }
          this.orderService.saveOrder(data).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Order Saved")
              this.orderDetails = res['orderDetails'];
              this.orderLines = res['orderLines'];
              this.orderInstallments = res['orderInstallments'];
              if (this.isSaveandClose) {
                this.router.navigate(['/admin/orders'])
              } else {
                this.router.navigate(['/admin/orders', this.orderDetails.orderID])
              }
            }).catch(err => this.alertNotificationService.alertError(err));
        }
      })
  }

  requestRefund() {
    var requestRefund = new RefundRequest();
    requestRefund.orderID = this.orderDetails.orderID;
    const modalRef = this.modalService.open(RequestRefundComponent, { centered: true, scrollable: true, size: 'xl' })
    modalRef.componentInstance.data = {
      requestRefund: requestRefund
    }
  }

  adjustmentHistory() {
    const modalRef = this.modalService.open(RequestAdjustmentHistoryComponent, { centered: true, scrollable: true, size: 'xl' })
    modalRef.componentInstance.data = {
      orderID: this.orderDetails.orderID
    }
  }

  requestAdjustment() {
    var requestAdjustment = new RequestAdjustment();
    requestAdjustment.orderID = this.orderDetails.orderID;
    requestAdjustment.total_discount = this.orderDetails.total_discount;
    requestAdjustment.total_amount = this.orderDetails.total_amount;
    requestAdjustment.original_amount = this.orderDetails.original_amount;
    requestAdjustment.prev_original_amount = this.orderDetails.original_amount;
    requestAdjustment.prev_total_amount = this.orderDetails.total_amount;
    requestAdjustment.prev_total_discount = this.orderDetails.total_discount;
    requestAdjustment.orderInstallments = [];
    requestAdjustment.state = this.student.state;
    this.orderInstallments.forEach(e => {
      requestAdjustment.orderInstallments.push({
        orderInstallmentID: e._id,
        installment_number: e.installment_number,
        installment_amount: e.installment_amount,
        prev_installment_amount: e.installment_amount,
        sgst: e.sgst,
        prev_sgst: e.sgst,
        igst: e.igst,
        prev_igst: e.igst,
        cgst: e.cgst,
        prev_cgst: e.cgst,
        additional_charges: e.additional_charges,
        prev_additional_charges: e.additional_charges,
        is_verified: e.is_verified,
        is_Paid: e.is_Paid
      })
    })
    requestAdjustment.orderLines = [];
    this.orderLines.forEach(e => {
      requestAdjustment.orderLines.push({
        orderLineID: e._id,
        item_type: e.item_type,
        item_id: e.item_id,
        amount: e.amount,
        prev_amount: e.amount,
        item_code: e.item_code,
        item_name: e.item_name,
        original_amount: e.original_amount,
        prev_original_amount: e.original_amount
      });
    })
    const modalRef = this.modalService.open(RequestAdjustmentsComponent, { centered: true, scrollable: true, size: 'xl' })
    modalRef.componentInstance.data = {
      requestAdjustment: requestAdjustment
    }
  }

  cancelorder() {
  }

  copy() {
  }

  saveclose() {
    this.isSaveandClose = true
    this.save()
  }

  paymentInstallment = new OrderInstallments();
  openPaymentComponent(component) {
    this.paymentInstallment = this.orderInstallments.filter(e => !e.is_Paid)[0]
    if (this.paymentInstallment) {
      if (!this.paymentInstallment._id) {
        this.alertNotificationService.alertInfo('Installment ID not fount. Please refresh the page.')
        return;
      }
      if (this.paymentInstallment.payment_link_id) {
        this.alertNotificationService.alertInfo('To add a invoice, Please Cancel the existing Active Payment Link.')
        return;
      }
      const modalRef = this.modalService.open(component, { centered: true, scrollable: true, size: 'xl' })
      modalRef.result.then((result) => {
        if (result == 'Save') {
          this.alertNotificationService.alertCustomMsg("are you sure you want to add payment?")
            .then(resulta => {
              if (resulta.isConfirmed) {
                if (this.student.state == 'West Bengal') {
                  this.paymentInstallment.cgst = roundOff(gstAmount(this.paymentInstallment.installment_amount) / 2)
                  this.paymentInstallment.sgst = roundOff(gstAmount(this.paymentInstallment.installment_amount) / 2)
                  this.paymentInstallment.igst = 0
                } else {
                  this.paymentInstallment.igst = gstAmount(this.paymentInstallment.installment_amount)
                  this.paymentInstallment.cgst = 0
                  this.paymentInstallment.sgst = 0
                }
                this.orderService.addPayment(this.paymentInstallment).toPromise()
                  .then(res => {
                    this.alertNotificationService.toastAlertSuccess("Payment Added Successfully");
                    this.getOrder();
                    this.paymentInstallment = new OrderInstallments();
                  }).catch(err => this.alertNotificationService.alertError(err))
              }
            })
        }
      }).catch(err => { })
    } else {
      this.alertNotificationService.alertInfo("All Installment Paid");
    }

  }

  newPaymentLink = new PaymentLinks();
  openPaymentLink(component) {
    this.paymentInstallment = this.orderInstallments.filter(e => !e.is_Paid)[0];
    if (this.paymentInstallment) {
      if (!this.paymentInstallment._id) {
        this.alertNotificationService.alertInfo('Installment ID not fount. Please refresh the page.')
        return;
      }
      if (this.paymentInstallment.payment_link_id) {
        this.alertNotificationService.alertInfo('To Create a new Payment Link, Please Cancel the existing Active Payment Link.')
        return;
      }
      this.newPaymentLink.amount = this.paymentInstallment.installment_amount;
      this.newPaymentLink.customer = {
        contact: this.student.telephone,
        email: this.student.email,
        name: this.student.fullName
      }
      this.newPaymentLink.description = `Payment Link for Order ${this.paymentInstallment.orderID} Installment ${this.paymentInstallment.installment_number}`
      this.newPaymentLink.installment_number = Number(this.paymentInstallment.installment_number);
      this.newPaymentLink.orderID = this.paymentInstallment.orderID;
      this.newPaymentLink.upi_link = false;
      const modalRef = this.modalService.open(component, { centered: true, scrollable: true, size: 'lg' })
      modalRef.result.then((result) => {
        if (result == 'Save') {
          this.alertNotificationService.alertCustomMsg("are you sure you want to create payment link?")
            .then(resulta => {
              if (resulta.isConfirmed) {
                this.orderService.newpaymentLink(this.newPaymentLink).toPromise()
                  .then(res => {
                    this.alertNotificationService.toastAlertSuccess("Payment Link Created");
                    this.paymentInstallment = new OrderInstallments();
                    this.newPaymentLink = new PaymentLinks();
                    this.getOrder();
                    this.defaultNavActiveId = 4;
                  }).catch(err => this.alertNotificationService.alertError(err))
              }
            })
        }
      }).catch(err => { })
    } else {
      this.alertNotificationService.alertInfo("All Installment Paid");
    }
  }

  cancelPaymentLink(data) {
    if (data.status === 'created') {
      this.alertNotificationService.alertCustomMsg("are you sure you want to cancel payment link?")
        .then(resulta => {
          if (resulta.isConfirmed) {
            this.orderService.cancelPaymentLink({ paymentLinkId: data.id }).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess("Payment Link Cancelled");
                this.allPaymentLinks = [];
                this.dataSource4 = new MatTableDataSource(this.allPaymentLinks);
                setTimeout(() => { this.refreshPaymentLinks(); }, 10000)
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    } else {
      this.alertNotificationService.alertInfo("Payment Link cannot be cancelled");
    }
  }

  validateOrder() {
    this.calculateInsTotals()
    this.calculateOrderTotals()
    if (this.totalInsAmount != this.orderDetails.total_amount) {
      this.errMsg += ` Total Installment Amount(${this.totalInsAmount}) Not equal to Total Order Price(${this.orderDetails.total_amount})`
      this.isError = true
    }
    if (this.totalOrderItemAmount != this.orderDetails.total_amount) {
      this.errMsg += ` Total Order Items Amount(${this.totalOrderItemAmount}) Not equal to Total Order Price(${this.orderDetails.total_amount})`
      this.isError = true
    }
    if (!this.orderDetails.student_id) {
      this.errMsg += ` Student not selected.`
      this.isError = true
    }
    if (this.orderLines.length == 0) {
      this.errMsg += ` Add Order Items.`
      this.isError = true
    }
    if (this.orderInstallments.length == 0) {
      this.errMsg += ` Click on Apply Button.`
      this.isError = true
    }
    if (this.isApplyNeeded) {
      this.errMsg += ` Click on Apply Button.`
      this.isError = true
    }
  }

  addInstallment() {
    var ins = new OrderInstallments()
    ins.additional_charges = 0;
    ins.cgst = 0;
    ins.sgst = 0;
    ins.igst = 0;
    ins.installment_amount = 0;
    ins.installment_date = new Date();
    ins.installment_number = this.orderInstallments.length + 1;
    ins.is_Paid = false;
    ins.orderID = this.orderDetails.orderID;
    this.orderInstallments.push(ins);
    this.dataSource1 = new MatTableDataSource(this.orderInstallments);
    this.isButtonDisable = true
    this.errMsg = 'Please Submit/Update the Order after Changes'
  }

  async applyItemsChanges() {
    if (!this.orderDetails.orderID) {
      this.installments = []
      this.orderDetails.total_amount = 0;
      this.orderDetails.original_amount = 0;
      this.orderDetails.total_discount = 0;
      this.isApplyNeeded = false;
      this.isError = false;
      this.errMsg = '';
      this.verifyMode();
      this.refreshCourseBatchAvailable();
      for (var e of this.orderLines) {
        var item
        switch (e.item_type.toUpperCase()) {
          case 'COURSE':
            item = this.allCourse.find(c => c._id == e.item_id)
            this.createCourseInstallment(item)
            break;
          case 'PRODUCT':
            item = this.allProduct.find(c => c._id == e.item_id)
            this.createProductInstallment(item)
            break;
          case 'INSIGNIA':
            item = this.allInsignia.find(c => c._id == e.item_id)
            this.createInsigniaInstallment(item)
            break;
          case 'SUBSCRIPTION':
            item = this.allCourse.find(c => c._id == e.item_id)
            this.createSubscriptionInstallment(e)
            break;
          case 'INSIGNIA_SUBSCRIPTION':
            item = this.allInsignia.find(c => c._id == e.item_id)
            this.createSubscriptionInstallment(e)
            break;
          case 'INVESMENTOR':
            item = this.allInvesmentor.find(c => c._id == e.item_id)
            this.createInvesmentorInstallment(e)
            break;
          case 'INVESMENTOR_UPGRADE':
            item = this.allInvesmentor.find(c => c._id == e.item_id)
            this.createInvesmentorUpgradeInstallment(e)
            break;
        }
      }
      console.log(this.installments)
      this.groupedInstallment = this.groupBy(this.installments, ins => ins.installment_number);
      this.createInstallments();
      this.addCoupon()

    } else if (this.orderDetails.orderID) {
      this.isApplyNeeded = false;
      this.isError = false;
      this.errMsg = '';
      if (this.orderDetails.total_discount === 0) {
        this.addCoupon()
      }
      this.modifyInstallment();
    }
    this.dataSource1 = new MatTableDataSource(this.orderInstallments);
    this.defaultNavActiveId = 2
    this.calculateInsTotals();
    this.totalOrderItemAmount = this.totalInsAmount
    console.log(this.totalOrderItemAmount)
  }

  modifyInstallment() {
    const total_due = this.orderInstallments.filter(f => f.installment_amount && !f.is_Paid).map(e => e.installment_amount).reduce((acc, value) => Number(acc) + Number(value), 0)
    if (this.orderDetails.payment_mode === 'mode1' && this.paidInstallments.length === 0) {
      this.orderInstallments = [{
        orderID: this.orderDetails.orderID,
        installment_number: 1,
        installment_date: new Date(),
        installment_amount: total_due,
        is_Paid: false,
        sgst: 0,
        cgst: 0,
        igst: 0,
        sales_rep: this.orderDetails.sales_rep,
        additional_charges: 0,
        is_verified: false
      }];
    } else if ((this.orderDetails.payment_mode === 'mode2' || this.orderDetails.payment_mode === 'mode5') && this.paidInstallments.length <= 1) {
      const first_ins = this.orderInstallments.find(e => e.installment_number == 1);
      if (first_ins && !first_ins.is_Paid) {
        first_ins.installment_amount = 499;
      }
      var second_ins = this.orderInstallments.find(e => e.installment_number == 2);
      if (second_ins) {
        second_ins.installment_amount = first_ins.is_Paid ? roundOff(total_due) : roundOff(total_due - first_ins.installment_amount);
      } else {
        second_ins = new OrderInstallments();
        second_ins.additional_charges = 0;
        second_ins.cgst = 0;
        second_ins.sgst = 0;
        second_ins.igst = 0;
        second_ins.installment_amount = first_ins.is_Paid ? roundOff(total_due) : roundOff(total_due - first_ins.installment_amount);
        second_ins.installment_date = moment(first_ins.installment_date).add(15, 'days').toDate();
        second_ins.installment_number = 2;
        second_ins.is_Paid = false;
        second_ins.is_verified = false;
        second_ins.orderID = this.orderDetails.orderID;
        second_ins.sales_rep = this.orderDetails.sales_rep;
      }
      this.orderInstallments = [first_ins, second_ins];
    } else if (this.orderDetails.payment_mode === 'mode3' && this.paidInstallments.length <= 1) {
      const first_ins = this.orderInstallments.find(e => e.installment_number == 1);
      if (first_ins && !first_ins.is_Paid) {
        first_ins.installment_amount = 499;
      }
      var second_ins = this.orderInstallments.find(e => e.installment_number == 2);
      var third_ins = this.orderInstallments.find(e => e.installment_number == 3);
      if (second_ins) {
        second_ins.installment_amount = first_ins.is_Paid ? roundOff(total_due / 2) : roundOff((total_due - first_ins.installment_amount) / 2);
      } else {
        second_ins = new OrderInstallments();
        second_ins.additional_charges = 0;
        second_ins.cgst = 0;
        second_ins.sgst = 0;
        second_ins.igst = 0;
        second_ins.installment_amount = first_ins.is_Paid ? roundOff(total_due / 2) : roundOff((total_due - first_ins.installment_amount) / 2);
        second_ins.installment_date = moment(first_ins.installment_date).add(15, 'days').toDate();
        second_ins.installment_number = 2;
        second_ins.is_Paid = false;
        second_ins.is_verified = false;
        second_ins.orderID = this.orderDetails.orderID;
        second_ins.sales_rep = this.orderDetails.sales_rep;
      }
      if (third_ins) {
        third_ins.installment_amount = first_ins.is_Paid ? roundOff(total_due / 2) : roundOff((total_due - first_ins.installment_amount) / 2);
      } else {
        third_ins = new OrderInstallments();
        third_ins.additional_charges = 0;
        third_ins.cgst = 0;
        third_ins.sgst = 0;
        third_ins.igst = 0;
        third_ins.installment_amount = first_ins.is_Paid ? roundOff(total_due / 2) : roundOff((total_due - first_ins.installment_amount) / 2);
        third_ins.installment_date = moment(second_ins.installment_date).add(15, 'days').toDate();
        third_ins.installment_number = 3;
        third_ins.is_Paid = false;
        third_ins.is_verified = false;
        third_ins.orderID = this.orderDetails.orderID;
        third_ins.sales_rep = this.orderDetails.sales_rep;
      }
      this.orderInstallments = [first_ins, second_ins, third_ins];
    } else if (this.orderDetails.payment_mode === 'mode4' && this.paidInstallments.length <= 2) {
      const first_ins = this.orderInstallments.find(e => e.installment_number == 1);
      if (first_ins && !first_ins.is_Paid) {
        first_ins.installment_amount = 499;
      }
      var second_ins = this.orderInstallments.find(e => e.installment_number == 2);
      var third_ins = this.orderInstallments.find(e => e.installment_number == 3);
      var forth_ins = this.orderInstallments.find(e => e.installment_number == 4);
      if (second_ins && !second_ins.is_Paid) {
        second_ins.installment_amount = first_ins.is_Paid ? roundOff(total_due / 3) : roundOff((total_due - first_ins.installment_amount) / 3);
      } else if (!second_ins) {
        second_ins = new OrderInstallments();
        second_ins.additional_charges = 0;
        second_ins.cgst = 0;
        second_ins.sgst = 0;
        second_ins.igst = 0;
        second_ins.installment_amount = first_ins.is_Paid ? roundOff(total_due / 3) : roundOff((total_due - first_ins.installment_amount) / 3);
        second_ins.installment_date = moment(first_ins.installment_date).add(15, 'days').toDate();
        second_ins.installment_number = 2;
        second_ins.is_Paid = false;
        second_ins.is_verified = false;
        second_ins.orderID = this.orderDetails.orderID;
        second_ins.sales_rep = this.orderDetails.sales_rep;
      }
      if (third_ins) {
        if (first_ins.is_Paid) {
          third_ins.installment_amount = second_ins.is_Paid ? roundOff(total_due / 2) : roundOff(total_due / 3);
        } else {
          third_ins.installment_amount = roundOff((total_due - first_ins.installment_amount) / 3)
        }
      } else {
        third_ins = new OrderInstallments();
        third_ins.additional_charges = 0;
        third_ins.cgst = 0;
        third_ins.sgst = 0;
        third_ins.igst = 0;
        if (first_ins.is_Paid) {
          third_ins.installment_amount = second_ins.is_Paid ? roundOff(total_due / 2) : roundOff(total_due / 3);
        } else {
          third_ins.installment_amount = roundOff((total_due - first_ins.installment_amount) / 3)
        }
        third_ins.installment_date = moment(second_ins.installment_date).add(15, 'days').toDate();
        third_ins.installment_number = 3;
        third_ins.is_Paid = false;
        third_ins.is_verified = false;
        third_ins.orderID = this.orderDetails.orderID;
        third_ins.sales_rep = this.orderDetails.sales_rep;
      }
      if (forth_ins) {
        if (first_ins.is_Paid) {
          forth_ins.installment_amount = second_ins.is_Paid ? roundOff(total_due / 2) : roundOff(total_due / 3);
        } else {
          forth_ins.installment_amount = roundOff((total_due - first_ins.installment_amount) / 3)
        }
      } else {
        forth_ins = new OrderInstallments();
        forth_ins.additional_charges = 0;
        forth_ins.cgst = 0;
        forth_ins.sgst = 0;
        forth_ins.igst = 0;
        if (first_ins.is_Paid) {
          forth_ins.installment_amount = second_ins.is_Paid ? roundOff(total_due / 2) : roundOff(total_due / 3);
        } else {
          forth_ins.installment_amount = roundOff((total_due - first_ins.installment_amount) / 3)
        }
        forth_ins.installment_date = moment(third_ins.installment_date).add(15, 'days').toDate();
        forth_ins.installment_number = 4;
        forth_ins.is_Paid = false;
        forth_ins.is_verified = false;
        forth_ins.orderID = this.orderDetails.orderID;
        forth_ins.sales_rep = this.orderDetails.sales_rep;
      }
      this.orderInstallments = [first_ins, second_ins, third_ins, forth_ins];
    } else {
      this.alertNotificationService.alertInfo(`Invalid Mode`)
    }
  }

  async refreshCourseBatchAvailable() {
    await this.orderService.orderRegistrationCheck(this.student._id).toPromise()
      .then(res => {
        this.existingRegistrations = res['registrations'] as any[];
        this.availableCourses = res['available_course'] as any[];
        this.validateRegistrations();
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  verifyMode() {
    if (this.orderDetails.payment_mode) {
      var modes = this.orderLines.map(e => e.mode_available).reduce((prev, curr) => prev.concat(curr), [])
      if (!modes.includes(this.orderDetails.payment_mode)) {
        this.alertNotificationService.alertInfo(`${this.orderDetails.payment_mode} not Available. Changing Mode to Mode 1`)
        this.orderDetails.payment_mode = 'mode1'
      }
    } else {
      this.alertNotificationService.alertInfo(`Mode not selected. Changing Mode to Mode 1`)
      this.orderDetails.payment_mode = 'mode1'
    }
  }

  addCoupon() {
    if (this.coupon_code && this.orderDetails.original_amount >= this.coupon_code.minimumbal) {
      if (this.coupon_code.type == 'fixed') {
        this.orderDetails.total_discount = roundOff(this.coupon_code.price)
      }
      else {
        this.orderDetails.total_discount = roundOff((this.orderDetails.original_amount * Number(this.coupon_code.price)) / 100)
      }
      this.orderDetails.total_amount = roundOff(this.orderDetails.original_amount - this.orderDetails.total_discount)
      if (this.orderDetails.payment_mode == 'mode1') {
        this.orderInstallments[0].installment_amount = roundOff(this.orderInstallments[0].installment_amount - this.orderDetails.total_discount)
      } else if (this.orderDetails.payment_mode != 'mode1') {
        if (this.orderInstallments[1].installment_amount > this.orderDetails.total_discount) {
          this.orderInstallments[1].installment_amount = roundOff(this.orderInstallments[1].installment_amount - this.orderDetails.total_discount)
        } else {
          this.orderInstallments[1].installment_amount = roundOff(this.orderInstallments[1].installment_amount + this.orderInstallments[0].installment_amount - this.orderDetails.total_discount - 999)
          this.orderInstallments[0].installment_amount = roundOff(999)
        }
      }
      this.orderLines.forEach(e => {
        e.amount = roundOff(e.original_amount - ((this.orderDetails.total_discount * e.original_amount) / this.orderDetails.original_amount))
      })
    } else if (this.coupon_code) {
      this.isError = true;
      this.errMsg += ` For applying this coupon Minimum Order Amount should be greater than ${this.coupon_code.minimumbal}.`
    }
  }

  createInstallments() {
    this.orderInstallments = []
    this.groupedInstallment.forEach(data => {
      var result: OrderInstallments[] = []
      data.reduce(function (res, value) {
        if (!res[value.installment_number]) {
          res[value.installment_number] = {
            installment_number: value.installment_number,
            installment_amount: 0,
            installment_date: value.installment_date,
            is_Paid: false,
            sgst: 0,
            cgst: 0,
            igst: 0,
            additional_charges: 0
          };
          result.push(res[value.installment_number])
        }
        res[value.installment_number].installment_amount += Number(value.installment_amount);
        if (new Date(res[value.installment_number].installment_date).getTime() > new Date(value.installment_date).getTime()) {
          res[value.installment_number].installment_date = Number(value.installment_date);
        }
        return res;
      }, {});
      this.orderInstallments = this.orderInstallments.concat(result);
    })

  }


  groupBy(list: OrderInstallments[], keyGetter) {
    const map = new Map<string, OrderInstallments[]>();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  createCourseInstallment(c: Course) {
    if (this.orderDetails.payment_mode == 'mode2' && c.paymentmethodtwo) {
      this.installments.push(...[{
        installment_number: 1,
        installment_date: new Date(),
        installment_amount: roundOff(c.paymentmtwo.firstamount)
      }, {
        installment_number: 2,
        installment_date: new Date(c.paymentmtwo.date),
        installment_amount: roundOff(c.paymentmtwo.secondamount)
      }])
      this.orderDetails.total_amount = roundOff(c.paymentmtwo.totalamount)
      this.orderDetails.original_amount = roundOff(c.paymentmtwo.totalamount)
    } else if (this.orderDetails.payment_mode == 'mode3' && c.paymentmethodthree) {
      this.installments.push(...[{
        installment_number: 1,
        installment_date: new Date(),
        installment_amount: roundOff(c.paymentmthree.firstamount)
      }, {
        installment_number: 2,
        installment_date: new Date(c.paymentmthree.firstdate),
        installment_amount: roundOff(c.paymentmthree.secondamount)
      }, {
        installment_number: 3,
        installment_date: new Date(c.paymentmthree.seconddate),
        installment_amount: roundOff(c.paymentmthree.thirdamount)
      }])
      this.orderDetails.total_amount = roundOff(c.paymentmthree.totalamount)
      this.orderDetails.original_amount = roundOff(c.paymentmthree.totalamount)
    } else if (this.orderDetails.payment_mode == 'mode5' && c.paymentmethodfive) {
      this.installments.push(...[{
        installment_number: 1,
        installment_date: new Date(),
        installment_amount: roundOff(c.paymentmfive.firstamount)
      }, {
        installment_number: 2,
        installment_date: new Date(c.paymentmfive.date),
        installment_amount: roundOff(c.paymentmfive.secondamount)
      }])
      this.orderDetails.total_amount = roundOff(c.paymentmfive.totalamount)
      this.orderDetails.original_amount = roundOff(c.paymentmfive.totalamount)
    } else if (Number(c.discountedprice) != 0) {
      this.installments.push(...[{
        installment_number: 1,
        installment_date: new Date(),
        installment_amount: roundOff(c.discountedprice)
      }])
      this.orderDetails.total_amount = roundOff(c.discountedprice)
      this.orderDetails.original_amount = roundOff(c.discountedprice)
    } else {
      this.installments.push(...[{
        installment_number: 1,
        installment_date: new Date(),
        installment_amount: roundOff(c.courseprice)
      }])
      this.orderDetails.total_amount = roundOff(c.courseprice)
      this.orderDetails.original_amount = roundOff(c.courseprice)
    }
    this.orderLines[0].amount = this.orderDetails.total_amount;
    this.orderLines[0].original_amount = this.orderDetails.original_amount;
  }

  createProductInstallment(p: Products) {
    if (Number(p.discounted_price) != 0) {
      this.installments.push(...[{
        installment_number: 1,
        installment_date: new Date(),
        installment_amount: roundOff(p.discounted_price)
      }])
      this.orderDetails.total_amount = roundOff(p.discounted_price)
      this.orderDetails.original_amount = roundOff(p.discounted_price)
    } else {
      this.installments.push(...[{
        installment_number: 1,
        installment_date: new Date(),
        installment_amount: roundOff(p.price)
      }])
      this.orderDetails.total_amount = roundOff(p.price)
      this.orderDetails.original_amount = roundOff(p.price)
    }
    this.orderLines[0].amount = this.orderDetails.total_amount;
    this.orderLines[0].original_amount = this.orderDetails.original_amount;
  }

  createInsigniaInstallment(i: Insignia) {
    if (this.orderDetails.payment_mode == 'mode2' && i.paymentmethodtwo) {
      var seconddate = new Date();
      seconddate.setDate(seconddate.getDate() + i.paymentmtwo.date)
      this.installments.push(...[{
        installment_number: 1,
        installment_date: new Date(),
        installment_amount: roundOff(i.paymentmtwo.firstamount)
      }, {
        installment_number: 2,
        installment_date: new Date(seconddate),
        installment_amount: roundOff(i.paymentmtwo.secondamount)
      }])
      this.orderDetails.total_amount += roundOff(i.paymentmtwo.totalamount)
      this.orderDetails.original_amount += roundOff(i.paymentmtwo.totalamount)

    } else if (this.orderDetails.payment_mode == 'mode3' && i.paymentmethodthree) {
      var seconddate = new Date();
      seconddate.setDate(seconddate.getDate() + i.paymentmthree.firstdate)
      var thirddate = new Date();
      thirddate.setDate(thirddate.getDate() + i.paymentmthree.seconddate)
      this.installments.push(...[{
        installment_number: 1,
        installment_date: new Date(),
        installment_amount: roundOff(i.paymentmthree.firstamount)
      }, {
        installment_number: 2,
        installment_date: new Date(seconddate),
        installment_amount: roundOff(i.paymentmthree.secondamount)
      }, {
        installment_number: 3,
        installment_date: new Date(thirddate),
        installment_amount: roundOff(i.paymentmthree.thirdamount)
      }])
      this.orderDetails.total_amount = roundOff(i.paymentmthree.totalamount)
      this.orderDetails.original_amount = roundOff(i.paymentmthree.totalamount)
    } else if (this.orderDetails.payment_mode == 'mode4' && i.paymentmethodfour) {
      var seconddate = new Date();
      seconddate.setDate(seconddate.getDate() + i.paymentmfour.firstdate)
      var thirddate = new Date();
      thirddate.setDate(thirddate.getDate() + i.paymentmfour.seconddate)
      var forthdate = new Date();
      forthdate.setDate(forthdate.getDate() + i.paymentmfour.thirddate)
      this.installments.push(...[{
        installment_number: 1,
        installment_date: new Date(),
        installment_amount: roundOff(i.paymentmfour.firstamount)
      }, {
        installment_number: 2,
        installment_date: new Date(seconddate),
        installment_amount: roundOff(i.paymentmfour.secondamount)
      }, {
        installment_number: 3,
        installment_date: new Date(thirddate),
        installment_amount: roundOff(i.paymentmfour.thirdamount)
      }, {
        installment_number: 4,
        installment_date: new Date(forthdate),
        installment_amount: roundOff(i.paymentmfour.forthamount)
      }])
      this.orderDetails.total_amount = roundOff(i.paymentmfour.totalamount)
      this.orderDetails.original_amount = roundOff(i.paymentmfour.totalamount)
    } else if (Number(i.discountedprice) != 0) {
      this.installments.push(...[{
        installment_number: 1,
        installment_date: new Date(),
        installment_amount: roundOff(i.discountedprice)
      }])
      this.orderDetails.total_amount = roundOff(i.discountedprice)
      this.orderDetails.original_amount = roundOff(i.discountedprice)
    } else {
      this.installments.push(...[{
        installment_number: 1,
        installment_date: new Date(),
        installment_amount: roundOff(i.price)
      }])
      this.orderDetails.total_amount = roundOff(i.price)
      this.orderDetails.original_amount = roundOff(i.price)
    }
    this.orderLines[0].amount = this.orderDetails.total_amount;
    this.orderLines[0].original_amount = this.orderDetails.original_amount;
  }

  createSubscriptionInstallment(e: OrderLines) {
    this.installments.push(...[{
      installment_number: 1,
      installment_date: new Date(),
      installment_amount: roundOff(e.original_amount)
    }])
    this.orderDetails.total_amount = roundOff(e.original_amount)
    this.orderDetails.original_amount = roundOff(e.original_amount)
    this.orderLines[0].amount = this.orderDetails.total_amount;
    this.orderLines[0].original_amount = this.orderDetails.original_amount;
  }

  createInvesmentorInstallment(e: OrderLines) {
    this.installments.push(...[{
      installment_number: 1,
      installment_date: new Date(),
      installment_amount: roundOff(e.original_amount)
    }])
    this.orderDetails.total_amount = roundOff(e.original_amount)
    this.orderDetails.original_amount = roundOff(e.original_amount)
    this.orderLines[0].amount = this.orderDetails.total_amount;
    this.orderLines[0].original_amount = this.orderDetails.original_amount;
  }

  createInvesmentorUpgradeInstallment(e: OrderLines) {
    this.installments.push(...[{
      installment_number: 1,
      installment_date: new Date(),
      installment_amount: roundOff(e.original_amount)
    }])
    this.orderDetails.total_amount = roundOff(e.original_amount)
    this.orderDetails.original_amount = roundOff(e.original_amount)
    this.orderLines[0].amount = this.orderDetails.total_amount;
    this.orderLines[0].original_amount = this.orderDetails.original_amount;
  }

  calculateInsTotals() {
    this.totalInsAmount = this.orderInstallments.filter(f => f.installment_amount).map(e => e.installment_amount).reduce((acc, value) => Number(acc) + Number(value), 0)
    var sgst = this.orderInstallments.filter(f => f.sgst).map(e => e.sgst).reduce((acc, value) => Number(acc) + Number(value), 0)
    var cgst = this.orderInstallments.filter(f => f.cgst).map(e => e.cgst).reduce((acc, value) => Number(acc) + Number(value), 0)
    var igst = this.orderInstallments.filter(f => f.igst).map(e => e.igst).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalAdditionalCharges = this.orderInstallments.filter(f => f.additional_charges).map(e => e.additional_charges).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalInsGst = sgst + cgst + igst;
    this.totalInsDue = this.orderInstallments.filter(f => !f.is_Paid && f.installment_amount).map(e => e.installment_amount).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalInsNetAmount = roundOff(this.totalInsAmount - this.totalInsDue - this.totalInsGst - this.totalAdditionalCharges);
    this.orderDetails.total_amount = this.totalInsAmount;
    this.orderDetails.original_amount = this.totalInsAmount + this.orderDetails.total_discount;
    this.orderLines[0].amount = this.orderDetails.total_amount;
    this.orderLines[0].original_amount = this.orderDetails.original_amount;
  }

  calculateOrderTotals() {
    this.totalOrderItemAmount = this.orderLines.filter(f => f.amount).map(e => e.amount).reduce((acc, value) => Number(acc) + Number(value), 0)
  }

  getNetAmount(o: OrderInstallments) {
    return o.is_Paid ? roundOff(o.installment_amount - o.additional_charges - o.sgst - o.cgst - o.igst) : 0;
  }

  async refreshStudent() {
    await this.userService.getStudents().toPromise()
      .then(res => {
        this.allStudent = res
        if (this.orderDetails && this.orderDetails.student_id) {
          this.student = this.allStudent.find(e => e._id == this.orderDetails.student_id)
        }
        if (this.currentLead) {
          this.student = this.allStudent.find(e => e.telephone == this.currentLead.phone || e.email == this.currentLead.email)
          this.orderDetails.student_id = this.student._id;
        }
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  refreshEmployee() {
    this.employeeService.getAllEmployees('all', Departments.Sales, null).toPromise()
      .then(res => {
        this.allEmployee = res
        if (this.orderDetails && this.orderDetails.sales_rep) {
          this.employee = this.allEmployee.find(e => e.invid == this.orderDetails.sales_rep)
        }
        if (this.currentLead) {
          this.employee = this.allEmployee.find(e => e.invid == this.currentLead.leadowner);
          this.orderDetails.sales_rep = this.employee.invid;
        }
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  refreshCoupon() {
    this.courseService.getallcoupons().toPromise()
      .then(res => {
        this.allCoupon = res
        this.allCoupon = this.allCoupon.filter(e => !e.isexpired && e.approve);
        if (this.orderDetails && this.orderDetails.coupon_code) {
          this.coupon_code = this.allCoupon.find(e => e.couponcode == this.orderDetails.coupon_code)
        }
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  refreshCourse() {
    this.courseService.getAllCourse().toPromise()
      .then(res => {
        this.allCourse = res as Course[];
        this.allCourse = this.allCourse.filter((e) => e.approved)
        this.allCourse = this.allCourse.reverse()
        if (this.currentLead && this.lead_id) {
          this.createLeadToOrder();
        }
        // if (this.orderLines.length > 0 && !this.lead_id) {
        //   this.refreshOrderLines();
        // }
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  refreshInsignia() {
    this.insigniaService.getInsigniaList().toPromise()
      .then(res => {
        this.allInsignia = res as Insignia[];
        this.allInsignia = this.allInsignia.filter((e) => e.approved)
        this.allInsignia = this.allInsignia.reverse()
        if (this.currentLead && this.lead_id) {
          this.createLeadToOrder();
        }
        // if (this.orderLines.length > 0 && !this.lead_id) {
        //   this.refreshOrderLines();
        // }
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  refreshProducts() {
    this.productService.getallPackage().toPromise()
      .then(res => {
        this.allProduct = res;
        this.allProduct = this.allProduct.filter(e => e.approve)
        this.allProduct = this.allProduct.reverse();
        if (this.currentLead && this.lead_id) {
          this.createLeadToOrder();
        }
        // if (this.orderLines.length > 0 && !this.lead_id) {
        //   this.refreshOrderLines();
        // }
      }).catch(err => this.alertNotificationService.alertError(err))
  }
  refreshInvesmentor() {
    this.invesmentorService.getInvesmentorList().toPromise()
      .then(res => {
        this.allInvesmentor = res;
        this.allInvesmentor = this.allInvesmentor.filter(e => e.approved);
        if (this.currentLead && this.lead_id) {
          this.createLeadToOrder();
        }
        // if (this.orderLines.length > 0 && !this.lead_id) {
        //   this.refreshOrderLines();
        // }
      })
      .catch(err => this.alertNotificationService.alertError(err));
  }
  refreshInstructor() {
    this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.allInstructor = res;
        this.allInstructor = this.allInstructor.filter(e => e.approved && !e.deactivate)
        if (this.currentLead && this.lead_id) {
          this.createLeadToOrder();
        }
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  validateAmount(o: OrderLines) {
    // if (o.amount < o.original_amount) {
    //   this.alertNotificationService.alertInfo(`Amount should not be less than orignal price Rs. ${o.original_amount}`)
    //   o.amount = roundOff(o.original_amount);
    // }
    this.calculateOrderTotals()
    if (this.totalInsAmount != 0 && this.totalInsAmount != this.totalOrderItemAmount) {
      this.errMsg += ' Installment Total Amount is not equal to Order Items Total Amount.'
      this.isError = true
    } else {
      this.errMsg = ''
      this.isError = false
    }
  }

  validateInsDate(o: OrderInstallments) {
    this.isButtonDisable = true;
    this.errMsg = 'Please Submit/Update the Order after Changes'
  }

  removeItem(i) {
    this.orderLines.splice(i, 1)
    // this.dataSource.data = [];
    this.applyItemsChanges()
    this.calculateOrderTotals()

    if (this.totalInsAmount != 0 && this.totalInsAmount != this.totalOrderItemAmount) {
      this.errMsg += ' Installment Total Amount is not equal to Order Items Total Amount.'
      this.isError = true
    } else {
      this.errMsg = ''
      this.isError = false
    }
  }

  validateInsAmount(o: OrderInstallments) {
    this.calculateInsTotals()
    if (this.totalInsAmount < this.orderDetails.total_amount) {
      this.errMsg += ' Installment Total Amount is less than Order Total Amount'
      this.isError = true
    } else {
      this.errMsg = ''
      this.isError = false
    }
    this.calculateOrderTotals()
    if (this.totalInsAmount != 0 && this.totalInsAmount != this.totalOrderItemAmount) {
      this.errMsg += ' Installment Total Amount is not equal to Order Items Total Amount.'
      this.isError = true
    } else {
      this.errMsg = ''
      this.isError = false
    }
    this.isButtonDisable = true;
    this.errMsg = 'Please Submit/Update the Order after Changes'
  }

  UserSearchFn(term: string, item: User) {
    term = term.toLowerCase();
    return (item.fullName && item.fullName.toLowerCase().indexOf(term) > -1) || (item.invid && item.invid.toLowerCase().indexOf(term) > -1);
  }

  CourseSearchFn(term: string, item: Course) {
    term = term.toLowerCase();
    return item.coursename.toLowerCase().indexOf(term) > -1 || item.coursecode.toLowerCase().indexOf(term) > -1 || (item.short_name && item.short_name.toLowerCase().indexOf(term) > -1);
  }

  InsigniaSearchFn(term: string, item: Insignia) {
    term = term.toLowerCase();
    return item.name.toLowerCase().indexOf(term) > -1 || item.code.toLowerCase().indexOf(term) > -1;
  }

  ProductSearchFn(term: string, item: Products) {
    term = term.toLowerCase();
    return item.name.toLowerCase().indexOf(term) > -1 || item.productid.toLowerCase().indexOf(term) > -1 || item.type.toLowerCase().indexOf(term) > -1;
  }
  InvesmentorSearchFn(term: string, item: Invesmentor) {
    term = term.toLowerCase();
    return item.name.toLowerCase().indexOf(term) > -1 || item.code.toLowerCase().indexOf(term) > -1;
  }
  serviceTypeValidation(ol: OrderLines) {
    ol.amount = 0;
    ol.item_code = null;
    ol.item_id = null;
    ol.item_name = null;
    ol.mode_available = [];
    ol.original_amount = 0;
    ol.preferred_ins_id = null;
    ol.subscription_days = 0;
    if (this.orderLines.filter(e => e.item_type == 'SUBSCRIPTION' || e.item_type == 'INSIGNIA_SUBSCRIPTION').length > 1) {
      this.errMsg += ' You cant Purchase two subscription at a single order. Please create a separate order'
      this.isError = true
    } else {
      this.errMsg = ''
      this.isError = false
    }
  }

  selectSubscription(s: Subscriptionpackage, p: OrderLines) {
    this.isApplyNeeded = true;
    p.amount = roundOff(s.price);
    p.original_amount = roundOff(s.price);
    p.subscription_days = Number(s.days);
    p.mode_available = ['mode1']
  }

  isApplyNeeded = false;
  selectCourseItem(p: OrderLines, s: Course) {
    this.isApplyNeeded = true;
    if (s) {
      p.item_code = s.coursecode
      p.item_name = s.coursename
      if (p.item_type == 'SUBSCRIPTION') {
        p.mode_available = ['mode1']
        this.subscriptionService.getPackagebyId(s.coursesubscription).toPromise()
          .then(res => {
            this.subscribe = res as Subscription;
            this.subscribepackage = this.subscribe.package as Subscriptionpackage[]

            if (this.subscribepackage.length > 0) {
              this.subscriptionFound = true
            } else {
              this.alertNotificationService.alertInfo('No Course Subscription packge Found');
            }

          }).catch(err => this.alertNotificationService.alertError(err));
      } else {
        p.mode_available = ['mode1']
        if (s.paymentmethodtwo) {
          p.mode_available.push('mode2')
        }
        if (s.paymentmethodthree) {
          p.mode_available.push('mode3')
        }
        if (s.paymentmethodfive) {
          p.mode_available.push('mode5')
        }
        p.amount = this.getCoursePrice(s)
        p.original_amount = this.getCoursePrice(s)
      }
    }
  }

  getCoursePrice(c: Course) {
    if (this.orderDetails.payment_mode == 'mode2' && c.paymentmethodtwo) {
      return roundOff(c.paymentmtwo.totalamount);
    } else if (this.orderDetails.payment_mode == 'mode3' && c.paymentmethodthree) {
      return roundOff(c.paymentmthree.totalamount);
    } else if (this.orderDetails.payment_mode == 'mode5' && c.paymentmethodfive) {
      return roundOff(c.paymentmfive.totalamount);
    } else if (Number(c.discountedprice) != 0) {
      return roundOff(c.discountedprice)
    } else {
      return roundOff(c.courseprice)
    }
  }

  selectInvesmentorItem(p: OrderLines, s: Invesmentor) {
    if (!this.orderDetails.student_id) {
      this.alertNotificationService.alertInfo("Select Student");
      p.item_id = null;
      return
    }
    this.isApplyNeeded = true;
    if (s) {
      if (p.item_type === 'INVESMENTOR_UPGRADE') {
        p.mode_available = ['mode1'];
        p.item_code = s.code
        this.fetchAvailableInvesmentorUpgrades(p.item_id);
      } else {
        p.item_code = s.code
        p.item_name = s.name
        p.amount = this.getInvesmentorPrice(s)
        p.original_amount = this.getInvesmentorPrice(s)
        p.mode_available = ['mode1']
      }
    }
  }
  selectProductItem(p: OrderLines, s: Products) {
    this.isApplyNeeded = true;
    p.item_code = s.productid
    p.item_name = s.name
    p.amount = this.getProductPrice(s)
    p.original_amount = this.getProductPrice(s)
    p.mode_available = ['mode1']
  }
  getProductPrice(c: Products) {
    if (Number(c.discounted_price) != 0) {
      return roundOff(c.discounted_price)
    } else {
      return roundOff(c.price)
    }
  }
  getInvesmentorPrice(c: Invesmentor) {
    if (Number(c.discountedprice) != 0) {
      return roundOff(c.discountedprice)
    } else {
      return roundOff(c.price)
    }
  }
  selectInsigniaItem(p: OrderLines, s: Insignia) {
    this.isApplyNeeded = true;
    if (s) {
      p.item_code = s.code
      p.item_name = s.name
      if (p.item_type == 'INSIGNIA_SUBSCRIPTION') {
        p.mode_available = ['mode1']
        this.subscriptionService.getPackagebyId(s.subscription).toPromise()
          .then(res => {
            this.subscribe = res as Subscription;
            this.subscribepackage = this.subscribe.package as Subscriptionpackage[]

            if (this.subscribepackage.length > 0) {
              this.subscriptionFound = true
            } else {
              this.alertNotificationService.alertInfo('No Insignia Subscription packge Found');
            }

          }).catch(err => this.alertNotificationService.alertError(err));
      } else {
        p.mode_available = ['mode1']
        if (s.paymentmethodtwo) {
          p.mode_available.push('mode2')
        }
        if (s.paymentmethodthree) {
          p.mode_available.push('mode3')
        }
        if (s.paymentmethodfour) {
          p.mode_available.push('mode4')
        }
        p.amount = this.getInsigniaPrice(s)
        p.original_amount = this.getInsigniaPrice(s)
      }
    }
  }

  getInsigniaPrice(c: Insignia) {
    if (this.orderDetails.payment_mode == 'mode2' && c.paymentmethodtwo) {
      return roundOff(c.paymentmtwo.totalamount);
    } else if (this.orderDetails.payment_mode == 'mode3' && c.paymentmethodthree) {
      return roundOff(c.paymentmthree.totalamount);
    } else if (this.orderDetails.payment_mode == 'mode4' && c.paymentmethodfour) {
      return roundOff(c.paymentmfour.totalamount);
    } else if (Number(c.discountedprice) != 0) {
      return roundOff(c.discountedprice)
    } else {
      return roundOff(c.price)
    }
  }

  selectInvesmentorUpgrade(s, p: OrderLines) {
    this.isApplyNeeded = true;
    if (s) {
      p.item_code = s.item_code;
      p.item_id = s.item_id;
      p.item_name = s.item_name;
      p.amount = s.price;
      p.original_amount = s.price;
    }
  }

  shortClose() {
    this.orderService.shortClose(this.orderId).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess("Order Short Closed")
        this.getOrder();
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  getOrder() {
    if (this.orderId) {
      this.orderService.getOrder(this.orderId).toPromise()
        .then(res => {
          this.orderDetails = res['orderDetails'];
          this.orderLines = res['orderLines'];
          this.orderInstallments = res['orderInstallments'];
          this.isButtonDisable = false;
          // this.refreshOrderLines();
          this.dataSource = new MatTableDataSource(this.orderLines);
          this.dataSource1 = new MatTableDataSource(this.orderInstallments);
          this.student = this.allStudent.find(e => e._id == this.orderDetails.student_id)
          if (this.orderDetails.sales_rep) {
            this.employee = this.allEmployee.find(e => e.invid == this.orderDetails.sales_rep)
          }
          if (this.orderDetails.coupon_code) {
            this.coupon_code = this.allCoupon.find(e => e.couponcode == this.orderDetails.coupon_code)
            this.isCouponApplied = true;
          }
          if (this.orderDetails.lead_id) {
            this.isLeadOrderCreation = true;
          }
          this.isError = false;
          this.errMsg = '';
          this.validateOrder();
          if (this.orderDetails.is_submitted) {
            this.isEditable = false;
            this.isSave = false;
            this.isBatchChangeble = true;
          }
          if (this.orderDetails.is_saved) {
            this.isEditable = true;
            this.isSave = true
            this.isBatchChangeble = false;
          }
          if (this.orderDetails.is_refunded || this.orderDetails.is_shortClosed) {
            this.isFullDisable = true;
            this.isBatchChangeble = false;
          }
          this.paidInstallments = this.orderInstallments.filter(e => e.is_Paid)
          this.dataSource3 = new MatTableDataSource(this.paidInstallments)
          if (this.paidInstallments.length != this.orderInstallments.length) {
            this.isPayDue = true
          } else {
            this.available_Modes.forEach(e => e.disabled = true);
          }
          if (this.paidInstallments.length == 0) {
            this.isBatchChangeble = false;
          }
          if (this.orderDetails.payment_mode === 'mode1' && this.isPayDue) {
            this.available_Modes.forEach(e => e.disabled = false);
          }
          if ((this.orderDetails.payment_mode === 'mode2' || this.orderDetails.payment_mode === 'mode5') && this.isPayDue) {
            this.available_Modes.forEach(e => {
              if (e.value == 'mode1' && this.paidInstallments.length == 1) {
                e.disabled = true
              }
            });
          }
          if (this.orderDetails.payment_mode === 'mode3' && this.isPayDue) {
            this.available_Modes.forEach(e => {
              if (e.value == 'mode1' && this.paidInstallments.length >= 1) {
                e.disabled = true
              } else if ((e.value == 'mode2' || e.value == 'mode5') && this.paidInstallments.length == 2) {
                e.disabled = true
              }
            });
          }
          if (this.orderDetails.payment_mode === 'mode4' && this.isPayDue) {
            this.available_Modes.forEach(e => {
              if (e.value == 'mode1' && this.paidInstallments.length >= 1) {
                e.disabled = true
              } else if ((e.value == 'mode2' || e.value == 'mode5') && this.paidInstallments.length >= 2) {
                e.disabled = true
              } else if (e.value == 'mode3' && this.paidInstallments.length >= 3) {
                e.disabled = true
              }
            });
          }
          this.refreshPaymentLinks();
        }).catch(err => this.alertNotificationService.alertError(err));
    }
  }

  isLeadOrderCreation = false
  async getLead() {
    if (this.lead_id) {
      await this.leadService.getleadbyid(this.lead_id).toPromise()
        .then(res => {
          this.currentLead = res
          this.isLeadOrderCreation = true
          console.log(this.currentLead);
          this.student = this.allStudent.find(e => e.telephone == this.currentLead.phone || e.email == this.currentLead.email)
          if (this.student) {
            this.orderDetails.student_id = this.student._id;
          }
          this.employee = this.allEmployee.find(e => e.invid == this.currentLead.leadowner);

          this.orderDetails.sales_rep = this.currentLead.leadowner;
          this.createLeadToOrder();
        })
    }
  }

  createLeadToOrder() {
    var item;
    if (this.currentLead && this.currentLead.servicecode) {
      this.orderLines = []
      if (this.currentLead.servicetype) {
        this.currentLead.servicetype = this.currentLead.servicetype.toString().toUpperCase();
      }
      if (this.currentLead.servicetype && (this.currentLead.servicetype.toString() == "COURSE" || this.currentLead.servicetype.toString() === 'SUBSCRIPTION')) {
        item = this.allCourse.find(e => e.coursecode == this.currentLead.servicecode);
        if (item) {
          let orderItem = {
            item_type: this.currentLead.servicetype.toString().toUpperCase(),
            item_code: this.currentLead.servicecode,
            item_name: this.currentLead.servicename,
            amount: item.courseprice ? item.courseprice : item.discountedprice,
            item_id: item._id,
            original_amount: item.courseprice,
          }
          this.selectCourseItem(orderItem, item)
          this.orderLines.push(orderItem);
        }
      }


      if (this.currentLead.servicetype && (this.currentLead.servicetype == "INSIGNIA" || this.currentLead.servicetype.toString() === 'INSIGNIA_SUBSCRIPTION')) {
        item = this.allInsignia.find(e => e.code == this.currentLead.servicecode);
        if (item) {
          let orderItem = {
            item_type: this.currentLead.servicetype.toString().toUpperCase(),
            item_code: this.currentLead.servicecode,
            item_name: this.currentLead.servicename,
            amount: item.price ? item.price : item.discountedprice,
            item_id: item._id,
            original_amount: item.price,
          }
          this.selectInsigniaItem(orderItem, item)
          this.orderLines.push(orderItem);
        }
      }


      if (this.currentLead.servicetype && (this.currentLead.servicetype == 'PRODUCT')) {
        item = this.allProduct.find(e => e.productid == this.currentLead.servicecode);
        if (item) {
          let orderItem = {
            item_type: this.currentLead.servicetype.toString().toUpperCase(),
            item_code: this.currentLead.servicecode,
            item_name: this.currentLead.servicename,
            amount: item.price ? item.price : item.discounted_price,
            item_id: item._id,
            original_amount: item.price,
          }
          this.selectProductItem(orderItem, item)
          this.orderLines.push(orderItem);
        }
      }


      if (this.currentLead.servicetype && (this.currentLead.servicetype.toString() == 'INVESMENTOR')) {
        item = this.allInvesmentor.find(e => e.code == this.currentLead.servicecode);
        if (item) {
          let orderItem = {
            item_type: this.currentLead.servicetype.toString().toUpperCase(),
            item_code: this.currentLead.servicecode,
            item_name: this.currentLead.servicename,
            amount: item.price ? item.price : item.discountedprice,
            item_id: item._id,
            original_amount: item.price,
          }
          this.selectInvesmentorItem(orderItem, item)
          this.orderLines.push(orderItem);
        }
      }

      this.dataSource = new MatTableDataSource(this.orderLines);
    }
  }

  refreshOrderLines() {
    var item;
    this.orderLines.forEach(ol => {
      switch (ol.item_type) {
        case 'COURSE':
          item = this.allCourse.find(e => e.coursecode == ol.item_code);
          if (item) this.selectCourseItem(ol, item);
          console.log(ol);
          break;
        case 'SUBSCRIPTION':
        case 'INSIGNIA_SUBSCRIPTION':
        case 'INVESMENTOR':
        case 'PRODUCT':
          ol.mode_available = ['mode1']
          break;
        case 'INSIGNIA':
          item = this.allInsignia.find(e => e.code == ol.item_code);
          if (item) this.selectInsigniaItem(ol, item);
        default:
          break;
      }
    })
  }
  applyFilter(event: Event) {
    if (this.dataSource2) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource2.filter = filterValue.trim().toLowerCase();
    }
  }

  exportLog() {
    if (this.dataSource2) {
      this.exportService.exportonesheet('Order Change Log', this.dataSource2)
    } else {
      this.alertNotificationService.alertInfo('No Log Present')
    }
  }

  downloadInvoice(oi: OrderInstallments) {
    if (oi.is_Paid && oi.is_verified) {
      this.orderService.getInvoice(oi._id).toPromise()
        .then(res => {
          const blob = res as Blob;
          const url = window.URL.createObjectURL(blob);
          var link = document.createElement('a');
          link.href = url;
          link.download = oi.invoice_number.replace(/\//gi, '-') + '.pdf';
          link.click();
          window.URL.revokeObjectURL(url);
        }).catch(err => this.alertNotificationService.alertError(err));
    }
  }

  gstBill() {
    if (!this.student) {
      this.alertNotificationService.alertInfo("Please Select Student");
      return;
    }
    if (this.orderDetails.isGstBillRequired) {
      if (!this.student.gstin) {
        this.alertNotificationService.alertInfo("Please Add GST Number.");
        this.orderDetails.isGstBillRequired = false;
      }
    }
  }

  verifyPayment(oi: OrderInstallments) {
    this.alertNotificationService.alertApprove()
      .then(result => {
        if (result.isConfirmed) {
          this.orderService.verifyPayment({ orderInsID: oi._id }).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Payment Verified Successfully");
              this.getOrder();
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  editPayment(oi: OrderInstallments, component) {
    this.paymentInstallment = oi;
    if (this.paymentInstallment) {
      const modalRef = this.modalService.open(component, { centered: true, scrollable: true, size: 'xl' })
      modalRef.result.then((result) => {
        if (result == 'Save') {
          this.alertNotificationService.alertCustomMsg("are you sure you want to update payment?")
            .then(resulta => {
              if (resulta.isConfirmed) {
                if (this.student.state == 'West Bengal') {
                  this.paymentInstallment.cgst = roundOff(gstAmount(this.paymentInstallment.installment_amount) / 2)
                  this.paymentInstallment.sgst = roundOff(gstAmount(this.paymentInstallment.installment_amount) / 2)
                  this.paymentInstallment.igst = 0
                } else {
                  this.paymentInstallment.igst = gstAmount(this.paymentInstallment.installment_amount)
                  this.paymentInstallment.cgst = 0
                  this.paymentInstallment.sgst = 0
                }
                this.isError = false;
                this.errMsg = '';
                this.validateOrder();
                this.orderService.modifyPayment(this.paymentInstallment).toPromise()
                  .then(res => {
                    this.getOrder();
                    this.alertNotificationService.toastAlertSuccess("Installment Updated Successfully");
                    this.paymentInstallment = new OrderInstallments();
                  }).catch(err => this.alertNotificationService.alertError(err))
              }
            })
        }
      }).catch(err => { })
    }
  }

  batchCourses = [];
  requestBatchChange = new RequestBatchChange();
  changedBatch;
  isBatchChangeble = false;
  allLiveCourse = [];
  allAvailableBatch = [];
  isChangeBatchLoading = false;
  async changeBatch(ol: OrderLines, component) {
    if (ol.item_type == 'COURSE' && ol.item_code) {
      var twoMonthOldDate = new Date();
      twoMonthOldDate.setMonth(twoMonthOldDate.getMonth() - 2);
      var oneYearAfterDate = new Date();
      oneYearAfterDate.setFullYear(oneYearAfterDate.getFullYear() + 1);
      this.isChangeBatchLoading = true;
      await this.courseService.getClassSchedule(twoMonthOldDate, oneYearAfterDate, null, null).toPromise()
        .then(res => {
          this.allLiveCourse = res;
          this.allLiveCourse.forEach(e => {
            this.allAvailableBatch.push({
              _id: e._id,
              coursename: e.course_name,
              coursecode: e.course_code,
              coursestartdate: e.start_date,
              coursetype: e.coursetype,
              courselanguage: e.course_language,
              teachername: e.instructor,
              short_code: e.short_code,
              max_student: e.max_student,
              registration_count: e.registration_count
            })
          })
        }).catch(err => this.alertNotificationService.alertError(err))
      var currentBatch = this.allCourse.find(e => e.coursecode == ol.item_code);
      if (currentBatch) {
        this.batchCourses = this.allAvailableBatch.filter(e => e.short_code == currentBatch.short_code)
      } else {
        this.batchCourses = [...this.allAvailableBatch];
      }
      this.requestBatchChange.orderID = ol.orderID;
      this.requestBatchChange.prev_item_code = ol.item_code;
      this.requestBatchChange.prev_item_id = ol.item_id;
      this.requestBatchChange.prev_item_name = ol.item_name;
      this.requestBatchChange.item_type = ol.item_type;
      this.requestBatchChange.orderLineID = ol._id;
      this.requestBatchChange.requestReason = '';
      this.refreshCourseBatchAvailable();
      this.isChangeBatchLoading = false;
      const modalRef = this.modalService.open(component, { centered: true, scrollable: true, size: 'xl' })
      modalRef.result.then((result) => {
        if (result == 'Save') {
          if (this.changedBatch && this.changedBatch.coursecode != ol.item_code) {
            this.alertNotificationService.alertCustomMsg("Do you want to change this batch")
              .then(result => {
                if (result.isConfirmed) {
                  this.requestBatchChange.item_code = this.changedBatch.coursecode;
                  this.requestBatchChange.item_name = this.changedBatch.coursename;
                  this.requestBatchChange.item_id = this.changedBatch._id;
                  this.orderService.requestBatchChange(this.requestBatchChange).toPromise()
                    .then(res => {
                      this.alertNotificationService.toastAlertSuccess("Batch Change Request Submitted");
                    }).catch(err => this.alertNotificationService.alertError(err));
                }
              })
          }
        }
      })
    }
  }

  existingRegistrations = [];
  availableCourses = [];
  validateRegistrations() {
    if (!this.orderDetails.is_submitted) {
      for (let i of this.orderLines) {
        var checkReg = this.checkRegistration(i);
        if ((i.item_type == 'COURSE' || i.item_type == 'INSIGNIA') && checkReg) {
          this.errMsg += ` ${i.item_code} is Already Purchased.`
          this.isError = true
        } else if ((i.item_type == 'SUBSCRIPTION' || i.item_type == 'INSIGNIA_SUBSCRIPTION') && !checkReg) {
          this.errMsg += ` Student is not Registered to ${i.item_code}.`
          this.isError = true
        } else if (i.item_type == 'COURSE' && !this.availableCourses.includes(i.item_id)) {
          this.errMsg += ` ${i.item_code} Batch is full.`
          this.isError = true
        }
      }
    }
  }

  fetchAvailableInvesmentorUpgrades(invesmentor_id) {
    this.orderService.availableInvesmentorUpgrade(this.orderDetails.student_id, invesmentor_id).toPromise()
      .then(res => {
        this.eligibleUpgrades = res as any[];
        if (this.eligibleUpgrades.length == 0) {
          this.alertNotificationService.alertInfo('Student is Not registered to this Invesmentor or No Available Upgrades Found');
        } else {
          this.invesmentorUpgradeFounds = true;
        }
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  checkRegistration(ol: OrderLines) {
    return this.existingRegistrations.find(e => e.item_id == ol.item_id) ? true : false;
  }

  batchChangeErrMsg = '';
  isBatchChangeError = false;
  validateBatchChange() {
    if (this.changedBatch) {
      if (!this.availableCourses.includes(this.changedBatch._id)) {
        this.batchChangeErrMsg = `${this.changedBatch.coursecode} Batch is full.`
        this.isBatchChangeError = true
      } else {
        this.batchChangeErrMsg = ''
        this.isBatchChangeError = false
      }
    }
  }

  studentChange(event) {
    this.student = event;
    if (!this.student.state) {
      this.alertNotificationService.alertInfo('State Not added by student. Please add state to Create order');
      this.errMsg = 'State Not added by student. Please add state to Create order'
      this.isError = true;
    }
  }

  referralSettings = new ReferralSetting();
  referralBalance = new Referrals();
  refreshReferral() {
    this.referralService.getReferralSettings().toPromise()
      .then(res => {
        this.referralSettings = res;
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  modeChange() {
    if (this.orderDetails.orderID) {
      this.isButtonDisable = true;
      this.errMsg = 'Please Click on Apply then Submit/Update the Order after Changes'
    }
  }

  refreshPaymentLinks() {
    this.orderService.getPaymentLinks(this.orderId).toPromise()
      .then(res => {
        this.allPaymentLinks = res;
        this.dataSource4 = new MatTableDataSource(this.allPaymentLinks);
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  copied() {
    this.alertNotificationService.toastAlertSuccess('Url Copied')
  }
}
