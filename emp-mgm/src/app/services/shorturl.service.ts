import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Shorturl } from '../model/shorturl.model';

@Injectable({
  providedIn: 'root'
})
export class ShorturlService {

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient) { }

  createshorturl(s: FormData){
    return this.http.post<Shorturl>('/api/v2/short-url',s);
  }

  getallshorturl(){
    return this.http.get<Shorturl[]>('/api/v2/short-url');
  }

  editshorturl(s: Shorturl){
    return this.http.patch<Shorturl>('/api/v2/short-url',s);
  }

  deleteshorturl(id: string){
    return this.http.delete<any>('/api/v2/short-url/'+id);
  }

}
