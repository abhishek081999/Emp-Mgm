import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from '../model/subscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private http: HttpClient) { }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };


  postPackage(p: Subscription){
    return this.http.post<Subscription>('/api/v2/newsubscription',p);
  }

  getallPackage(){
    return this.http.get<Subscription[]>('/api/v2/getallsubscription');
  }

  getPackagebyId(id){
    return this.http.get<Subscription>('/api/v2/getsubscriptionbyid/'+id);
  }

  updatePackagebyId(p:Subscription,id){
    return this.http.patch<Subscription>('/api/v2/updatesubscription/'+id,p);
  }

  deletePackage(id){
    return this.http.delete<any>('/api/v2/deletesubscription/'+id);
  }
}
