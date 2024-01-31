import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Referrals, ReferralSetting, Transaction } from '../model/referral.model';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {


  constructor(private http: HttpClient) { }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  getReferral() {
    return this.http.get<Referrals[]>('/api/v2/referrals');
  }
  getReferralTransaction(){
    return this.http.get<Transaction[]>('/api/v2/referrals/transactions');
  }
  postNewTran(data){
    return this.http.post('/api/v2/referrals/transactions', data)
  }
  updateRef(data){
    return this.http.patch<any>('/api/v2/referrals/status', data);

  }
  getReferralSettings() {
    return this.http.get<ReferralSetting>('/api/v2/referrals/settings');
  }
  postReferralSettings(data){
    return this.http.post('/api/v2/referrals/settings', data)

  }


}
