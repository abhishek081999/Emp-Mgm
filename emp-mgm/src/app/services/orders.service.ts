import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Carts } from 'src/app/model/carts.model';
import { OrderHistory, OrderInstallments, Orders, PaymentLinks } from '../model/orders.model';
import { Refunds } from '../model/refund.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {


  constructor(private http: HttpClient) { }

  getAllCarts() {
    return this.http.get<Carts[]>('/api/v2/carts');
  }

  getAllOrders(startdate, enddate, sales_rep) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate);
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    if (sales_rep) {
      params = params.append('sales_rep', sales_rep);
    }
    return this.http.get<Orders[]>('/api/v2/orders', { params: params });
  }

  getOrder(orderid) {
    return this.http.get('/api/v2/orders/' + orderid);
  }

  newOrder(data) {
    return this.http.post('/api/v2/orders/new', data);
  }

  updateOrder(data) {
    return this.http.patch('/api/v2/orders/update', data);
  }

  saveOrder(data) {
    return this.http.post('/api/v2/orders/save', data);
  }

  history(orderid) {
    return this.http.get<OrderHistory[]>('/api/v2/orders/history/' + orderid);
  }

  addPayment(oi: OrderInstallments) {
    return this.http.post('/api/v2/orders/payment', oi);
  }

  getPendingInsVerifications(startdate, enddate, sales_rep) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate);
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    if (sales_rep) {
      params = params.append('sales_rep', sales_rep);
    }
    return this.http.get('/api/v2/orders/payment/verify', { params: params });
  }

  verifyPayment(data) {
    return this.http.post('/api/v2/orders/payment/verify', data);
  }

  modifyPayment(oi: OrderInstallments) {
    return this.http.patch('/api/v2/orders/payment', oi);
  }

  requestAdjustment(data) {
    return this.http.post('/api/v2/orders/adjustment/request', data);
  }

  requestAdjustmentList(q) {
    let params = new HttpParams();
    if (q) {
      params = params.append('q', q);
    }
    return this.http.get('/api/v2/orders/adjustment/request', { params: params });
  }

  requestAdjustmentforOrder(id) {
    return this.http.get('/api/v2/orders/adjustment/request/order/' + id);
  }

  specificrequestAdjustment(rid) {
    return this.http.get(`/api/v2/orders/adjustment/request/${rid}`);
  }

  deleteRequestAdjustment(rid, oid) {
    return this.http.delete(`/api/v2/orders/adjustment/request/${rid}/${oid}`);
  }

  approveRequestAdjustment(data) {
    return this.http.patch(`/api/v2/orders/adjustment/approve`, data);
  }

  requestBatchChange(data) {
    return this.http.post('/api/v2/orders/batchchange/request', data);
  }

  requestBatchChangeList(q) {
    let params = new HttpParams();
    if (q) {
      params = params.append('q', q);
    }
    return this.http.get('/api/v2/orders/batchchange/request', { params: params });
  }

  deleteRequestBatchChange(rid, oid) {
    return this.http.delete(`/api/v2/orders/batchchange/request/${rid}/${oid}`);
  }

  approveRequestBatchChange(data) {
    return this.http.patch(`/api/v2/orders/batchchange/approve`, data);
  }
  approveRefund(data) {
    return this.http.patch(`/api/v2//orders/refund/approve`, data);

  }

  orderRegistrationCheck(id) {
    return this.http.get(`/api/v2/orders/registration/check?id=${id}`);
  }

  requestRefund(data) {
    return this.http.post(`/api/v2/orders/refund/request`, data);
  }
  getRefundRequest(startdate: string, enddate: string, status: string, refundtype: string, student: string, servicecode: string) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate);
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    if (status) {
      params = params.append('status', status);
    }
    if (refundtype) {
      params = params.append('refundtype', refundtype);
    }
    if (student) {
      params = params.append('student', student);
    }
    if (servicecode) {
      params = params.append('servicecode', servicecode);
    }
    return this.http.get<Refunds[]>(`/api/v2/orders/refund/request`, { params: params });
  }

  getOrderByLeadID(id) {
    return this.http.get('/api/v2/orders/lead/' + id);
  }

  getInvoice(id) {
    return this.http.get('/api/v2/orders/getInvoice/' + id, { responseType: 'blob' as 'json' })
  }

  getPaymentHistory(startdate, enddate, sales_rep) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate);
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    if (sales_rep) {
      params = params.append('sales_rep', sales_rep);
    }
    return this.http.get<Refunds[]>(`/api/v2/orders/payment/history`, { params: params });
  }

  shortClose(orderId) {
    return this.http.post('/api/v2/orders/short-close', { orderID: orderId });
  }

  availableInvesmentorUpgrade(student_id, invesmentor_id) {
    return this.http.get(`/api/v2/invesmentor/available-upgrades?student_id=${student_id}&invesmentor_id=${invesmentor_id}`);
  }

  getPaymentLinks(orderID) {
    return this.http.get<PaymentLinks[]>('/api/v2/payment-links/' + orderID);
  }

  newpaymentLink(p: PaymentLinks) {
    return this.http.post<PaymentLinks>('/api/v2/payment-links', p);
  }

  cancelPaymentLink(p) {
    return this.http.patch('/api/v2/payment-links/cancel', p);
  }
}
