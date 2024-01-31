import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Certificate } from '../model/certificate.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  

  constructor(private http: HttpClient) { }

  getAllcer(){
    return this.http.get<Certificate[]>('/api/v2/getallcertificatereq');
  }

  updatecer(certicate:Certificate){
    return this.http.patch('/api/v2/updatecertificatereq/'+certicate._id,certicate);
  }

  getmyCer(userid,courseid){
    return this.http.get<Blob>('/api/v2/certificate?courseid='+courseid+'&studentid='+userid, {responseType: 'blob' as 'json'});
  }
}
