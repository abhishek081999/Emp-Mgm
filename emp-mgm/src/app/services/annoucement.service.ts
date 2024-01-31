import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Annoucement } from '../model/annoucement.model';

@Injectable({
  providedIn: 'root'
})
export class AnnoucementService {


  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient) { }

  postAnnoucement(annoucement: FormData) {
    return this.http.post<Annoucement[]>('/api/v2/announcement', annoucement);
  }

  approveAnnouncement(id: string) {
    return this.http.patch<any>('/api/v2/announcement/approve', {
      id: id
    });
  }

  getAllAnnoucement(q?: string, limit?: string, skip?: string) {
    let params = new HttpParams();
    if (q) {
      params = params.append('q', q);
    }
    if (limit) {
      params = params.append('limit', limit);

    }
    if (skip) {
      params = params.append('skip', skip);

    }
    return this.http.get<Annoucement[]>('/api/v2/announcement', { params: params });
  }

  deleteAnnoucement(id: string) {
    return this.http.delete<any>('/api/v2/announcement/' + id);
  }

  getWPTemplate() {
    return this.http.get('/api/v2/whatsappp-template');
  }
}
