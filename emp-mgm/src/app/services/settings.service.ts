import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ZoomAccount } from '../model/zoomAccount.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient) { }

  getAllZoomAccount() {
    return this.http.get<ZoomAccount[]>('/api/v2/zoom-accounts');
  }

  AddZoomAccount(data) {
    return this.http.post<ZoomAccount>('/api/v2/zoom-accounts',data);
  }

  toggleZoomAccountStatus(data) {
    return this.http.patch<ZoomAccount>('/api/v2/zoom-accounts',data);
  }

  getCurrentTime() {
    return this.http.get('/api/v2/getcurrenttime');
  }

  // ----------> Freshdesk Agents APIs

  getfreshdeskagentsList(startdate: string, enddate: string, department: string, employee: string, manager: string , StatusFilter: string) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate); //----------> Get API For Freshdesk Agents List
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    if (department) {
      params = params.append('department', department);
    }
    if (employee) {
      params = params.append('employee', employee);
    }
    if (manager) {
      params = params.append('manager', manager);
    }
    if (StatusFilter) {
      params = params.append('StatusFilter', StatusFilter);
    }
    return this.http.get<any>('/api/v2/freshdeskagents', { params: params });
  }

  postsyncthechanges() {
    return this.http.post('/api/v2/freshdeskagents', {} ); //-----> Post API For Sync the new Chnages In Freshdesk Agents
  }
  freshdeskupdateemployee(data) {
    return this.http.patch('/api/v2/freshdeskagents/employee', data);  //--------> Update API For Employee In Freshdesk Agents
  }

  // -----------> Stringee Agents APIs

  postsyncstringeeagentschanges(data){
    return this.http.post('/api/v2/stringee-agents', data ); // ----> Post API For Sync the new Chnages In Stringee Agents
  }

  getstringeeagentsList(startdate: string, enddate: string, department: string, employee: string, manager: string ) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate); // ----> Get API For Stringee Agents List
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    if (department) {
      params = params.append('department', department);
    }
    if (employee) {
      params = params.append('employee', employee);
    }
    if (manager) {
      params = params.append('manager', manager);
    }
    return this.http.get<any>('/api/v2/stringee-agents', { params: params });
  }

  stringeeagentsupdateemployee(data) {
    return this.http.patch('/api/v2/stringee-agents/employee', data);  //-----> Update API For Employee In Stringee Agents
  }
}
