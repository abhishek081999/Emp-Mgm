import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invesletter } from '../model/invesletter.model';

@Injectable({
  providedIn: 'root'
})
export class InvesletterService {

  constructor(private http: HttpClient) { }

  postInvesletter(letter: FormData) {
    return this.http.post<Invesletter>('/api/v2/invesletter', letter);
  }

  getallinvesletter() {
    return this.http.get<Invesletter>('/api/v2/invesletter');
  }

  approveinvesletter(id){
    return this.http.patch<any>('/api/v2/invesletter/approve', {id:id});
  }

  deleteinvesletter(id){
    return this.http.delete<any>('/api/v2/invesletter/'+id);
  }

}
