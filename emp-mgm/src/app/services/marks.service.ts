import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Marks } from '../model/marks.model';

@Injectable({
  providedIn: 'root'
})
export class MarksService {

  constructor(private http: HttpClient) { }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  postMarks(m:Marks){
    return this.http.post<Marks>('/api/v2/newmarks',m);
  }

  updateMarks(id,m:Marks){
    return this.http.patch<Marks>('/api/v2/updatemarks/'+id,m);
  }

  getAllMarks(){
    return this.http.get<Marks[]>('/api/v2/getallmarks');
  }


}
