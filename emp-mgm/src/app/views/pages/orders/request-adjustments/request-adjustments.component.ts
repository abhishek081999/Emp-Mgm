import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestAdjustment, RequestAdjustmentInstallments } from 'src/app/model/orders.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { OrdersService } from 'src/app/services/orders.service';
import { gstAmount } from 'src/app/utility/gstAmount';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-adjustments',
  templateUrl: './request-adjustments.component.html',
  styleUrls: ['./request-adjustments.component.scss']
})
export class RequestAdjustmentsComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrdersService,
    private alertNotificationService: AlertNotificationsService) { }

  @Input() data;
  requestAdjustment: RequestAdjustment = {
    orderID: 0,
    total_discount: 0,
    total_amount: 0,
    original_amount: 0,
    prev_total_amount: 0,
    prev_original_amount: 0,
    prev_total_discount: 0,
    orderLines: [],
    orderInstallments: []
  }

  ngOnInit() {
    this.requestAdjustment = this.data.requestAdjustment;
  }

  submit() {
    this.calculateInsTotals()
    if (!this.errMsg) {
      this.orderService.requestAdjustment(this.requestAdjustment).toPromise()
        .then(res => {
          this.alertNotificationService.toastAlertSuccess("Adjustment Requested")
          this.activeModal.close();
        }).catch(err => this.alertNotificationService.alertError(err));
    } else {
      this.alertNotificationService.alertInfo("Clear all Errors.")
    }
  }

  getGST(r: RequestAdjustmentInstallments) {
    var gst = gstAmount(r.installment_amount);
    r.sgst = this.requestAdjustment.state == 'West Bengal' && r.is_Paid ? gst / 2 : 0;
    r.cgst = this.requestAdjustment.state == 'West Bengal' && r.is_Paid ? gst / 2 : 0;
    r.igst = this.requestAdjustment.state != 'West Bengal' && r.is_Paid ? gst : 0;
    return r.is_Paid ? gst : 0;
  }
  totalInsAmount = 0
  totalOriginalAmount = 0
  totalOrderItemAmount = 0
  errMsg = ''
  calculateInsTotals() {
    this.errMsg = ''
    this.totalInsAmount = this.requestAdjustment.orderInstallments.filter(f => f.installment_amount).map(e => e.installment_amount).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalOriginalAmount = this.requestAdjustment.orderLines.filter(f => f.original_amount).map(e => e.original_amount).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalOrderItemAmount = this.requestAdjustment.orderLines.filter(f => f.amount).map(e => e.amount).reduce((acc, value) => Number(acc) + Number(value), 0)
    if (this.totalInsAmount == this.totalOrderItemAmount) {
      this.requestAdjustment.total_amount = this.totalInsAmount;
    } else {
      this.errMsg += 'Order Installment Total Amount Not equal to Total Order Lines Amount.'
    }
    if (this.totalOrderItemAmount + this.requestAdjustment.total_discount == this.totalOriginalAmount) {
      this.requestAdjustment.original_amount = this.totalOriginalAmount;
    } else {
      this.errMsg += 'Order Original Total Amount Not equal to Total Order Amount + total Discount.'
    }
  }

  async approveRequest() {
    await Swal.fire({
      title: 'Enter Remarks/Comments*',
      inputAutoTrim: true,
      input: 'textarea',
      inputPlaceholder: 'Type your Remarks/Comments',
      showCancelButton:true,
      confirmButtonText: 'Approve'
    }).then(res => {
      if (res.value) {
        var data = {
          _id: this.requestAdjustment._id,
          comments: res.value
        }
        this.orderService.approveRequestAdjustment(data).toPromise()
          .then(res => {
            this.alertNotificationService.toastAlertSuccess('Request Adjustment Approved');
            this.activeModal.close();
          }).catch(err => this.alertNotificationService.alertError(err));
      }
    })
  }
}
