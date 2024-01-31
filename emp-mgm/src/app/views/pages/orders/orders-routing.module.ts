import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartListsComponent } from './cart-lists/cart-lists.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderListComponent } from './order-list/order-list.component';
import { RequestAdjustmentListComponent } from './request-adjustment-list/request-adjustment-list.component';
import { RequestBatchChangeComponent } from './request-batch-change/request-batch-change.component';
import { VerifyInstallmentsComponent } from './verify-installments/verify-installments.component';
import { RefundRequestComponent } from './refund-request/refund-request.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';

const routes: Routes = [
  {
    path: '',
    component: OrderListComponent
  },
  {
    path: 'adjustment-request',
    component: RequestAdjustmentListComponent
  },
  {
    path: 'verification-pending',
    component: VerifyInstallmentsComponent
  },
  {
    path: 'batch-change-request',
    component: RequestBatchChangeComponent
  },
  {
    path: 'carts',
    component: CartListsComponent
  },
  {
    path: 'new-order',
    component: OrderDetailsComponent
  },
  {
    path: 'refund-request',
    component: RefundRequestComponent
  },
  {
    path: 'payment-history',
    component: PaymentHistoryComponent
  },
  {
    path: ':orderId',
    component: OrderDetailsComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
