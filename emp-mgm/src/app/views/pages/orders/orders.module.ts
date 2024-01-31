import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { OrderListComponent } from './order-list/order-list.component';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { CartListsComponent } from './cart-lists/cart-lists.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { VerifyInstallmentsComponent } from './verify-installments/verify-installments.component';
import { RequestAdjustmentsComponent } from './request-adjustments/request-adjustments.component';
import { RequestAdjustmentListComponent } from './request-adjustment-list/request-adjustment-list.component';
import { RequestAdjustmentHistoryComponent } from './request-adjustment-history/request-adjustment-history.component';
import { RequestBatchChangeComponent } from './request-batch-change/request-batch-change.component';
import { RequestRefundComponent } from './request-refund/request-refund.component';
import { RefundRequestComponent } from './refund-request/refund-request.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { ClipboardModule } from 'ngx-clipboard';


@NgModule({
  declarations: [OrdersComponent, OrderListComponent, OrderDetailsComponent, CartListsComponent, VerifyInstallmentsComponent, RequestAdjustmentsComponent, RequestAdjustmentListComponent, RequestAdjustmentHistoryComponent, RequestBatchChangeComponent, RequestRefundComponent, RefundRequestComponent, PaymentHistoryComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    FeahterIconModule,
    ClipboardModule
  ]
})
export class OrdersModule { }
