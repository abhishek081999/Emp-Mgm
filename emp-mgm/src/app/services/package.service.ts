import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { PendingProductBookings, Productpurchase, ProductpurchaseHistory, sendMarketResearch, sendWealthInsights } from '../model/package.model';
import { AwarenessVideo, Products, ProductsDisplay } from '../model/product.model';
import { BookedMentorshipDisplay, MentorshipSlotLists, MentorshipSlots } from '../model/one-to-one-mentorship.model';
import { PortfolioCheckup } from '../model/portfolio-checkup.model';
import { LiveMarketPracticeBookings, LiveMarketPracticeSlots } from '../model/live-market-practice.model';
import { ProductSubscriptionView } from '../model/productpurchase.model';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  constructor(private http: HttpClient) { }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };


  postPackage(p: Products) {
    return this.http.post<Products>('/api/v2/newpackage', p);
  }

  getallPackage() {
    return this.http.get<ProductsDisplay[]>('/api/v2/getallpackage');
  }

  getallProduct() {
    return this.http.get<ProductsDisplay[]>('/api/v2/products?q=all');
  }

  getPackagebyId(id) {
    return this.http.get<Products>('/api/v2/getpackagebyid/' + id);
  }

  updatePackagebyId(p: Products, id) {
    return this.http.patch<Products>('/api/v2/updatepackage/' + id, p);
  }

  approveProduct(data, id) {
    return this.http.patch('/api/v2/approve-product/' + id, data);
  }


  deletePackage(id) {
    return this.http.delete<any>('/api/v2/deletepackage/' + id);
  }

  postproductpurchase(p: Productpurchase[]) {
    return this.http.post<Productpurchase[]>('/api/v2/newpurchaseproduct', p);
  }


  getallpropurchase() {
    return this.http.get<Productpurchase[]>('/api/v2/getallpurchaseproducts');
  }

  getallProPurchaseHis() {
    return this.http.get<ProductpurchaseHistory[]>('/api/v2/product-purchase-history');
  }

  getallproSubsView() {
    return this.http.get<ProductSubscriptionView[]>('/api/v2/product-purchase-details');
  }

  deletepurchaseproducts(id) {
    return this.http.delete<any>('/api/v2/deletepurchaseproducts/' + id);
  }

  updatepurchaseproducts(p: Productpurchase, id) {
    return this.http.patch('/api/v2/updatepurchaseproduct/' + id, p);
  }

  updateproexpiry(id, data) {
    return this.http.patch('/api/v2/product-expiry/' + id, data);
  }

  getpurchaseproductdetails(sid, rid) {
    return this.http.get<Productpurchase[]>('/api/v2/getpurchaseproductdetails/' + sid + '/' + rid);
  }


  //one to one mentorship

  getMentorshipSlotList() {
    return this.http.get<MentorshipSlotLists[]>('/api/v2/mentorship-slots/list');
  }

  availableSlotLists() {
    return this.http.get<MentorshipSlotLists[]>('/api/v2/mentorship-slots/available');
  }

  deleteMentorshipSlots(ids) {
    return this.http.post('/api/v2/mentorship-slots/delete', ids);
  }

  createSlot(data) {
    return this.http.post<MentorshipSlots[]>('/api/v2/mentorship-slots/create', data);
  }

  rescheduleMentorship(data) {
    return this.http.patch('/api/v2/mentorship-slots/reschedule', data);
  }

  getMentorshipSlots(start, end, mentor, product, language) {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start);
    }
    if (end) {
      params = params.append('end', end);
    }
    if (mentor) {
      params = params.append('mentor', mentor);
    }
    if (product) {
      params = params.append('product', product);
    }
    if (language) {
      params = params.append('language', language);
    }
    return this.http.get('/api/v2/mentorship-slots', { params: params });
  }

  getMentorshipBookedSlots() {
    return this.http.get<BookedMentorshipDisplay[]>('/api/v2/mentorship-slots/bookings');
  }

  getMentorshipBookedSlotDetails(id) {
    return this.http.get('/api/v2/mentorship-slots/bookings/' + id);
  }

  addMentorshipVideo(data) {
    return this.http.patch('/api/v2/mentorship-slots/add-video', data);
  }

  bookMentorshipSlot(data) {
    return this.http.patch('/api/v2/mentorship-slots/book', data);
  }

  //Portfolio Checkup

  getPortfolioCheckups() {
    return this.http.get<PortfolioCheckup[]>('/api/v2/portfolio-checkup');
  }

  assignPortfolio(data) {
    return this.http.patch<PortfolioCheckup[]>('/api/v2/portfolio-checkup/assign', data);
  }

  getPortfolioCheckupDetails(id) {
    return this.http.get<PortfolioCheckup>('/api/v2/portfolio-checkup/' + id);
  }

  portfolioCheckupReply(data) {
    return this.http.patch<PortfolioCheckup[]>('/api/v2/portfolio-checkup/reply', data);
  }

  //Live Market Practice

  getLiveMarketPracticeSlots(start, end, mentor, language) {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start);
    }
    if (end) {
      params = params.append('end', end);
    }
    if (mentor) {
      params = params.append('mentor', mentor);
    }
    if (language) {
      params = params.append('language', language);
    }
    return this.http.get('/api/v2/live-market-practice', { params: params });
  }

  getLiveMarketPracticeSlotList() {
    return this.http.get<MentorshipSlotLists[]>('/api/v2/live-market-practice/list');
  }

  createLiveMarketPracticeSlot(data) {
    return this.http.post<LiveMarketPracticeSlots[]>('/api/v2/live-market-practice/create', data);
  }

  getBookedLiveMarketPracticeSlot(start, end, mentor, product, language) {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start);
    }
    if (end) {
      params = params.append('end', end);
    }
    if (mentor) {
      params = params.append('mentor', mentor);
    }
    if (product) {
      params = params.append('product', product);
    }
    if (language) {
      params = params.append('language', language);
    }

    return this.http.get<LiveMarketPracticeBookings[]>('/api/v2/live-market-practice/bookings', { params: params });
  }

  rescheduleLiveMarketPracticeStudent(data) {
    return this.http.post('/api/v2/live-market-practice/student/reschedule', data);
  }

  rescheduleLiveMarketPracticeSlot(data) {
    return this.http.post('/api/v2/live-market-practice/reschedule', data);
  }

  deleteLiveMarketPracticeSlot(data) {
    return this.http.post('/api/v2/live-market-practice/delete', data);
  }

  getRegistertedUserContact(productid) {
    return this.http.get('/api/v2/product-subscription-contacts/' + productid)
  }

  bookLiveMarketSlot(data) {
    return this.http.post('/api/v2/live-market-practice/book', data)
  }

  getpendingproductregistration() {
    return this.http.get<PendingProductBookings[]>('/api/v2/pending-product-booking')
  }


  getSendResearchCatergory() {
    return this.http.get<any[]>('/api/v2/market-research/category')

  }
  postSendResearch(data) {
    return this.http.post('/api/v2/market-research', data)
  }
  getAllMarketResearch() {
    return this.http.get<sendMarketResearch[]>('/api/v2/market-research?q=all')

  }

  approveMarketResearch(id) {
    return this.http.patch<any>('/api/v2/market-research/approve', { id: id });
  }
  deleteMarketResearch(id) {
    return this.http.delete<any>('/api/v2/market-research/' + id);
  }
  getSendWealthInsightsCatergory() {
    return this.http.get<any[]>('/api/v2/wealth-insights/category')

  }
  postSendWealthInsights(data) {
    return this.http.post('/api/v2/wealth-insights', data)
  }
  getAllWealthInsights() {
    return this.http.get<sendWealthInsights[]>('/api/v2/wealth-insights?q=all')

  }

  approveWealthInsights(id) {
    return this.http.patch<any>('/api/v2/wealth-insights/approve', { id: id });
  }
  deleteWealthInsights(id) {
    return this.http.delete<any>('/api/v2/wealth-insights/' + id);
  }

  postAwarenessVideos(data) {
    return this.http.post('/api/v2/awareness-videos', data)
  }
  getAwarenessVideos() {
    return this.http.get<AwarenessVideo[]>('/api/v2/awareness-videos')
  }
  deleteAwarenessVideos(id) {
    return this.http.delete('/api/v2/awareness-videos/' + id)
  }
  approveAwarenessVideos(id) {
    return this.http.patch('/api/v2/awareness-videos/approve', { id: id })
  }
}
