import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Invesmentor, InvesmentorItem, InvesmentorRegistration, InvesmentorRegistrationDisp } from '../model/invesmentor.model';

@Injectable({
  providedIn: 'root'
})
export class InvesmentorService {

  // updateInvesmentorbundle(fd: FormData) {
  //   throw new Error('Method not implemented.');
  // }
  // postFile: any;


  constructor(private http: HttpClient) { }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };


  getInvesmentor() {
    return this.http.get<InvesmentorItem[]>('/api/v2/invesmentor-item-list');
  }

  getInvesmentorList() {
    return this.http.get<Invesmentor[]>('/api/v2/invesmentor');
  }

  postInvesmentorbundle(invesmentor: FormData) {
    return this.http.post('/api/v2/invesmentor', invesmentor);
  }

  updateTempBanned(data) {
    return this.http.patch('/api/v2/invesmentor/temporarybanned', data)
  }

  getInvesmentorbyId(insignia_id) {
    return this.http.get<Invesmentor>('/api/v2/invesmentor-id/' + insignia_id);
  }

  updateInvesmentor(invesmentor: FormData) {
    return this.http.patch<Invesmentor>('/api/v2/invesmentor', invesmentor);
  }

  deleteInvesmentor(Invesmentor_id) {
    return this.http.delete<any>('/api/v2/invesmentor/' + Invesmentor_id);
  }

  approve(body) {
    return this.http.patch<any>('/api/v2/invesmentor/approve', body);
  }

  invesmentorBooking(data) {
    return this.http.post('/api/v2/invesmentor/registration', data);
  }

  addInvesmentorAddon(data){
    return this.http.post('/api/v2/invesmentor/registration/addon', data);
  }

  invesmentorRegistration(student_id) {
    return this.http.get('/api/v2/my-invesmentor/active-plan/' + student_id);
  }

  allInvesmentorRegistrations() {
    return this.http.get<InvesmentorRegistration[]>('/api/v2/invesmentor-registration');
  }

  allInvesmentorRegistrationsDisp() {
    return this.http.get<InvesmentorRegistrationDisp[]>('/api/v2/invesmentor-reg-disp');
  }

  registercoursebatch(data, Invesmentor_id) {
    return this.http.patch<any>('/api/v2/invesmentor-course-reg/' + Invesmentor_id, data);
  }


}
