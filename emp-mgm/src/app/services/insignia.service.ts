import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Insignia, InsigniaItem, InsigniaRegistration, InsigniaRegistrationDisp } from '../model/insignia.model';

@Injectable({
  providedIn: 'root'
})
export class InsigniaService {


  constructor(private http: HttpClient) { }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };


  getInsignia() {
    return this.http.get<InsigniaItem[]>('/api/v2/insignia-item-list');
  }

  getInsigniaList() {
    return this.http.get<Insignia[]>('/api/v2/insignia');
  }
  postInsigniabundle(insignia: Insignia) {
    return this.http.post('/api/v2/insignia', insignia);
  }

  updateTempBanned(data){
    return this.http.patch('/api/v2/insignia/temporarybanned', data)
  }
  getInsigniabyId(insignia_id) {
    return this.http.get<Insignia>('/api/v2/insignia-id/' + insignia_id);
  }
  updateInsignia(insignia: Insignia) {
    return this.http.patch<Insignia>('/api/v2/insignia', insignia);
  }
  deleteInsignia(Insignia_id) {
    return this.http.delete<any>('/api/v2/insignia/' + Insignia_id);
  }
  approve(body) {
    return this.http.patch<any>('/api/v2/insignia/approve', body);
  }
  insigniaBooking(data){
    return this.http.post('/api/v2/insignia/purchase', data);
  }
  insigniaregistration(student_id,code){
    return this.http.get('/api/v2/my-insignia/'+student_id+'/'+code);
  }
  allinsigniaregistration(){
    return this.http.get<InsigniaRegistration[]>('/api/v2/insignia-registration');
  }
  allinsigniaregistrationdisp(){
    return this.http.get<InsigniaRegistrationDisp[]>('/api/v2/insignia-reg-disp');
  }

  registercoursebatch(data,Insignia_id) {
    return this.http.patch<any>('/api/v2/insignia-course-reg/' + Insignia_id,data);
  }
}
