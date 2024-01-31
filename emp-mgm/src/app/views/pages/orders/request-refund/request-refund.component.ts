import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RefundRequest } from 'src/app/model/refund.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-request-refund',
  templateUrl: './request-refund.component.html',
  styleUrls: ['./request-refund.component.scss']
})
export class RequestRefundComponent implements OnInit {

  requestRefund: RefundRequest = {
    orderID: 0,
    remarks: null,
    refundtype: null,
    isApproved: false
  }
  errMsg = null

  @Input() data;
  
  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrdersService,
    private alertNotificationService: AlertNotificationsService
  ) { }

  ngOnInit(): void {
    this.requestRefund = this.data.requestRefund;
  }

  submit(){
    this.orderService.requestRefund(this.requestRefund).toPromise()
    .then(res => {
      this.alertNotificationService.toastAlertSuccess("Refund Requested")
      this.activeModal.close();
    }).catch(err => this.alertNotificationService.alertError(err));
  }

}
