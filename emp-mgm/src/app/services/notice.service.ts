import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notice } from '../model/annoucement.model';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient) { }

  postNotice(notice) {
    return this.http.post<Notice[]>('/api/v2/noticeboard', notice);
  }

  getAllNotice(startdate: string, enddate: string, department: string[], status: string, team:string[], role:string[], tags:string[], limit?, skip?) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate);
    }
    if (enddate) {
      params = params.append('enddate', enddate);

    }
    if (department && department.length > 0) {
      department.forEach(e => params = params.append('department[]', e))
    }
    if (team && team.length > 0) {
      team.forEach(e => params = params.append('team[]', e))
    }
    if (role && role.length > 0) {
      role.forEach(e => params = params.append('role[]', e))
    }
    if (tags && tags.length > 0) {
      tags.forEach(e => params = params.append('tags[]', e))
    }
    if (status) {
      params = params.append('status', status);
    }
    if (limit) {
      params = params.append('limit', limit);
    }
    if (skip) {
      params = params.append('skip', skip);
    }
    return this.http.get<Notice[]>('/api/v2/noticeboard', { params: params });
  }

  deleteNotice(id: string) {
    return this.http.delete<any>('/api/v2/noticeboard/' + id);
  }

  
  approveNotice(id: string) {
    return this.http.patch<any>('/api/v2/noticeboard/approvel/' + id, {});
  }

 
}
